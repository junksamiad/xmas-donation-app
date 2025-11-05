import type { Department as PrismaDepartment } from '@prisma/client'

/**
 * Serializable Department type for Client Components
 */
export type Department = PrismaDepartment

/**
 * Department with donation statistics
 */
export interface DepartmentWithStats extends Department {
  _count: {
    donations: number
  }
  totalAmount?: number
}

/**
 * Create department DTO
 */
export interface CreateDepartmentDto {
  name: string
  active?: boolean
}
