'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

import SnowEffect from '@/components/SnowEffect'

import {
  getAllDonationsWithDetails,
  getGenderSplit,
  getAgeGroupSplit,
  getDepartmentStats,
  getTopDonorsByCash,
  getDonationStats,
  getChildrenProgress,
} from '@/app/actions'
import { isAuthenticated, logout } from '@/app/auth/actions'

type ViewMode = 'department' | 'all'

interface DonationRow {
  id: string
  childName: string
  donorName: string
  donorEmail: string | null
  departmentName: string
  donationType: 'gift' | 'cash'
  amount: number | null
  childAge: number
  childGender: string
  giftIdeas: string
  createdAt: Date
}

interface GenderSplit {
  male: number
  female: number
  total: number
}

interface AgeGroupSplit {
  ageGroups: Array<{
    label: string
    count: number
    percentage: number
  }>
  total: number
}

interface DepartmentStat {
  name: string
  donationCount: number
  totalAmount: number
  giftCount: number
  cashCount: number
}

interface TopDonor {
  donorName: string
  departmentName: string
  totalCashAmount: number
  totalDonations: number
  cashDonations: number
}

export default function StatsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('department')
  const [currentPage, setCurrentPage] = useState(1)
  const [donations, setDonations] = useState<DonationRow[]>([])
  const [totalDonations, setTotalDonations] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [genderSplit, setGenderSplit] = useState<GenderSplit | null>(null)
  const [ageGroupSplit, setAgeGroupSplit] = useState<AgeGroupSplit | null>(null)
  const [departmentStats, setDepartmentStats] = useState<DepartmentStat[]>([])
  const [topDonors, setTopDonors] = useState<TopDonor[]>([])
  const [totalCashRaised, setTotalCashRaised] = useState(0)
  const [childrenProgress, setChildrenProgress] = useState({ assigned: 0, total: 160, percentage: 0 })
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [showExportDropdown, setShowExportDropdown] = useState(false)

  const pageSize = 25

  // Check authentication on mount
  useEffect(() => {
    async function checkAuth() {
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        router.push('/stats/login')
      } else {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [router])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showExportDropdown && !target.closest('.relative')) {
        setShowExportDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportDropdown])

  // Fetch all data
  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      const sortBy = viewMode === 'department' ? 'department' : 'date'

      const [donationsResult, genderResult, ageResult, deptResult, topDonorsResult, donationStatsResult, progressResult] =
        await Promise.all([
          getAllDonationsWithDetails({
            page: currentPage,
            pageSize,
            sortBy,
          }),
          getGenderSplit(),
          getAgeGroupSplit(),
          getDepartmentStats(),
          getTopDonorsByCash(10),
          getDonationStats(),
          getChildrenProgress(),
        ])

      if (donationsResult.success) {
        setDonations(donationsResult.data.donations)
        setTotalDonations(donationsResult.data.total)
        setTotalPages(donationsResult.data.totalPages)
      }

      if (genderResult.success) {
        setGenderSplit(genderResult.data)
      }

      if (ageResult.success) {
        setAgeGroupSplit(ageResult.data)
      }

      if (deptResult.success) {
        setDepartmentStats(deptResult.data)
      }

      if (topDonorsResult.success) {
        setTopDonors(topDonorsResult.data)
      }

      if (donationStatsResult.success) {
        setTotalCashRaised(donationStatsResult.data.totalCashAmount)
      }

      if (progressResult.success) {
        setChildrenProgress(progressResult.data)
      }

      setLoading(false)
    }

    fetchData()
  }, [currentPage, viewMode])

  // Export to CSV
  const exportToCSV = (filterType: 'gift' | 'cash') => {
    // Filter donations by type
    const filteredDonations = donations.filter((d) => d.donationType === filterType)

    const headers = [
      'Child Name',
      'Donor Name',
      'Donor Email',
      'Department',
      'Donation Type',
      'Amount',
      'Age',
      'Gender',
      'Gift Ideas',
      'Date',
    ]

    const rows = filteredDonations.map((d) => [
      d.childName,
      d.donorName,
      d.donorEmail || 'N/A',
      d.departmentName,
      d.donationType === 'cash' ? `£${d.amount?.toFixed(2)}` : 'Gift',
      d.amount?.toFixed(2) || 'N/A',
      d.childAge,
      d.childGender,
      `"${d.giftIdeas}"`,
      new Date(d.createdAt).toLocaleDateString(),
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `donations-${filterType}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    setShowExportDropdown(false)
  }

  // Group donations by department for department view
  const groupedDonations = viewMode === 'department'
    ? donations.reduce((acc, donation) => {
        if (!acc[donation.departmentName]) {
          acc[donation.departmentName] = []
        }
        acc[donation.departmentName].push(donation)
        return acc
      }, {} as Record<string, DonationRow[]>)
    : {}

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden flex items-center justify-center">
        <SnowEffect />
        <div className="relative z-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          <p className="mt-4 text-slate-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Snow Effect */}
      <SnowEffect />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-red-500 to-green-500 bg-clip-text text-transparent">
              Christmas Donations Admin Dashboard
            </h1>
            <p className="text-slate-300 text-lg">
              Manage and view all donation records
            </p>
          </div>
        </motion.div>

        {/* View Toggle + Export Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          {/* Pill Toggle */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-1.5 rounded-full border border-slate-700 flex gap-1">
            <button
              onClick={() => {
                setViewMode('department')
                setCurrentPage(1)
              }}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${
                viewMode === 'department'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              By Department
            </button>
            <button
              onClick={() => {
                setViewMode('all')
                setCurrentPage(1)
              }}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 ${
                viewMode === 'all'
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Entries
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span>Export to CSV</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-10">
                <button
                  onClick={() => exportToCSV('gift')}
                  className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors flex flex-col"
                >
                  <span className="font-medium">Gift Donations Only</span>
                  <span className="text-xs text-slate-400">Export all gift donations</span>
                </button>
                <button
                  onClick={() => exportToCSV('cash')}
                  className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors flex flex-col border-t border-slate-700"
                >
                  <span className="font-medium">Cash Donations Only</span>
                  <span className="text-xs text-slate-400">Export all cash donations</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Donations Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden mb-8"
        >
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-yellow-400">
              Donations Table
            </h2>
            <span className="text-slate-300 font-semibold">
              {totalDonations} total
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
              <p className="mt-4 text-slate-400">Loading donations...</p>
            </div>
          ) : viewMode === 'department' ? (
            // Grouped by Department View
            <div className="divide-y divide-slate-700">
              {Object.entries(groupedDonations).map(([deptName, deptDonations]) => (
                <details key={deptName} className="group">
                  <summary className="px-4 py-3 cursor-pointer hover:bg-slate-700/50 flex justify-between items-center">
                    <span className="font-bold text-yellow-400 text-lg">
                      {deptName}
                    </span>
                    <span className="text-slate-400 font-semibold">
                      {deptDonations.length} donations
                    </span>
                  </summary>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Child</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Donor</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Donation</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Age</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Gender</th>
                          <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Gift Ideas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {deptDonations.map((donation) => (
                          <tr key={donation.id} className="hover:bg-slate-700/30">
                            <td className="px-4 py-3 text-sm font-medium">{donation.childName}</td>
                            <td className="px-4 py-3 text-sm font-medium">{donation.donorName}</td>
                            <td className="px-4 py-3 text-sm">
                              {donation.donationType === 'cash' ? (
                                <span className="text-green-400 font-bold">
                                  £{donation.amount?.toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-blue-400 font-semibold">Gift</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">{donation.childAge}</td>
                            <td className="px-4 py-3 text-sm capitalize font-medium">{donation.childGender}</td>
                            <td className="px-4 py-3 text-sm text-slate-300 max-w-xs truncate">
                              {donation.giftIdeas}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            // Regular Table View
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Child</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Donor</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Donation</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Age</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Gender</th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Gift Ideas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-sm font-medium">{donation.childName}</td>
                      <td className="px-4 py-3 text-sm font-medium">{donation.donorName}</td>
                      <td className="px-4 py-3 text-sm font-medium">{donation.departmentName}</td>
                      <td className="px-4 py-3 text-sm">
                        {donation.donationType === 'cash' ? (
                          <span className="text-green-400 font-bold">
                            £{donation.amount?.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-blue-400 font-semibold">Gift</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{donation.childAge}</td>
                      <td className="px-4 py-3 text-sm capitalize font-medium">{donation.childGender}</td>
                      <td className="px-4 py-3 text-sm text-slate-300 max-w-xs truncate">
                        {donation.giftIdeas}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="p-4 border-t border-slate-700 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Previous
              </button>
              <span className="text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-yellow-400">
            Statistics
          </h2>

          {/* Stats Widgets Grid - 4 across */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Cash Raised */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                Total Cash Raised
              </h3>
              <div className="space-y-3">
                <div className="text-4xl font-bold text-green-400">
                  £{totalCashRaised.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-slate-300 font-medium">
                  From {genderSplit?.total || 0} donations
                </div>
              </div>
            </div>

            {/* Children Progress */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                Children Helped
              </h3>
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-green-400">{childrenProgress.assigned}</span>
                  <span className="text-2xl text-slate-400 font-medium">/ {childrenProgress.total}</span>
                </div>
                <div className="text-sm text-slate-300 font-medium">
                  {childrenProgress.percentage}% complete
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${childrenProgress.percentage}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Gender Split */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                Gender Split
              </h3>
              {genderSplit && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Female:</span>
                    <span className="font-bold">
                      {genderSplit.female} ({Math.round((genderSplit.female / genderSplit.total) * 100)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Male:</span>
                    <span className="font-bold">
                      {genderSplit.male} ({Math.round((genderSplit.male / genderSplit.total) * 100)}%)
                    </span>
                  </div>
                  <div className="mt-4 h-3 bg-slate-700 rounded-full overflow-hidden flex">
                    <div
                      className="bg-pink-500"
                      style={{ width: `${(genderSplit.female / genderSplit.total) * 100}%` }}
                    />
                    <div
                      className="bg-blue-500"
                      style={{ width: `${(genderSplit.male / genderSplit.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Age Groups - Individual Ages */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-yellow-400">
                Age Breakdown
              </h3>
              {ageGroupSplit && (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {ageGroupSplit.ageGroups.map((group) => (
                    <div key={group.label} className="flex justify-between items-center text-sm">
                      <span className="font-medium">Age {group.label}:</span>
                      <span className="font-bold">
                        {group.count} ({group.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Department Stats - Full Width Below */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">
              By Department
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departmentStats.map((dept) => (
                <div key={dept.name} className="bg-slate-700/30 rounded-lg p-4">
                  <div className="font-bold text-sm mb-2">{dept.name}</div>
                  <div className="space-y-1 text-slate-300 text-xs font-medium">
                    <div className="flex justify-between">
                      <span>Donations:</span>
                      <span>{dept.donationCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="text-green-400">£{dept.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Donors Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-yellow-400">
              Top 10 Donors by Cash Value
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">#</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Donor Name</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-200">Total Value</th>
                  <th className="px-4 py-3 text-left text-sm font-bold text-slate-200"># Donations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {topDonors.map((donor, index) => (
                  <tr key={donor.donorName} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-sm font-bold text-yellow-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{donor.donorName}</td>
                    <td className="px-4 py-3 text-sm font-medium">{donor.departmentName}</td>
                    <td className="px-4 py-3 text-sm text-green-400 font-bold">
                      £{donor.totalCashAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{donor.totalDonations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
