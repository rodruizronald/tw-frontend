/**
 * Jobs Hooks Module
 *
 * React hooks for job-related functionality including:
 * - useJobSearch: Search for jobs with React Query
 * - useJobFilters: Manage filter state with URL sync
 * - useJobPagination: Handle pagination state
 * - useCompanyOptions: Manage company filter options
 */

// =============================================================================
// Job Search Hook
// =============================================================================

export type {
  PaginationState,
  SearchState,
  UseJobSearchReturn,
} from './useJobSearch'
export { useJobSearch } from './useJobSearch'

// =============================================================================
// Job Filters Hook
// =============================================================================

export type { AnchorElements, UseJobFiltersReturn } from './useJobFilters'
export { useJobFilters } from './useJobFilters'

// =============================================================================
// Job Pagination Hook
// =============================================================================

export type {
  ApiPagination,
  SearchFunction,
  UseJobPaginationReturn,
} from './useJobPagination'
export {
  paginationToURLParams,
  urlParamsToPage,
  useJobPagination,
} from './useJobPagination'

// =============================================================================
// Company Options Hook
// =============================================================================

export type {
  CompanyOption,
  UseCompanyOptionsReturn,
} from './useCompanyOptions'
export { useCompanyOptions } from './useCompanyOptions'
