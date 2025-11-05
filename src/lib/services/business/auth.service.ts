import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { getDatabaseInstance } from '@/lib/db'

/**
 * AuthService - Business logic for authentication
 *
 * Handles:
 * - User authentication
 * - Password verification
 * - User management
 */
export class AuthService {
  constructor(private readonly db: PrismaClient) {}

  /**
   * Find user by username
   */
  async findByUsername(username: string) {
    return this.db.user.findUnique({
      where: { username },
    })
  }

  /**
   * Find user by ID
   */
  async findById(id: string) {
    return this.db.user.findUnique({
      where: { id },
    })
  }

  /**
   * Verify password against stored hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  /**
   * Authenticate user with username and password
   */
  async authenticate(
    username: string,
    password: string
  ): Promise<{ success: true; userId: string } | { success: false }> {
    const user = await this.findByUsername(username)

    if (!user) {
      return { success: false }
    }

    const isValid = await this.verifyPassword(password, user.password)

    if (!isValid) {
      return { success: false }
    }

    return { success: true, userId: user.id }
  }

  /**
   * Validate user session by ID
   */
  async validateSession(userId: string): Promise<boolean> {
    const user = await this.findById(userId)
    return !!user
  }
}

// Singleton export pattern
const db = getDatabaseInstance()
export const authService = new AuthService(db)
