/**
 * Job Repository
 *
 * Low-level data access layer for job-related Supabase operations.
 * This module handles direct communication with Supabase and returns
 * raw database types. Use JobService for transformed frontend types.
 */

import { supabase } from '@/services/supabase/client'
import {
  handleUnknownError,
  type SupabaseAppError,
} from '@/services/supabase/errors'
import type { Database } from '@/services/supabase/types/database'

import type {
  GetCompaniesRpcParams,
  SearchJobsRpcParams,
} from '../types/filters'

// =============================================================================
// Types
// =============================================================================

/**
 * Raw job row from the search_jobs RPC function
 */
export type JobSearchResult =
  Database['public']['Functions']['search_jobs']['Returns'][number]

/**
 * Result of a job search operation
 */
export interface JobSearchRepositoryResult {
  /** Array of job results from the database */
  data: JobSearchResult[]
  /** Total count of matching jobs (from window function) */
  totalCount: number
  /** Error if the operation failed */
  error: SupabaseAppError | null
}

/**
 * Raw company row from the database
 */
export type CompanyRow = Database['public']['Tables']['companies']['Row']

/**
 * Result from the get_companies_for_search RPC function
 */
export type CompanySearchResult =
  Database['public']['Functions']['get_companies_for_search']['Returns'][number]

/**
 * Result of a company search operation
 */
export interface CompanySearchRepositoryResult {
  /** Array of company names with job counts */
  data: CompanySearchResult[]
  /** Error if the operation failed */
  error: SupabaseAppError | null
}

// =============================================================================
// Repository Functions
// =============================================================================

/**
 * Search for jobs using the search_jobs RPC function
 *
 * This function calls the PostgreSQL `search_jobs` function which performs:
 * - Full-text search on the search_vector column
 * - Filtering by experience level, employment type, location, work mode, etc.
 * - Pagination with LIMIT and OFFSET
 * - Total count using COUNT(*) OVER() window function
 *
 * @param params - Search parameters matching the RPC function signature
 * @returns Job search results with total count or error
 *
 * @example
 * ```typescript
 * const result = await searchJobs({
 *   search_query: 'react developer',
 *   p_limit: 20,
 *   p_offset: 0,
 *   p_experience_level: 'senior',
 *   p_work_mode: 'remote',
 * })
 *
 * if (result.error) {
 *   console.error(result.error.message)
 * } else {
 *   console.log(`Found ${result.totalCount} jobs`)
 *   result.data.forEach(job => console.log(job.title))
 * }
 * ```
 */
export async function searchJobs(
  params: SearchJobsRpcParams
): Promise<JobSearchRepositoryResult> {
  try {
    // Build RPC parameters, only including defined values
    // This is required for TypeScript's exactOptionalPropertyTypes
    const rpcParams: Database['public']['Functions']['search_jobs']['Args'] = {
      search_query: params.search_query,
    }

    // Only add optional parameters if they are defined
    if (params.p_limit !== undefined) rpcParams.p_limit = params.p_limit
    if (params.p_offset !== undefined) rpcParams.p_offset = params.p_offset
    if (params.p_experience_level !== undefined)
      rpcParams.p_experience_level = params.p_experience_level
    if (params.p_employment_type !== undefined)
      rpcParams.p_employment_type = params.p_employment_type
    if (params.p_work_mode !== undefined)
      rpcParams.p_work_mode = params.p_work_mode
    if (params.p_province !== undefined)
      rpcParams.p_province = params.p_province
    if (params.p_job_function !== undefined)
      rpcParams.p_job_function = params.p_job_function
    if (params.p_language !== undefined)
      rpcParams.p_language = params.p_language
    if (params.p_company !== undefined) rpcParams.p_company = params.p_company
    if (params.p_date_from !== undefined)
      rpcParams.p_date_from = params.p_date_from
    if (params.p_date_to !== undefined) rpcParams.p_date_to = params.p_date_to

    const { data, error } = await supabase.rpc('search_jobs', rpcParams)

    if (error) {
      return {
        data: [],
        totalCount: 0,
        error: handleUnknownError(error),
      }
    }

    // Extract total count from the first result (window function returns same count for all rows)
    const results = data ?? []
    const firstResult = results[0]
    const totalCount = firstResult?.total_count ?? 0

    return {
      data: results,
      totalCount,
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      totalCount: 0,
      error: handleUnknownError(error),
    }
  }
}

/**
 * Get a single job by ID
 *
 * @param jobId - The job ID to fetch
 * @returns The job row or null if not found
 *
 * @example
 * ```typescript
 * const result = await getJobById(123)
 * if (result.error) {
 *   console.error(result.error.message)
 * } else if (result.data) {
 *   console.log(result.data.title)
 * }
 * ```
 */
