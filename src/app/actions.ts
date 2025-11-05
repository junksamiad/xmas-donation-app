'use server'

import {
  childService,
  donationService,
  departmentService,
} from '@/lib/services/business'

import type {
  Child,
  SearchChildParams,
  CreateDonationDto,
  Department,
  Donation,
} from '@/lib/types'

/**
 * Server Action Result Type
 * All Server Actions return this format to properly handle errors
 */
export type ServerActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Get a random unassigned child
 */
export async function getRandomChild(): Promise<ServerActionResult<Child>> {
  try {
    const child = await childService.getRandomChild()

    if (!child) {
      return {
        success: false,
        error: 'No children available at this time. Please try again later.',
      }
    }

    return {
      success: true,
      data: child,
    }
  } catch (error) {
    console.error('Error in getRandomChild:', error)
    return {
      success: false,
      error: 'Failed to find a child. Please try again.',
    }
  }
}

/**
 * Search for a child by gender and/or age
 * Both parameters are optional - can search by either or both
 */
export async function searchChild(
  params: SearchChildParams
): Promise<ServerActionResult<Child>> {
  try {
    // Validate at least one parameter provided
    if (!params.gender && params.age === undefined) {
      return {
        success: false,
        error: 'Please select at least gender or age.',
      }
    }

    // Validate age if provided
    if (params.age !== undefined && (params.age < 1 || params.age > 16)) {
      return {
        success: false,
        error: 'Age must be between 1 and 16.',
      }
    }

    const child = await childService.searchChild(params)

    if (!child) {
      return {
        success: false,
        error: 'No children match your search criteria. Please try different options.',
      }
    }

    return {
      success: true,
      data: child,
    }
  } catch (error) {
    console.error('Error in searchChild:', error)
    return {
      success: false,
      error: 'Failed to search for children. Please try again.',
    }
  }
}

/**
 * Create a new donation
 */
export async function createDonation(
  data: CreateDonationDto
): Promise<ServerActionResult<Donation>> {
  try {
    // Validate donation data
    if (!data.childId || !data.donorName || !data.departmentId || !data.donationType) {
      return {
        success: false,
        error: 'Please fill in all required fields.',
      }
    }

    if (data.donationType === 'cash' && !data.amount) {
      return {
        success: false,
        error: 'Please enter a donation amount for cash donations.',
      }
    }

    if (data.donationType === 'cash' && data.amount && data.amount <= 0) {
      return {
        success: false,
        error: 'Donation amount must be greater than zero.',
      }
    }

    // Create the donation
    const donation = await donationService.create(data)

    return {
      success: true,
      data: donation,
    }
  } catch (error) {
    console.error('Error in createDonation:', error)

    // Handle known errors
    if (error instanceof Error) {
      if (error.message.includes('Child not found')) {
        return {
          success: false,
          error: 'The selected child could not be found. Please start over.',
        }
      }
      if (error.message.includes('Department not found')) {
        return {
          success: false,
          error: 'The selected department could not be found. Please try again.',
        }
      }
      if (error.message.includes('must include an amount')) {
        return {
          success: false,
          error: 'Cash donations must include an amount.',
        }
      }
    }

    return {
      success: false,
      error: 'Failed to create donation. Please try again.',
    }
  }
}

/**
 * Get all active departments (for dropdown)
 */
export async function getActiveDepartments(): Promise<
  ServerActionResult<Department[]>
> {
  try {
    const departments = await departmentService.getActive()

    return {
      success: true,
      data: departments,
    }
  } catch (error) {
    console.error('Error in getActiveDepartments:', error)
    return {
      success: false,
      error: 'Failed to load departments.',
    }
  }
}

/**
 * Get donation statistics
 */
export async function getDonationStats(): Promise<
  ServerActionResult<{
    totalDonations: number
    totalCashAmount: number
    totalGiftDonations: number
    totalCashDonations: number
  }>
> {
  try {
    const stats = await donationService.getStats()

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error('Error in getDonationStats:', error)
    return {
      success: false,
      error: 'Failed to load statistics.',
    }
  }
}

/**
 * Get department leaderboard
 */
export async function getDepartmentLeaderboard(): Promise<
  ServerActionResult<
    Array<{
      id: string
      name: string
      active: boolean
      createdAt: Date
      _count: {
        donations: number
      }
      totalAmount?: number
    }>
  >
> {
  try {
    const leaderboard = await departmentService.getLeaderboard()

    return {
      success: true,
      data: leaderboard,
    }
  } catch (error) {
    console.error('Error in getDepartmentLeaderboard:', error)
    return {
      success: false,
      error: 'Failed to load leaderboard.',
    }
  }
}

/**
 * Get count of unassigned children
 */
export async function getUnassignedChildrenCount(): Promise<
  ServerActionResult<number>
> {
  try {
    const count = await childService.getUnassignedCount()

    return {
      success: true,
      data: count,
    }
  } catch (error) {
    console.error('Error in getUnassignedChildrenCount:', error)
    return {
      success: false,
      error: 'Failed to get count.',
    }
  }
}

/**
 * Get latest donation for ticker display
 */
export async function getLatestDonation(): Promise<
  ServerActionResult<{
    donorName: string
    departmentName: string
    donationType: 'gift' | 'cash'
    amount: number | null
    createdAt: Date
    minutesAgo: number
  } | null>
> {
  try {
    const latest = await donationService.getLatest()

    if (!latest) {
      return {
        success: true,
        data: null,
      }
    }

    return {
      success: true,
      data: latest,
    }
  } catch (error) {
    console.error('Error in getLatestDonation:', error)
    return {
      success: false,
      error: 'Failed to get latest donation.',
    }
  }
}
