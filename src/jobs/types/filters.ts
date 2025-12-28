/**
 * Job Search Filter Types
 *
 * These types define the structure for job search parameters
 * used throughout the application. Supports multi-select filters
 * and URL persistence.
 */

import { subDays } from 'date-fns'

import type {
  EmploymentType,
  ExperienceLevel,
  JobFunction,
  Language,
  Province,
  WorkMode,
} from './enums'

// =============================================================================
// Date Preset Types
// =============================================================================

/**
 * Date preset options for the date filter (radio buttons)
 */
export type DatePreset = 'any' | 'month' | 'week' | '24hours'

/**
 * Date preset configuration with labels
 */
export const DATE_PRESETS: Array<{ value: DatePreset; label: string }> = [
  { value: 'any', label: 'Any time' },
  { value: 'month', label: 'Past month' },
  { value: 'week', label: 'Past week' },
  { value: '24hours', label: 'Past 24 hours' },
]

/**
 * Convert a date preset to actual date range
 * @param preset - The date preset selected
 * @returns Object with dateFrom and dateTo ISO strings, or null for 'any'
 */
export function datePresetToRange(
  preset: DatePreset
): { dateFrom: string; dateTo: string } | null {
  const now = new Date()
  const formatDate = (date: Date): string => date.toISOString()

  switch (preset) {
    case '24hours':
      return {
        dateFrom: formatDate(subDays(now, 1)),
        dateTo: formatDate(now),
      }
    case 'week':
      return {
        dateFrom: formatDate(subDays(now, 7)),
        dateTo: formatDate(now),
      }
    case 'month':
      return {
        dateFrom: formatDate(subDays(now, 30)),
        dateTo: formatDate(now),
      }
    case 'any':
    default:
      // 'any' defaults to last 90 days
      return {
        dateFrom: formatDate(subDays(now, 90)),
        dateTo: formatDate(now),
      }
  }
}

// =============================================================================
// Search Filter Types (Multi-Select)
// =============================================================================

/**
 * Job search filters interface
 *
 * Multi-select filters use arrays. Single-select filters use single values.
 * All filters are optional except for `query` which is required.
 *
 * @example
 * ```typescript
 * const filters: JobSearchFilters = {
 *   query: 'react developer',
 *   experienceLevel: ['senior', 'mid-level'],
 *   workMode: ['remote'],
 *   province: ['san-jose', 'heredia'],
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
   * Filter by experience levels (multi-select)
   */
  experienceLevel?: ExperienceLevel[]

  /**
   * Filter by employment types (multi-select)
   */
  employmentType?: EmploymentType[]

  /**
   * Filter by work modes (multi-select)
   */
  workMode?: WorkMode[]

  /**
   * Filter by provinces (multi-select)
   */
  province?: Province[]

  /**
   * Filter by job functions (multi-select)
   */
  jobFunction?: JobFunction[]

  /**
   * Filter by companies (multi-select)
   */
  company?: string[]

  /**
   * Filter by language (single-select, radio button)
   */
  language?: Language

  /**
   * Date preset selection (radio button)
   */
  datePreset?: DatePreset
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
// Filter Keys for UI
// =============================================================================

/**
 * Filter key type for multi-select filters
 */
export type MultiSelectFilterKey =
  | 'experienceLevel'
  | 'employmentType'
  | 'workMode'
  | 'province'
  | 'jobFunction'
  | 'company'

/**
 * Filter key type for single-select filters
 */
export type SingleSelectFilterKey = 'language' | 'datePreset'

/**
 * All filter keys (excluding query)
 */
export type FilterKey = MultiSelectFilterKey | SingleSelectFilterKey

/**
 * List of all multi-select filter keys
 */
export const MULTI_SELECT_FILTER_KEYS: MultiSelectFilterKey[] = [
  'experienceLevel',
  'employmentType',
  'workMode',
  'province',
  'jobFunction',
  'company',
]

