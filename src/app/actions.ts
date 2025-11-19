'use server'

import {
  childService,
  donationService,
  departmentService,
} from '@/lib/services/business'

import type {
  Child,
  SearchChildParams,
  CreateDonationDto,
  Department,
  Donation,
} from '@/lib/types'

/**
 * Server Action Result Type
 * All Server Actions return this format to properly handle errors
 */
export type ServerActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Get a random unassigned child
 */
export async function getRandomChild(): Promise<ServerActionResult<Child>> {
  try {
    const child = await childService.getRandomChild()

    if (!child) {
      return {
        success: false,
        error: 'No children available at this time. Please try again later.',
      }
    }

    return {
      success: true,
      data: child,
    }
  } catch (error) {
    console.error('Error in getRandomChild:', error)
    return {
      success: false,
      error: 'Failed to find a child. Please try again.',
    }
  }
}

/**
 * Search for a child by gender and/or age
 * Both parameters are optional - can search by either or both
 */
export async function searchChild(
  params: SearchChildParams
): Promise<ServerActionResult<Child>> {
  try {
    // Validate at least one parameter provided
    if (!params.gender && params.age === undefined) {
      return {
        success: false,
        error: 'Please select at least gender or age.',
      }
    }

    // Validate age if provided
    if (params.age !== undefined && (params.age < 1 || params.age > 16)) {
      return {
        success: false,
        error: 'Age must be between 1 and 16.',
      }
    }

    const child = await childService.searchChild(params)

    if (!child) {
      return {
        success: false,
        error: 'No children match your search criteria. Please try different options.',
      }
    }

    return {
      success: true,
      data: child,
    }
  } catch (error) {
    console.error('Error in searchChild:', error)
    return {
      success: false,
      error: 'Failed to search for children. Please try again.',
    }
  }
}

/**
 * Create a new donation
 */
export async function createDonation(
  data: CreateDonationDto
): Promise<ServerActionResult<Donation>> {
  try {
    // Validate donation data
    if (!data.childId || !data.donorName || !data.departmentId || !data.donationType) {
      return {
        success: false,
        error: 'Please fill in all required fields.',
      }
    }

    if (data.donationType === 'cash' && !data.amount) {
      return {
        success: false,
        error: 'Please enter a donation amount for cash donations.',
      }
    }

    if (data.donationType === 'cash' && data.amount && data.amount <= 0) {
      return {
        success: false,
        error: 'Donation amount must be greater than zero.',
      }
    }

    // Create the donation
    const donation = await donationService.create(data)

    return {
      success: true,
      data: donation,
    }
  } catch (error) {
    console.error('Error in createDonation:', error)

    // Handle known errors
    if (error instanceof Error) {
      if (error.message.includes('Child not found')) {
        return {
          success: false,
          error: 'The selected child could not be found. Please start over.',
        }
      }
      if (error.message.includes('Department not found')) {
        return {
          success: false,
          error: 'The selected department could not be found. Please try again.',
        }
      }
      if (error.message.includes('must include an amount')) {
        return {
          success: false,
          error: 'Cash donations must include an amount.',
        }
      }
    }

    return {
      success: false,
      error: 'Failed to create donation. Please try again.',
    }
  }
}

/**
 * Get all active departments (for dropdown)
 */
export async function getActiveDepartments(): Promise<
  ServerActionResult<Department[]>
> {
  try {
    const departments = await departmentService.getActive()

    return {
      success: true,
      data: departments,
    }
  } catch (error) {
    console.error('Error in getActiveDepartments:', error)
    return {
      success: false,
      error: 'Failed to load departments.',
    }
  }
}

/**
 * Get donation statistics
 */
export async function getDonationStats(): Promise<
  ServerActionResult<{
    totalDonations: number
    totalCashAmount: number
    totalGiftDonations: number
    totalCashDonations: number
  }>
> {
  try {
    const stats = await donationService.getStats()

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Error in getDonationStats:', error)
    return {
      success: false,
      error: 'Failed to load statistics.',
    }
  }
}

/**
 * Get department leaderboard
 */
export async function getDepartmentLeaderboard(): Promise<
  ServerActionResult<
    Array<{
      id: string
      name: string
      active: boolean
      createdAt: Date
      _count: {
        donations: number
      }
      totalAmount?: number
    }>
  >
> {
  try {
    const leaderboard = await departmentService.getLeaderboard()

    return {
      success: true,
      data: leaderboard,
    }
  } catch (error) {
    console.error('Error in getDepartmentLeaderboard:', error)
    return {
      success: false,
      error: 'Failed to load leaderboard.',
    }
  }
}

/**
 * Get count of unassigned children
 */
export async function getUnassignedChildrenCount(): Promise<
  ServerActionResult<number>
> {
  try {
    const count = await childService.getUnassignedCount()

    return {
      success: true,
      data: count,
    }
  } catch (error) {
    console.error('Error in getUnassignedChildrenCount:', error)
    return {
      success: false,
      error: 'Failed to get count.',
    }
  }
}

/**
 * Get latest donation for ticker display
 */
export async function getLatestDonation(): Promise<
  ServerActionResult<{
    donorName: string
    departmentName: string
    donationType: 'gift' | 'cash'
    amount: number | null
    createdAt: Date
    minutesAgo: number
  } | null>
> {
  try {
    const latest = await donationService.getLatest()

    if (!latest) {
      return {
        success: true,
        data: null,
      }
    }

    return {
      success: true,
      data: latest,
    }
  } catch (error) {
    console.error('Error in getLatestDonation:', error)
    return {
      success: false,
      error: 'Failed to get latest donation.',
    }
  }
}

