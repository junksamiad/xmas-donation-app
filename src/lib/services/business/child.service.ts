import { PrismaClient } from '@prisma/client'

import { getDatabaseInstance } from '@/lib/db'

import type {
  Child,
  SearchChildParams,
  CreateChildDto,
  UpdateChildDto,
} from '@/lib/types/child'

/**
 * ChildService - Business logic for child management
 *
 * Handles:
 * - Random child selection
 * - Search by age/gender
 * - Child CRUD operations
 */
export class ChildService {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Get a random unassigned child
   * Prioritizes children with priority=true (real children) first
   */
  async getRandomChild(): Promise<Child | null> {
    // First, try to get a priority child
    const priorityChildren = await this.db.child.findMany({
      where: { assigned: false, priority: true },
    })

    if (priorityChildren.length > 0) {
      const randomIndex = Math.floor(Math.random() * priorityChildren.length)
      return priorityChildren[randomIndex]
    }

    // If no priority children available, fall back to non-priority children
    const children = await this.db.child.findMany({
      where: { assigned: false, priority: false },
    })

    if (children.length === 0) {
      return null
    }

    // Return random child
    const randomIndex = Math.floor(Math.random() * children.length)
    return children[randomIndex]
  }

  /**
   * Search for a child by gender and/or age
   * Returns a random child matching criteria
   * Prioritizes children with priority=true (real children) first
   * Either parameter can be omitted for partial search
   */
  async searchChild(params: SearchChildParams): Promise<Child | null> {
    const { gender, age } = params

    // Build base where clause dynamically based on provided params
    const baseWhere: { assigned: boolean; gender?: string; age?: number } = { assigned: false }

    if (gender) {
      baseWhere.gender = gender
    }

    if (age !== undefined) {
      baseWhere.age = age
    }

    // First, try to find priority children matching criteria
    const priorityChildren = await this.db.child.findMany({
      where: { ...baseWhere, priority: true },
    })

    if (priorityChildren.length > 0) {
      const randomIndex = Math.floor(Math.random() * priorityChildren.length)
      return priorityChildren[randomIndex]
    }

    // If no priority children match, fall back to non-priority children
    const children = await this.db.child.findMany({
      where: { ...baseWhere, priority: false },
    })

    if (children.length === 0) {
      return null
    }

    // Return random match
    const randomIndex = Math.floor(Math.random() * children.length)
    return children[randomIndex]
  }

  /**
   * Get child by ID
   */
  async getById(id: string): Promise<Child | null> {
    return await this.db.child.findUnique({
      where: { id },
    })
  }

  /**
   * Get all children with optional filters
   */
  async getAll(filters?: {
    assigned?: boolean
    priority?: boolean
  }): Promise<Child[]> {
    return await this.db.child.findMany({
      where: filters,
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
    })
  }

  /**
   * Create a new child
   */
  async create(data: CreateChildDto): Promise<Child> {
    return await this.db.child.create({
      data,
    })
  }

  /**
   * Update a child
   */
  async update(id: string, data: UpdateChildDto): Promise<Child> {
    return await this.db.child.update({
      where: { id },
      data,
    })
  }

  /**
   * Mark child as assigned (has received donation)
   */
  async markAsAssigned(id: string): Promise<Child> {
    return await this.db.child.update({
      where: { id },
      data: { assigned: true },
    })
  }

  /**
   * Get count of unassigned children
   */
  async getUnassignedCount(): Promise<number> {
    return await this.db.child.count({
      where: { assigned: false },
    })
  }

  /**
   * Get children progress (assigned vs total)
   */
  async getProgress(): Promise<{
    assigned: number
    total: number
    percentage: number
  }> {
    const [assigned, total] = await Promise.all([
      this.db.child.count({ where: { assigned: true } }),
      this.db.child.count(),
    ])

    const percentage = total > 0 ? Math.round((assigned / total) * 100) : 0

    return { assigned, total, percentage }
  }
}

// Singleton export pattern
const db = getDatabaseInstance()
export const childService = new ChildService(db)
