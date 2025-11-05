import type { GiftIdea as PrismaGiftIdea } from '@prisma/client'

/**
 * Serializable GiftIdea type for Client Components
 */
export type GiftIdea = PrismaGiftIdea

/**
 * Query parameters for finding gift ideas
 */
export interface FindGiftIdeasParams {
  age: number
  gender: string
  category?: string
}
