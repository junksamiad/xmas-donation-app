import type { Child as PrismaChild } from '@prisma/client'

/**
 * Serializable Child type for Client Components
 */
export type Child = PrismaChild

/**
 * Query parameters for searching children
 * Both parameters are optional for flexible searching
 */
export interface SearchChildParams {
  gender?: string  // 'male' | 'female' (optional)
  age?: number     // (optional)
}

/**
 * Create child DTO
 */
export interface CreateChildDto {
  recipient: string
  age: number
  gender: string
  giftIdeas: string
  category?: string
  priority?: boolean
}

/**
 * Update child DTO
 */
export interface UpdateChildDto {
  recipient?: string
  age?: number
  gender?: string
  giftIdeas?: string
  category?: string
  priority?: boolean
  assigned?: boolean
}
