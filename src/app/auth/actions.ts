'use server'

import { cookies } from 'next/headers'

import { authService } from '@/lib/services/business/auth.service'

export type AuthResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Login with username and password
 */
export async function login(
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    console.log('Login attempt for:', username)

    // Authenticate user via auth service
    const result = await authService.authenticate(username, password)

    if (!result.success) {
      console.log('Authentication failed')
      return {
        success: false,
        error: 'Invalid username or password',
      }
    }

    console.log('Authentication successful, setting session cookie...')

    // Set session cookie
    ;(await cookies()).set('admin_session', result.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log('Login successful!')
    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: `Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

/**
 * Logout and clear session
 */
export async function logout(): Promise<void> {
  ;(await cookies()).delete('admin_session')
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = (await cookies()).get('admin_session')

    if (!session) {
      return false
    }

    // Verify session is valid via auth service
    return authService.validateSession(session.value)
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}
