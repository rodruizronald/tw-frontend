import { PostgrestError } from '@supabase/supabase-js'

/**
 * Application-level error types for Supabase operations
 * These provide user-friendly categorization of database errors
 */
export type SupabaseErrorType =
  | 'QUERY_ERROR' // General database query error
  | 'NOT_FOUND' // Resource not found (PGRST116)
  | 'VALIDATION_ERROR' // Invalid input data
  | 'CONSTRAINT_ERROR' // Database constraint violation
  | 'CONNECTION_ERROR' // Network/connection issues
  | 'TIMEOUT_ERROR' // Request timeout
  | 'PERMISSION_ERROR' // RLS policy violation
  | 'UNKNOWN_ERROR' // Unclassified error

/**
 * Application-level error structure for Supabase operations
 * Provides a consistent error format for the frontend
 */
export interface SupabaseAppError {
  /** User-friendly error message */
  message: string
  /** Categorized error type for programmatic handling */
  type: SupabaseErrorType
  /** HTTP status code if available */
  status?: number
  /** Original error for debugging */
  originalError?: unknown
}

/**
 * PostgreSQL error codes mapped to application error types
 * Reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
const PG_ERROR_CODE_MAP: Record<string, SupabaseErrorType> = {
  // Class 23 — Integrity Constraint Violation
  '23000': 'CONSTRAINT_ERROR', // integrity_constraint_violation
  '23502': 'VALIDATION_ERROR', // not_null_violation
  '23503': 'CONSTRAINT_ERROR', // foreign_key_violation
  '23505': 'CONSTRAINT_ERROR', // unique_violation
  '23514': 'VALIDATION_ERROR', // check_violation

  // Class 22 — Data Exception
  '22000': 'VALIDATION_ERROR', // data_exception
  '22001': 'VALIDATION_ERROR', // string_data_right_truncation
  '22003': 'VALIDATION_ERROR', // numeric_value_out_of_range
  '22007': 'VALIDATION_ERROR', // invalid_datetime_format
  '22P02': 'VALIDATION_ERROR', // invalid_text_representation

  // Class 42 — Syntax Error or Access Rule Violation
  '42501': 'PERMISSION_ERROR', // insufficient_privilege
  '42P01': 'NOT_FOUND', // undefined_table

  // Class 57 — Operator Intervention
  '57014': 'TIMEOUT_ERROR', // query_canceled (timeout)

  // Class 08 — Connection Exception
  '08000': 'CONNECTION_ERROR', // connection_exception
  '08003': 'CONNECTION_ERROR', // connection_does_not_exist
  '08006': 'CONNECTION_ERROR', // connection_failure
}

/**
 * PostgREST error codes mapped to application error types
 * Reference: https://postgrest.org/en/stable/references/errors.html
 */
const POSTGREST_ERROR_CODE_MAP: Record<string, SupabaseErrorType> = {
  PGRST116: 'NOT_FOUND', // No rows returned (single row expected)
  PGRST100: 'VALIDATION_ERROR', // Parsing error
  PGRST102: 'VALIDATION_ERROR', // Invalid request body
  PGRST103: 'VALIDATION_ERROR', // Invalid content type
  PGRST200: 'PERMISSION_ERROR', // JWT expired
  PGRST201: 'PERMISSION_ERROR', // JWT invalid
  PGRST202: 'PERMISSION_ERROR', // Anonymous access disabled
  PGRST301: 'PERMISSION_ERROR', // RLS policy violation
}

/**
 * User-friendly error messages for each error type
 */
const ERROR_MESSAGES: Record<SupabaseErrorType, string> = {
  QUERY_ERROR: 'An error occurred while fetching data. Please try again.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Invalid data provided. Please check your input.',
  CONSTRAINT_ERROR:
    'This operation conflicts with existing data. Please try again.',
  CONNECTION_ERROR:
    'Unable to connect to the server. Please check your connection.',
  TIMEOUT_ERROR: 'The request took too long. Please try again.',
  PERMISSION_ERROR: 'You do not have permission to perform this action.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again later.',
}

/**
 * Transform a PostgrestError into an application-level error
 *
 * @param error - The PostgrestError from Supabase
 * @returns A standardized SupabaseAppError
 *
 * @example
 * ```typescript
 * const { data, error } = await supabase.from('jobs').select('*')
 * if (error) {
 *   const appError = handleSupabaseError(error)
 *   console.error(appError.message) // User-friendly message
 *   console.error(appError.type)    // 'QUERY_ERROR', 'NOT_FOUND', etc.
 * }
 * ```
 */
export function handleSupabaseError(error: PostgrestError): SupabaseAppError {
  const code = error.code

  // Check PostgREST error codes first (they start with 'PGRST')
  if (code?.startsWith('PGRST')) {
    const errorType = POSTGREST_ERROR_CODE_MAP[code] ?? 'QUERY_ERROR'
    return {
      message: error.message || ERROR_MESSAGES[errorType],
      type: errorType,
      originalError: error,
    }
  }

  // Check PostgreSQL error codes (5 character codes)
  if (code && code.length === 5) {
    const errorType = PG_ERROR_CODE_MAP[code] ?? 'QUERY_ERROR'
    return {
      message: ERROR_MESSAGES[errorType],
      type: errorType,
      originalError: error,
    }
  }

  // Fallback for unrecognized errors
  return {
    message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    type: 'UNKNOWN_ERROR',
    originalError: error,
  }
}

/**
 * Transform any unknown error into an application-level error
 * Useful for catching errors from RPC calls or network issues
 *
 * @param error - Any error (PostgrestError, Error, or unknown)
 * @returns A standardized SupabaseAppError
 *
 * @example
 * ```typescript
 * try {
 *   const { data, error } = await supabase.rpc('search_jobs', params)
 *   if (error) throw error
 *   return data
 * } catch (error) {
 *   const appError = handleUnknownError(error)
 *   // Handle the error appropriately
 * }
 * ```
 */
export function handleUnknownError(error: unknown): SupabaseAppError {
  // Handle PostgrestError
  if (isPostgrestError(error)) {
    return handleSupabaseError(error)
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      message: ERROR_MESSAGES.CONNECTION_ERROR,
      type: 'CONNECTION_ERROR',
      originalError: error,
    }
  }

  // Handle timeout errors
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      message: ERROR_MESSAGES.TIMEOUT_ERROR,
      type: 'TIMEOUT_ERROR',
      originalError: error,
    }
  }

  // Handle generic Error objects
  if (error instanceof Error) {
    return {
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      type: 'UNKNOWN_ERROR',
      originalError: error,
    }
  }

  // Fallback for completely unknown errors
  return {
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    type: 'UNKNOWN_ERROR',
    originalError: error,
  }
}

/**
 * Type guard to check if an error is a PostgrestError
 */
export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'details' in error
  )
}

/**
 * Check if an error indicates a "not found" condition
 * Useful for distinguishing between "no results" and actual errors
 */
export function isNotFoundError(error: SupabaseAppError): boolean {
  return error.type === 'NOT_FOUND'
}

/**
 * Check if an error is recoverable (user can retry)
 */
export function isRecoverableError(error: SupabaseAppError): boolean {
  return ['CONNECTION_ERROR', 'TIMEOUT_ERROR', 'QUERY_ERROR'].includes(
    error.type
  )
}