/**
 * Get all donations with full details for admin dashboard
 */
export async function getAllDonationsWithDetails(params?: {
  page?: number
  pageSize?: number
  sortBy?: 'date' | 'department'
}): Promise<
  ServerActionResult<{
    donations: Array<{
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
    }>
    total: number
    page: number
    pageSize: number
    totalPages: number
  }>
> {
  try {
    const page = params?.page || 1
    const pageSize = params?.pageSize || 25
    const skip = (page - 1) * pageSize

    // Build orderBy clause
    const orderBy =
      params?.sortBy === 'department'
        ? [{ departmentName: 'asc' as const }, { createdAt: 'desc' as const }]
        : [{ createdAt: 'desc' as const }]

    const [donations, total] = await Promise.all([
      donationService.getAllWithDetails({ skip, take: pageSize, orderBy }),
      donationService.getTotal(),
    ])

    return {
      success: true,
      data: {
        donations,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  } catch (error) {
    console.error('Error in getAllDonationsWithDetails:', error)
    return {
      success: false,
      error: 'Failed to load donations.',
    }
  }
}

/**
 * Get gender split statistics
 */
export async function getGenderSplit(): Promise<
  ServerActionResult<{
    male: number
    female: number
    total: number
  }>
> {
  try {
    const stats = await donationService.getGenderSplit()
    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Error in getGenderSplit:', error)
    return {
      success: false,
      error: 'Failed to load gender statistics.',
    }
  }
}

/**
 * Get age group statistics
 */
export async function getAgeGroupSplit(): Promise<
  ServerActionResult<{
    ageGroups: Array<{
      label: string
      count: number
      percentage: number
    }>
    total: number
  }>
> {
  try {
    const stats = await donationService.getAgeGroupSplit()
    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Error in getAgeGroupSplit:', error)
    return {
      success: false,
      error: 'Failed to load age statistics.',
    }
  }
}

/**
 * Get department statistics with totals
 */
export async function getDepartmentStats(): Promise<
  ServerActionResult<
    Array<{
      name: string
      donationCount: number
      totalAmount: number
      giftCount: number
      cashCount: number
    }>
  >
> {
  try {
    const stats = await donationService.getDepartmentStats()
    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Error in getDepartmentStats:', error)
    return {
      success: false,
      error: 'Failed to load department statistics.',
    }
  }
}

/**
 * Get top donors by cash value
 */
export async function getTopDonorsByCash(limit: number = 10): Promise<
  ServerActionResult<
    Array<{
      donorName: string
      departmentName: string
      totalCashAmount: number
      totalDonations: number
      cashDonations: number
    }>
  >
> {
  try {
    const topDonors = await donationService.getTopDonorsByCash(limit)
    return {
      success: true,
      data: topDonors,
    }
  } catch (error) {
    console.error('Error in getTopDonorsByCash:', error)
    return {
      success: false,
      error: 'Failed to load top donors.',
    }
  }
}

/**
 * Get children progress (assigned vs total)
 */
export async function getChildrenProgress(): Promise<
  ServerActionResult<{
    assigned: number
    total: number
    percentage: number
  }>
> {
  try {
    const stats = await childService.getProgress()
    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Error in getChildrenProgress:', error)
    return {
      success: false,
      error: 'Failed to load children progress.',
    }
  }
}

/**
 * Get top departments by total donation count (gifts + cash)
 */
export async function getTopDepartmentsByCount(limit: number = 3): Promise<
  ServerActionResult<
    Array<{
      name: string
      totalDonations: number
      totalCashAmount: number
    }>
  >
> {
  try {
    const topDepts = await departmentService.getTopByDonationCount(limit)
    return {
      success: true,
      data: topDepts,
    }
  } catch (error) {
    console.error('Error in getTopDepartmentsByCount:', error)
    return {
      success: false,
      error: 'Failed to load top departments.',
    }
  }
}

/**
 * Get underperforming demographic groups that need more donations
 */
export async function getUnderperformingGroups(): Promise<
  ServerActionResult<{
    message: string | null
    type: 'age' | 'gender' | null
    group: string | null
  }>
> {
  try {
    const result = await donationService.getUnderperformingGroups()
    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('Error in getUnderperformingGroups:', error)
    return {
      success: false,
      error: 'Failed to analyze groups.',
    }
  }
}

/**
 * Update donation amount (for cash donations only)
 */
export async function updateDonationAmount(
  donationId: string,
  newAmount: number
): Promise<ServerActionResult<Donation>> {
  try {
    // Validate amount
    if (!newAmount || newAmount <= 0) {
      return {
        success: false,
        error: 'Amount must be greater than zero.',
      }
    }

    if (newAmount < 5) {
      return {
        success: false,
        error: 'Minimum donation amount is £5.',
      }
    }

    // Update the donation
    const updated = await donationService.updateAmount(donationId, newAmount)

    return {
      success: true,
      data: updated,
    }
  } catch (error) {
    console.error('Error in updateDonationAmount:', error)

    // Handle known errors
    if (error instanceof Error) {
      if (error.message.includes('Donation not found')) {
        return {
          success: false,
          error: 'Donation not found.',
        }
      }
      if (error.message.includes('Can only update amount for cash donations')) {
        return {
          success: false,
          error: 'Can only update amount for cash donations.',
        }
      }
      if (error.message.includes('Amount must be greater than zero')) {
        return {
          success: false,
          error: 'Amount must be greater than zero.',
        }
      }
    }

    return {
      success: false,
      error: 'Failed to update donation amount.',
    }
  }
}
