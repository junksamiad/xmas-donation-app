import { PrismaClient } from '@prisma/client'

import { getDatabaseInstance } from '@/lib/db'

import type {
  Department,
  DepartmentWithStats,
  CreateDepartmentDto,
} from '@/lib/types/department'

/**
 * DepartmentService - Business logic for department management
 *
 * Handles:
 * - Getting active departments
 * - Department statistics and leaderboards
 * - Department CRUD operations
 */
export class DepartmentService {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Get all active departments
   */
  async getActive(): Promise<Department[]> {
    return await this.db.department.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    })
  }

  /**
   * Get all departments (active and inactive)
   */
  async getAll(): Promise<Department[]> {
    return await this.db.department.findMany({
      orderBy: { name: 'asc' },
    })
  }

  /**
   * Get department by ID
   */
  async getById(id: string): Promise<Department | null> {
    return await this.db.department.findUnique({
      where: { id },
    })
  }

  /**
   * Get departments with donation statistics
   * Sorted by donation count (leaderboard)
   */
  async getWithStats(): Promise<DepartmentWithStats[]> {
    const departments = await this.db.department.findMany({
      where: { active: true },
      include: {
        _count: {
          select: { donations: true },
        },
        donations: {
          where: { donationType: 'cash' },
          select: { amount: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    // Calculate total cash amount per department and format response
    return departments.map((dept) => {
      const totalAmount = dept.donations.reduce((sum, donation) => {
        return sum + (donation.amount ? Number(donation.amount) : 0)
      }, 0)

      return {
        id: dept.id,
        name: dept.name,
        active: dept.active,
        createdAt: dept.createdAt,
        _count: dept._count,
        totalAmount,
      }
    })
  }

  /**
   * Get department leaderboard sorted by total donations
   */
  async getLeaderboard(): Promise<DepartmentWithStats[]> {
    const stats = await this.getWithStats()

    // Sort by donation count descending
    return stats.sort((a, b) => b._count.donations - a._count.donations)
  }

  /**
   * Create a new department
   */
  async create(data: CreateDepartmentDto): Promise<Department> {
    // Check if department name already exists
    const existing = await this.db.department.findUnique({
      where: { name: data.name },
    })

    if (existing) {
      throw new Error(`Department "${data.name}" already exists`)
    }

    return await this.db.department.create({
      data,
    })
  }

  /**
   * Deactivate a department (soft delete)
   */
  async deactivate(id: string): Promise<Department> {
    return await this.db.department.update({
      where: { id },
      data: { active: false },
    })
  }

  /**
   * Reactivate a department
   */
  async activate(id: string): Promise<Department> {
    return await this.db.department.update({
      where: { id },
      data: { active: true },
    })
  }

  /**
   * Get top departments by total donation count (gifts + cash combined)
   */
  async getTopByDonationCount(limit: number = 3): Promise<
    Array<{
      name: string
      totalDonations: number
      totalCashAmount: number
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
      take: limit,
    })

    return departments.map((dept) => {
      const totalCashAmount = dept.donations
        .filter((d) => d.donationType === 'cash' && d.amount)
        .reduce((sum, d) => sum + Number(d.amount), 0)

      return {
        name: dept.name,
        totalDonations: dept.donations.length,
        totalCashAmount,
      }
    })
  }
}

// Singleton export pattern
const db = getDatabaseInstance()
export const departmentService = new DepartmentService(db)
