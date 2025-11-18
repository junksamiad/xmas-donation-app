import { PrismaClient, Prisma } from '@prisma/client'

import { getDatabaseInstance } from '@/lib/db'

import type {
  Donation,
  CreateDonationDto,
  DonationWithRelations,
} from '@/lib/types/donation'

/**
 * DonationService - Business logic for donation management
 *
 * Handles:
 * - Creating donations
 * - Validating donation data
 * - Updating child assignment status
 * - Donation statistics
 */
export class DonationService {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Create a new donation
   * Also marks the child as assigned
   */
  async create(data: CreateDonationDto): Promise<Donation> {
    // Validate: cash donations must have amount
    if (data.donationType === 'cash' && !data.amount) {
      throw new Error('Cash donations must include an amount')
    }

    // Validate: gift donations should not have amount
    if (data.donationType === 'gift' && data.amount) {
      throw new Error('Gift donations should not include an amount')
    }

    // Verify child exists
    const child = await this.db.child.findUnique({
      where: { id: data.childId },
    })

    if (!child) {
      throw new Error('Child not found')
    }

    // Verify department exists
    const department = await this.db.department.findUnique({
      where: { id: data.departmentId },
    })

    if (!department) {
      throw new Error('Department not found')
    }

    // Create donation and update child in a transaction
    const donation = await this.db.$transaction(async (tx) => {
      // Create donation with denormalized fields
      const newDonation = await tx.donation.create({
        data: {
          childId: data.childId,
          childName: child.recipient,
          donorName: data.donorName,
          donorEmail: data.donorEmail || null,
          departmentId: data.departmentId,
          departmentName: department.name,
          donationType: data.donationType,
          amount: data.amount ? new Prisma.Decimal(data.amount) : null,
        },
      })

      // Mark child as assigned
      await tx.child.update({
        where: { id: data.childId },
        data: { assigned: true },
      })

      return newDonation
    })

    // Convert Decimal to number for serialization
    return {
      ...donation,
      amount: donation.amount ? Number(donation.amount) : null,
    }
  }

