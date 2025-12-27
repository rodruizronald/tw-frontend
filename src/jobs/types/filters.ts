/**
 * Job search filter types
 *
 * These types define the structure for job search parameters
 * used throughout the application.
 */

import type {
  EmploymentType,
  ExperienceLevel,
  JobFunction,
  Language,
  Location,
  Province,
  WorkMode,
} from './enums'

// =============================================================================
// Search Filter Types
// =============================================================================

/**
 * Job search filters interface
 *
 * All filters are optional except for `query` which is required
 * for full-text search operations.
 *
 * @example
 * ```typescript
 * const filters: JobSearchFilters = {
 *   query: 'react developer',
 *   experienceLevel: 'senior',
 *   workMode: 'remote',
 *   province: 'san-jose',
 * }
 * ```
 */
export interface JobSearchFilters {
  /**
   * Full-text search query (required)
   * Searches across job title, skills, and description
   */
  query: string

  /**
   * Filter by experience level
   * e.g., 'entry-level', 'mid-level', 'senior'
   */
  experienceLevel?: ExperienceLevel

  /**
   * Filter by employment type
   * e.g., 'full-time', 'part-time', 'contractor'
   */
  employmentType?: EmploymentType

  /**
   * Filter by geographic location
   * e.g., 'costa-rica', 'latam'
   */
  location?: Location

  /**
   * Filter by work mode/arrangement
   * e.g., 'remote', 'hybrid', 'onsite'
   */
  workMode?: WorkMode

  /**
   * Filter by province (Costa Rica)
   * e.g., 'san-jose', 'heredia', 'alajuela'
   */
  province?: Province

  /**
   * Filter by job function/department
   * e.g., 'technology-engineering', 'product-management'
   */
  jobFunction?: JobFunction

  /**
   * Filter by job posting language
   * e.g., 'english', 'spanish'
   */
  language?: Language

  /**
   * Filter by company name (exact match, case-insensitive)
   */
  company?: string

  /**
   * Filter jobs created on or after this date
   * ISO 8601 date string (e.g., '2024-01-01')
   */
  dateFrom?: string

  /**
   * Filter jobs created on or before this date
   * ISO 8601 date string (e.g., '2024-12-31')
   */
  dateTo?: string
}

/**
 * Pagination parameters for job search
 */
export interface JobSearchPagination {
  /**
   * Page number (1-indexed)
   * @default 1
   */
  page?: number

  /**
   * Number of results per page
   * @default 20
   */
  pageSize?: number
}

/**
 * Combined search parameters (filters + pagination)
 */
export interface JobSearchParams {
  filters: JobSearchFilters
  pagination?: JobSearchPagination
}

// =============================================================================
// Filter State Types (for UI components)
// =============================================================================

/**
 * Filter state for UI components
 * Similar to JobSearchFilters but all fields are optional
 * including query (for building filters before search)
 */
export interface FilterState {
  query?: string
  experienceLevel?: ExperienceLevel
  employmentType?: EmploymentType
  location?: Location
  workMode?: WorkMode
  province?: Province
  jobFunction?: JobFunction
  language?: Language
  company?: string
  dateFrom?: string
  dateTo?: string
}

/**
 * Active filter count type
 * Used to show badge counts on filter UI
 */
export type ActiveFilterKey = keyof Omit<FilterState, 'query'>

// =============================================================================
// Supabase RPC Parameter Types
// =============================================================================

/**
 * Parameters for the search_jobs RPC function
 * Maps to the PostgreSQL function parameters
 */
export interface SearchJobsRpcParams {
  search_query: string
  p_limit?: number | undefined
  p_offset?: number | undefined
  p_experience_level?: ExperienceLevel | undefined
  p_employment_type?: EmploymentType | undefined
  p_location?: Location | undefined
  p_work_mode?: WorkMode | undefined
  p_province?: Province | undefined
  p_job_function?: JobFunction | undefined
  p_language?: Language | undefined
  p_company?: string | undefined
  p_date_from?: string | undefined
  p_date_to?: string | undefined
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Convert JobSearchFilters to Supabase RPC parameters
 *
 * @param filters - The search filters from the UI
 * @param pagination - Optional pagination parameters
 * @returns Parameters formatted for the search_jobs RPC function
 */
export function toSearchJobsRpcParams(
  filters: JobSearchFilters,
  pagination?: JobSearchPagination
): SearchJobsRpcParams {
  const page = pagination?.page ?? 1
  const pageSize = pagination?.pageSize ?? 20
  const offset = (page - 1) * pageSize

  return {
    search_query: filters.query,
    p_limit: pageSize,
    p_offset: offset,
    p_experience_level: filters.experienceLevel,
    p_employment_type: filters.employmentType,
    p_location: filters.location,
    p_work_mode: filters.workMode,
    p_province: filters.province,
    p_job_function: filters.jobFunction,
    p_language: filters.language,
    p_company: filters.company,
    p_date_from: filters.dateFrom,
    p_date_to: filters.dateTo,
  }
}

/**
 * Count the number of active filters (excluding query)
 *
 * @param filters - The current filter state
 * @returns Number of active filters
 */
export function countActiveFilters(filters: FilterState): number {
  const filterKeys: ActiveFilterKey[] = [
    'experienceLevel',
    'employmentType',
    'location',
    'workMode',
    'province',
    'jobFunction',
    'language',
    'company',
    'dateFrom',
    'dateTo',
  ]

  return filterKeys.filter(key => filters[key] !== undefined).length
}

/**
 * Check if any filters are active (excluding query)
 *
 * @param filters - The current filter state
 * @returns True if any filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return countActiveFilters(filters) > 0
}

/**
 * Clear all filters and return empty state
 *
 * @param preserveQuery - Whether to keep the search query
 * @param currentQuery - The current query to preserve
 * @returns Empty filter state
 */
export function clearFilters(
  preserveQuery: boolean = false,
  currentQuery?: string
): FilterState {
  return preserveQuery && currentQuery ? { query: currentQuery } : {}
}

/**
 * Create default pagination parameters
 */
export function getDefaultPagination(): Required<JobSearchPagination> {
  return {
    page: 1,
    pageSize: 20,
  }
}

/**
 * Calculate offset from page and pageSize
 */
export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize
}

/**
 * Calculate total pages from total count and page size
 */
export function calculateTotalPages(
  totalCount: number,
  pageSize: number
): number {
  return Math.ceil(totalCount / pageSize)
}

/**
 * Check if there are more pages available
 */
export function hasMorePages(
  currentPage: number,
  totalCount: number,
  pageSize: number
): boolean {
  return currentPage < calculateTotalPages(totalCount, pageSize)
}
