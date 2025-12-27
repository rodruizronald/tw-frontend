/**
 * Supabase Service Module
 *
 * This module provides the Supabase client and error handling utilities
 * for interacting with the Supabase backend.
 *
 * @example
 * ```typescript
 * import { supabase, handleSupabaseError } from '@/services/supabase'
 *
 * const { data, error } = await supabase.from('jobs').select('*')
 * if (error) {
 *   const appError = handleSupabaseError(error)
 *   console.error(appError.message)
 * }
 * ```
 */

// Client
export type { TypedSupabaseClient } from './client'
export { supabase } from './client'

// Error handling
export type { SupabaseAppError, SupabaseErrorType } from './errors'
export {
  handleSupabaseError,
  handleUnknownError,
  isNotFoundError,
  isPostgrestError,
  isRecoverableError,
} from './errors'

// Database types (re-export commonly used types)
export type { Database, Enums, Tables } from './types/database'