export async function getJobById(jobId: number): Promise<{
  data: Database['public']['Tables']['jobs']['Row'] | null
  error: SupabaseAppError | null
}> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('is_active', true)
      .single()

    if (error) {
      return {
        data: null,
        error: handleUnknownError(error),
      }
    }

    return {
      data,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: handleUnknownError(error),
    }
  }
}

/**
 * Get a job with its company information
 *
 * @param jobId - The job ID to fetch
 * @returns The job with company data or null if not found
 */
export async function getJobWithCompany(jobId: number): Promise<{
  data:
    | (Database['public']['Tables']['jobs']['Row'] & {
        companies: CompanyRow | null
      })
    | null
  error: SupabaseAppError | null
}> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, companies(*)')
      .eq('id', jobId)
      .eq('is_active', true)
      .single()

    if (error) {
      return {
        data: null,
        error: handleUnknownError(error),
      }
    }

    return {
      data,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: handleUnknownError(error),
    }
  }
}

/**
 * Get company by name (exact match, case-insensitive)
 *
 * @param companyName - The company name to search for
 * @returns The company row or null if not found
 */
export async function getCompanyByName(companyName: string): Promise<{
  data: CompanyRow | null
  error: SupabaseAppError | null
}> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .ilike('name', companyName)
      .eq('is_active', true)
      .single()

    if (error) {
      return {
        data: null,
        error: handleUnknownError(error),
      }
    }

    return {
      data,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: handleUnknownError(error),
    }
  }
}

/**
 * Get all active companies (for autocomplete/dropdown)
 *
 * @param limit - Maximum number of companies to return
 * @returns Array of company rows
 */
export async function getCompanies(limit: number = 100): Promise<{
  data: CompanyRow[]
  error: SupabaseAppError | null
}> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
      .limit(limit)

    if (error) {
      return {
        data: [],
        error: handleUnknownError(error),
      }
    }

    return {
      data: data ?? [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: handleUnknownError(error),
    }
  }
}

/**
 * Get companies that have jobs matching the current search criteria
 *
 * This function calls the PostgreSQL `get_companies_for_search` function which:
 * - Filters companies based on the same search criteria used for jobs
 * - Returns company names with job counts
 * - Useful for populating the company filter dropdown dynamically
 *
 * @param params - Search parameters (same as job search, excluding company filter)
 * @returns Array of company names with job counts or error
 *
 * @example
 * ```typescript
 * const result = await getCompaniesForJobs({
 *   search_query: 'react developer',
 *   p_experience_level: ['senior'],
 *   p_work_mode: ['remote'],
 * })
 *
 * if (result.error) {
 *   console.error(result.error.message)
 * } else {
 *   result.data.forEach(c => console.log(`${c.company_name}: ${c.job_count} jobs`))
 * }
 * ```
 */
export async function getCompaniesForJobs(
  params: GetCompaniesRpcParams
): Promise<CompanySearchRepositoryResult> {
  try {
    // Build RPC parameters, only including defined values
    const rpcParams: Database['public']['Functions']['get_companies_for_search']['Args'] =
      {
        search_query: params.search_query,
      }

    // Only add optional parameters if they are defined
    if (params.p_limit !== undefined) rpcParams.p_limit = params.p_limit
    if (params.p_experience_level !== undefined)
      rpcParams.p_experience_level = params.p_experience_level
    if (params.p_employment_type !== undefined)
      rpcParams.p_employment_type = params.p_employment_type
    if (params.p_work_mode !== undefined)
      rpcParams.p_work_mode = params.p_work_mode
    if (params.p_province !== undefined)
      rpcParams.p_province = params.p_province
    if (params.p_job_function !== undefined)
      rpcParams.p_job_function = params.p_job_function
    if (params.p_language !== undefined)
      rpcParams.p_language = params.p_language
    if (params.p_date_from !== undefined)
      rpcParams.p_date_from = params.p_date_from
    if (params.p_date_to !== undefined) rpcParams.p_date_to = params.p_date_to

    const { data, error } = await supabase.rpc(
      'get_companies_for_search',
      rpcParams
    )

    if (error) {
      return {
        data: [],
        error: handleUnknownError(error),
      }
    }

    return {
      data: data ?? [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: handleUnknownError(error),
    }
  }
}

// =============================================================================
// Repository Object (Alternative API)
// =============================================================================

/**
 * Job repository object
 *
 * Provides an alternative object-based API for job data access.
 * Use this if you prefer method chaining or dependency injection.
 */
export const jobRepository = {
  searchJobs,
  getJobById,
  getJobWithCompany,
  getCompanyByName,
  getCompanies,
  getCompaniesForJobs,
} as const

export default jobRepository
