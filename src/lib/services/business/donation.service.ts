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
}

// Singleton export pattern
const db = getDatabaseInstance()
export const donationService = new DonationService(db)