/**
 * List of all single-select filter keys
 */
export const SINGLE_SELECT_FILTER_KEYS: SingleSelectFilterKey[] = [
  'language',
  'datePreset',
]

// =============================================================================
// Supabase RPC Parameter Types
// =============================================================================

/**
 * Parameters for the search_jobs RPC function
 * Maps to the PostgreSQL function parameters with array support
 */
export interface SearchJobsRpcParams {
  search_query: string
  p_limit?: number | undefined
  p_offset?: number | undefined
  p_experience_level?: ExperienceLevel[] | undefined
  p_employment_type?: EmploymentType[] | undefined
  p_work_mode?: WorkMode[] | undefined
  p_province?: Province[] | undefined
  p_job_function?: JobFunction[] | undefined
  p_company?: string[] | undefined
  p_language?: Language | undefined
  p_date_from?: string | undefined
  p_date_to?: string | undefined
}

/**
 * Parameters for the get_companies_for_search RPC function
 */
export interface GetCompaniesRpcParams {
  search_query: string
  p_limit?: number | undefined
  p_experience_level?: ExperienceLevel[] | undefined
  p_employment_type?: EmploymentType[] | undefined
  p_work_mode?: WorkMode[] | undefined
  p_province?: Province[] | undefined
  p_job_function?: JobFunction[] | undefined
  p_language?: Language | undefined
  p_date_from?: string | undefined
  p_date_to?: string | undefined
}

// =============================================================================
// Conversion Functions
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

  // Convert date preset to actual dates
  const dateRange = filters.datePreset
    ? datePresetToRange(filters.datePreset)
    : null

  return {
    search_query: filters.query,
    p_limit: pageSize,
    p_offset: offset,
    p_experience_level: filters.experienceLevel?.length
      ? filters.experienceLevel
      : undefined,
    p_employment_type: filters.employmentType?.length
      ? filters.employmentType
      : undefined,
    p_work_mode: filters.workMode?.length ? filters.workMode : undefined,
    p_province: filters.province?.length ? filters.province : undefined,
    p_job_function: filters.jobFunction?.length
      ? filters.jobFunction
      : undefined,
    p_company: filters.company?.length ? filters.company : undefined,
    p_language: filters.language,
    p_date_from: dateRange?.dateFrom,
    p_date_to: dateRange?.dateTo,
  }
}

/**
 * Convert JobSearchFilters to get_companies_for_search RPC parameters
 * (Same as search params but without company filter)
 *
 * @param filters - The search filters from the UI
 * @returns Parameters formatted for the get_companies_for_search RPC function
 */
export function toGetCompaniesRpcParams(
  filters: JobSearchFilters
): GetCompaniesRpcParams {
  const dateRange = filters.datePreset
    ? datePresetToRange(filters.datePreset)
    : null

  return {
    search_query: filters.query,
    p_limit: 100,
    p_experience_level: filters.experienceLevel?.length
      ? filters.experienceLevel
      : undefined,
    p_employment_type: filters.employmentType?.length
      ? filters.employmentType
      : undefined,
    p_work_mode: filters.workMode?.length ? filters.workMode : undefined,
    p_province: filters.province?.length ? filters.province : undefined,
    p_job_function: filters.jobFunction?.length
      ? filters.jobFunction
      : undefined,
    p_language: filters.language,
    p_date_from: dateRange?.dateFrom,
    p_date_to: dateRange?.dateTo,
  }
}

// =============================================================================
// URL Persistence Functions
// =============================================================================

/**
 * Serialize filters to URL search params
 * Arrays are comma-separated, single values are stored directly
 *
 * @param filters - The current filter state
 * @returns URLSearchParams object
 */
