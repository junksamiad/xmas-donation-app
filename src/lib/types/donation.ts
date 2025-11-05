import type { Donation as PrismaDonation } from '@prisma/client'

/**
 * Serializable Donation type for Client Components
 * Converts Prisma Decimal to number for Next.js serialization
 */
export type Donation = Omit<PrismaDonation, 'amount'> & {
  amount: number | null
}

/**
 * Create donation DTO
 */
export interface CreateDonationDto {
  childId: string
  donorName: string
  departmentId: string
  donationType: 'gift' | 'cash'
  amount?: number  // Required if donationType is 'cash'
}

/**
 * Donation with related data
 */
export interface DonationWithRelations extends Donation {
  child: {
    id: string
    recipient: string
    age: number
    gender: string
  }
  department: {
    id: string
    name: string
  }
}
