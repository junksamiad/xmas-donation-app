import { PrismaClient } from '@prisma/client'

import { getDatabaseInstance } from '@/lib/db'

import type { GiftIdea, FindGiftIdeasParams } from '@/lib/types/giftIdea'

/**
 * GiftIdeaService - Business logic for gift idea lookup
 *
 * Handles:
 * - Finding gift ideas by age/gender/category
 * - Fallback logic for gift suggestions
 */
export class GiftIdeaService {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Find gift ideas matching child's age, gender, and optional category
   * Falls back to 'any' gender if no specific match found
   */
  async findForChild(params: FindGiftIdeasParams): Promise<string[]> {
    const { age, gender, category } = params

    // Try exact match (age + gender + category)
    if (category) {
      const exactMatch = await this.db.giftIdea.findUnique({
        where: {
          age_gender_category: {
            age,
            gender,
            category,
          },
        },
      })

      if (exactMatch) {
        return exactMatch.giftIdeas
      }
    }

    // Try match without category (age + gender + undefined category)
    const genderMatch = await this.db.giftIdea.findFirst({
      where: {
        age,
        gender,
        category: null,
      },
    })

    if (genderMatch) {
      return genderMatch.giftIdeas
    }

    // Fallback to 'any' gender (age + 'any' + undefined category)
    const anyGenderMatch = await this.db.giftIdea.findFirst({
      where: {
        age,
        gender: 'any',
        category: null,
      },
    })

    if (anyGenderMatch) {
      return anyGenderMatch.giftIdeas
    }

    // No matches found - return empty array
    return []
  }

  /**
   * Get all gift ideas for a specific age
   */
  async getByAge(age: number): Promise<GiftIdea[]> {
    return await this.db.giftIdea.findMany({
      where: { age },
      orderBy: { gender: 'asc' },
    })
  }

  /**
   * Get all gift ideas
   */
  async getAll(): Promise<GiftIdea[]> {
    return await this.db.giftIdea.findMany({
      orderBy: [{ age: 'asc' }, { gender: 'asc' }],
    })
  }
}

// Singleton export pattern
const db = getDatabaseInstance()
export const giftIdeaService = new GiftIdeaService(db)