export function filtersToURLParams(
  filters: Partial<JobSearchFilters>
): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.query) {
    params.set('q', filters.query)
  }

  // Multi-select filters (comma-separated)
  if (filters.experienceLevel?.length) {
    params.set('exp', filters.experienceLevel.join(','))
  }
  if (filters.employmentType?.length) {
    params.set('type', filters.employmentType.join(','))
  }
  if (filters.workMode?.length) {
    params.set('mode', filters.workMode.join(','))
  }
  if (filters.province?.length) {
    params.set('prov', filters.province.join(','))
  }
  if (filters.jobFunction?.length) {
    params.set('func', filters.jobFunction.join(','))
  }
  if (filters.company?.length) {
    params.set('company', filters.company.join(','))
  }

  // Single-select filters
  if (filters.language) {
    params.set('lang', filters.language)
  }
  if (filters.datePreset && filters.datePreset !== 'any') {
    params.set('date', filters.datePreset)
  }

  return params
}

/**
 * Deserialize URL search params to filters
 *
 * @param params - URLSearchParams from the URL
 * @returns Partial filter state
 */
export function urlParamsToFilters(
  params: URLSearchParams
): Partial<JobSearchFilters> {
  const filters: Partial<JobSearchFilters> = {}

  const query = params.get('q')
  if (query) {
    filters.query = query
  }

  // Multi-select filters
  const exp = params.get('exp')
  if (exp) {
    filters.experienceLevel = exp.split(',') as ExperienceLevel[]
  }

  const type = params.get('type')
  if (type) {
    filters.employmentType = type.split(',') as EmploymentType[]
  }

  const mode = params.get('mode')
  if (mode) {
    filters.workMode = mode.split(',') as WorkMode[]
  }

  const prov = params.get('prov')
  if (prov) {
    filters.province = prov.split(',') as Province[]
  }

  const func = params.get('func')
  if (func) {
    filters.jobFunction = func.split(',') as JobFunction[]
  }

  const company = params.get('company')
  if (company) {
    filters.company = company.split(',')
  }

  // Single-select filters
  const lang = params.get('lang')
  if (lang) {
    filters.language = lang as Language
  }

  const date = params.get('date')
  if (date) {
    filters.datePreset = date as DatePreset
  }

  return filters
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Count the number of active filters (excluding query)
 * For multi-select, counts the number of selected items
 *
 * @param filters - The current filter state
 * @returns Total number of active filter selections
 */
export function countActiveFilters(filters: Partial<JobSearchFilters>): number {
  let count = 0

  // Count multi-select items
  count += filters.experienceLevel?.length ?? 0
  count += filters.employmentType?.length ?? 0
  count += filters.workMode?.length ?? 0
  count += filters.province?.length ?? 0
  count += filters.jobFunction?.length ?? 0
  count += filters.company?.length ?? 0

  // Count single-select (1 if set)
  if (filters.language) count += 1
  if (filters.datePreset && filters.datePreset !== 'any') count += 1

  return count
}

/**
 * Count active selections for a specific filter
 *
 * @param filters - The current filter state
 * @param key - The filter key to count
 * @returns Number of selections for that filter
 */
export function countFilterSelections(
  filters: Partial<JobSearchFilters>,
  key: FilterKey
): number {
  const value = filters[key]

  if (Array.isArray(value)) {
    return value.length
  }

  if (key === 'datePreset') {
    return value && value !== 'any' ? 1 : 0
  }

  return value ? 1 : 0
}

/**
 * Check if any filters are active (excluding query)
 *
 * @param filters - The current filter state
 * @returns True if any filters are active
 */
export function hasActiveFilters(filters: Partial<JobSearchFilters>): boolean {
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
): Partial<JobSearchFilters> {
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

/**
 * Toggle a value in a multi-select filter array
 *
 * @param currentValues - Current array of selected values
 * @param value - Value to toggle
 * @returns New array with value added or removed
 */
export function toggleFilterValue<T>(
  currentValues: T[] | undefined,
  value: T
): T[] {
  const values = currentValues ?? []
  const index = values.indexOf(value)

  if (index === -1) {
    return [...values, value]
  }

  return values.filter((_, i) => i !== index)
}
