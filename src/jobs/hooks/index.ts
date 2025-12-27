/**
 * Jobs Hooks Module
 *
 * React hooks for job-related functionality including:
 * - useJobSearch: Search for jobs with React Query
 * - useJobFilters: Manage filter state
 * - useJobPagination: Handle pagination state
 */

// Job Search Hook
export type {
  PaginationState,
  SearchState,
  UseJobSearchReturn,
} from './useJobSearch'
export { convertLegacyFilters, useJobSearch } from './useJobSearch'

// Job Filters Hook
export { useJobFilters } from './useJobFilters'

// Job Pagination Hook
export type {
  ApiPagination,
  SearchFunction,
  UseJobPaginationReturn,
} from './useJobPagination'
export { useJobPagination } from './useJobPagination'