  /**
   * Get donation by ID with related data
   */
  async getById(id: string): Promise<DonationWithRelations | null> {
    const donation = await this.db.donation.findUnique({
      where: { id },
      include: {
        child: {
          select: {
            id: true,
            recipient: true,
            age: true,
            gender: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!donation) {
      return null
    }

    // Convert Decimal to number
    return {
      ...donation,
      amount: donation.amount ? Number(donation.amount) : null,
    }
  }

  /**
   * Get all donations with optional filters
   */
  async getAll(filters?: {
    departmentId?: string
    donationType?: 'gift' | 'cash'
  }): Promise<DonationWithRelations[]> {
    const donations = await this.db.donation.findMany({
      where: filters,
      include: {
        child: {
          select: {
            id: true,
            recipient: true,
            age: true,
            gender: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Convert Decimal to number for each donation
    return donations.map((donation) => ({
      ...donation,
      amount: donation.amount ? Number(donation.amount) : null,
    }))
  }

  /**
   * Get total donation statistics
   */
  async getStats(): Promise<{
    totalDonations: number
    totalCashAmount: number
    totalGiftDonations: number
    totalCashDonations: number
  }> {
    const [totalDonations, cashDonations, giftDonations, cashSum] =
      await Promise.all([
        this.db.donation.count(),
        this.db.donation.count({ where: { donationType: 'cash' } }),
        this.db.donation.count({ where: { donationType: 'gift' } }),
        this.db.donation.aggregate({
          where: { donationType: 'cash' },
          _sum: { amount: true },
        }),
      ])

    return {
      totalDonations,
      totalCashDonations: cashDonations,
      totalGiftDonations: giftDonations,
      totalCashAmount: cashSum._sum.amount
        ? Number(cashSum._sum.amount)
        : 0,
    }
  }

  /**
   * Get latest donation for ticker display
   */
  async getLatest(): Promise<{
    donorName: string
    departmentName: string
    donationType: 'gift' | 'cash'
    amount: number | null
    createdAt: Date
    minutesAgo: number
  } | null> {
    const latest = await this.db.donation.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        donorName: true,
        departmentName: true,
        donationType: true,
        amount: true,
        createdAt: true,
      },
    })

    if (!latest) {
      return null
    }

    const now = new Date()
    const minutesAgo = Math.floor(
      (now.getTime() - latest.createdAt.getTime()) / 1000 / 60
    )

    return {
      donorName: latest.donorName,
      departmentName: latest.departmentName,
      donationType: latest.donationType as 'gift' | 'cash',
      amount: latest.amount ? Number(latest.amount) : null,
      createdAt: latest.createdAt,
      minutesAgo,
    }
  }

  /**
   * Get all donations with full child details for admin dashboard
   */
  async getAllWithDetails(params: {
    skip?: number
    take?: number
    orderBy?: Prisma.DonationOrderByWithRelationInput | Prisma.DonationOrderByWithRelationInput[]
  }): Promise<
    Array<{
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
  > {
    const donations = await this.db.donation.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: params.orderBy,
      include: {
        child: {
          select: {
            age: true,
            gender: true,
            giftIdeas: true,
          },
        },
      },
    })

    return donations.map((donation) => ({
      id: donation.id,
      childName: donation.childName,
      donorName: donation.donorName,
      donorEmail: donation.donorEmail,
      departmentName: donation.departmentName,
      donationType: donation.donationType as 'gift' | 'cash',
      amount: donation.amount ? Number(donation.amount) : null,
      childAge: donation.child.age,
      childGender: donation.child.gender,
      giftIdeas: donation.child.giftIdeas,
      createdAt: donation.createdAt,
    }))
  }

  /**
   * Get total count of donations
   */
  async getTotal(): Promise<number> {
    return this.db.donation.count()
  }

  /**
   * Get gender split statistics for donated children
   */
  async getGenderSplit(): Promise<{
    male: number
    female: number
    total: number
  }> {
    const [male, female, total] = await Promise.all([
      this.db.donation.count({
        where: {
          child: {
            gender: 'male',
          },
        },
      }),
      this.db.donation.count({
        where: {
          child: {
            gender: 'female',
          },
        },
      }),
      this.db.donation.count(),
    ])

    return { male, female, total }
  }

  /**
   * Get age group split statistics for donated children - by individual ages
   */
  async getAgeGroupSplit(): Promise<{
    ageGroups: Array<{
      label: string
      count: number
      percentage: number
    }>
    total: number
  }> {
    // Get all donations with child ages
    const donations = await this.db.donation.findMany({
      include: {
        child: {
          select: {
            age: true,
          },
        },
      },
    })

    const total = donations.length

    // Group by individual ages
    const ageCounts: Record<number, number> = {}

    donations.forEach((donation) => {
      const age = donation.child.age
      ageCounts[age] = (ageCounts[age] || 0) + 1
    })

    // Sort ages and create groups
    const sortedAges = Object.keys(ageCounts)
      .map(Number)
      .sort((a, b) => a - b)

    const ageGroups = sortedAges.map((age) => ({
      label: age.toString(),
      count: ageCounts[age],
      percentage: total > 0 ? Math.round((ageCounts[age] / total) * 100) : 0,
    }))

    return { ageGroups, total }
  }

  /**
   * Get department statistics with donation counts and totals
   */
  async getDepartmentStats(): Promise<
    Array<{
      name: string
      donationCount: number
      totalAmount: number
      giftCount: number
      cashCount: number
    }>
  > {
    const departments = await this.db.department.findMany({
      where: { active: true },
      include: {
        donations: {
          select: {
            donationType: true,
            amount: true,
          },
        },
      },
      orderBy: {
        donations: {
          _count: 'desc',
        },
      },
    })

    return departments.map((dept) => {
      const giftCount = dept.donations.filter((d) => d.donationType === 'gift').length
      const cashCount = dept.donations.filter((d) => d.donationType === 'cash').length
      const totalAmount = dept.donations
        .filter((d) => d.donationType === 'cash' && d.amount)
        .reduce((sum, d) => sum + Number(d.amount), 0)

      return {
        name: dept.name,
        donationCount: dept.donations.length,
        totalAmount,
        giftCount,
        cashCount,
      }
    })
  }

  /**
   * Get top donors by cash donation value
   */
  async getTopDonorsByCash(limit: number = 10): Promise<
    Array<{
      donorName: string
      departmentName: string
      totalCashAmount: number
      totalDonations: number
      cashDonations: number
    }>
  > {
    // Get all donations grouped by donor
    const donations = await this.db.donation.findMany({
      select: {
        donorName: true,
        departmentName: true,
        donationType: true,
        amount: true,
      },
    })

    // Group by donor name
    const donorMap = new Map<
      string,
      {
        donorName: string
        departmentName: string
        totalCashAmount: number
        totalDonations: number
        cashDonations: number
      }
    >()

    donations.forEach((donation) => {
      const existing = donorMap.get(donation.donorName)
      const cashAmount =
        donation.donationType === 'cash' && donation.amount
          ? Number(donation.amount)
          : 0

      if (existing) {
        existing.totalCashAmount += cashAmount
        existing.totalDonations++
        if (donation.donationType === 'cash') {
          existing.cashDonations++
        }
      } else {
        donorMap.set(donation.donorName, {
          donorName: donation.donorName,
          departmentName: donation.departmentName,
          totalCashAmount: cashAmount,
          totalDonations: 1,
          cashDonations: donation.donationType === 'cash' ? 1 : 0,
        })
      }
    })

    // Convert to array, filter out donors with no cash, sort by total cash, and limit
    return Array.from(donorMap.values())
      .filter((donor) => donor.totalCashAmount > 0)
      .sort((a, b) => b.totalCashAmount - a.totalCashAmount)
      .slice(0, limit)
  }

  /**
   * Identify underperforming demographic groups (age/gender) that need more donations
   */
  async getUnderperformingGroups(): Promise<{
    message: string | null
    type: 'age' | 'gender' | null
    group: string | null
  }> {
    // Get all donations with child demographics
    const donations = await this.db.donation.findMany({
      include: {
        child: {
          select: {
            age: true,
            gender: true,
          },
        },
      },
    })

    const total = donations.length

    if (total === 0) {
      return { message: null, type: null, group: null }
    }

    // Analyze gender split
    const maleCount = donations.filter((d) => d.child.gender === 'male').length
    const femaleCount = donations.filter((d) => d.child.gender === 'female').length

    const malePercent = (maleCount / total) * 100
    const femalePercent = (femaleCount / total) * 100

    // Check if gender imbalance (more than 15% difference)
    if (Math.abs(malePercent - femalePercent) > 15) {
      const underperforming = malePercent < femalePercent ? 'male' : 'female'
      const lowerPercent = Math.min(malePercent, femalePercent)
      return {
        message: `Help us reach more ${underperforming} children - only ${Math.round(lowerPercent)}% of donations so far!`,
        type: 'gender',
        group: underperforming,
      }
    }

    // Analyze age distribution
    const ageCounts: Record<string, number> = {}
    donations.forEach((d) => {
      const ageGroup =
        d.child.age <= 5
          ? '1-5'
          : d.child.age <= 10
          ? '6-10'
          : d.child.age <= 15
          ? '11-15'
          : '16+'
      ageCounts[ageGroup] = (ageCounts[ageGroup] || 0) + 1
    })

    // Find the age group with lowest percentage
    let lowestGroup = ''
    let lowestPercent = 100

    Object.entries(ageCounts).forEach(([group, count]) => {
      const percent = (count / total) * 100
      if (percent < lowestPercent) {
        lowestPercent = percent
        lowestGroup = group
      }
    })

    // If any age group has less than 15% of donations, encourage it
    if (lowestPercent < 15 && lowestGroup) {
      return {
        message: `Children aged ${lowestGroup} need your help - only ${Math.round(lowestPercent)}% of donations!`,
        type: 'age',
        group: lowestGroup,
      }
    }

    return { message: null, type: null, group: null }
  }
}

// Singleton export pattern
const db = getDatabaseInstance()
export const donationService = new DonationService(db)
