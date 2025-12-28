/**
 * useJobPagination Hook
 *
 * Manages pagination state for job search results.
 * Handles URL synchronization, page changes, and job selection.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SetURLSearchParams } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

import { PAGINATION } from '../constants'
import type { JobSearchFilters, JobSearchPagination } from '../types/filters'
import type { Job } from '../types/models'

// =============================================================================
// Types
// =============================================================================

/**
 * Pagination metadata from the API
 */
export interface ApiPagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

/**
 * Search function type for pagination
 */
export type SearchFunction = (
  filters: JobSearchFilters,
  pagination?: JobSearchPagination
) => Promise<{ jobs: Job[]; pagination: ApiPagination | null }>

/**
 * Return type for the useJobPagination hook
 */
export interface UseJobPaginationReturn {
  /** Current page number (1-indexed) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Total number of jobs matching the search */
  totalJobs: number
  /** Jobs for the current page */
  currentPageJobs: Job[]
  /** Currently selected job */
  selectedJob: Job | null
  /** ID of the selected job */
  selectedJobId: string | null
  /** Set the selected job by ID */
  setSelectedJobId: (id: string | null) => void
  /** Handle page change */
  handlePageChange: (newPage: number) => Promise<void>
  /** URL search params setter */
  setSearchParams: SetURLSearchParams
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Hook for managing job search pagination
 *
 * @param apiJobs - Current page of jobs from the API
 * @param apiPagination - Pagination metadata from the API
 * @param searchJobs - Function to execute searches
 * @param currentFilters - Current active filters
 *
 * @example
 * ```typescript
 * const {
 *   currentPage,
 *   totalPages,
 *   handlePageChange,
 *   selectedJob,
 * } = useJobPagination(jobs, pagination, search, filters)
 *
 * // Change page
 * await handlePageChange(2)
 * ```
 */
export function useJobPagination(
  apiJobs: Job[],
  apiPagination: ApiPagination | null,
  searchJobs: SearchFunction,
  currentFilters: JobSearchFilters
): UseJobPaginationReturn {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  // Get current page from URL, default to 1
  const currentPage =
    parseInt(searchParams.get('p') ?? '', 10) || PAGINATION.DEFAULT_PAGE

  // Calculate pagination values from API metadata
  const totalJobs = apiPagination?.total ?? 0
  const totalPages = apiPagination
    ? Math.ceil(apiPagination.total / apiPagination.limit)
    : PAGINATION.DEFAULT_PAGE

  // For server-side pagination, currentPageJobs = all apiJobs
  const currentPageJobs = apiJobs

  /**
   * Handle page change - update URL and make new API call
   */
  const handlePageChange = useCallback(
    async (newPage: number): Promise<void> => {
      const newSearchParams = new URLSearchParams(searchParams)

      if (newPage === PAGINATION.DEFAULT_PAGE) {
        newSearchParams.delete('p')
      } else {
        newSearchParams.set('p', newPage.toString())
      }

      setSearchParams(newSearchParams)

      // Make API call for new page
      try {
        await searchJobs(currentFilters, {
          page: newPage,
          pageSize: PAGINATION.PAGE_SIZE,
        })
      } catch (error) {
        console.error('Failed to fetch page:', error)
      }
    },
    [searchParams, setSearchParams, searchJobs, currentFilters]
  )

  // Auto-select first job when jobs change and no job is selected
  useEffect(() => {
    if (apiJobs.length > 0 && apiJobs[0]?.id) {
      setSelectedJobId(apiJobs[0].id)
    }
  }, [apiJobs])

  // Only recalculates when dependencies change
  const selectedJob = useMemo(() => {
    return apiJobs.find(job => job.id === selectedJobId) ?? null
  }, [apiJobs, selectedJobId])

  return {
    currentPage,
    totalPages,
    totalJobs,
    currentPageJobs,
    selectedJob,
    selectedJobId,
    setSelectedJobId,
    handlePageChange,
    setSearchParams,
  }
}

// =============================================================================
// URL Utilities
// =============================================================================

/**
 * Parse page number from URL search params
 *
 * @param params - URLSearchParams object
 * @returns Page number (1 if not specified or invalid)
 */
export function urlParamsToPage(params: URLSearchParams): number {
  const pageStr = params.get('p')
  if (!pageStr) return PAGINATION.DEFAULT_PAGE

  const page = parseInt(pageStr, 10)
  return isNaN(page) || page < 1 ? PAGINATION.DEFAULT_PAGE : page
}

/**
 * Create URL search params with pagination
 *
 * @param page - Page number to set
 * @param existingParams - Existing params to preserve
 * @returns Updated URLSearchParams
 */
export function paginationToURLParams(
  page: number,
  existingParams?: URLSearchParams
): URLSearchParams {
  const params = new URLSearchParams(existingParams)

  if (page === PAGINATION.DEFAULT_PAGE) {
    params.delete('p')
  } else {
    params.set('p', page.toString())
  }

  return params
}
