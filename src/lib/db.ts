import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Get database instance (singleton pattern)
 * Used by service layer for dependency injection
 */
export function getDatabaseInstance(): PrismaClient {
  return prisma;
}
