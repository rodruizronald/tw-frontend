/**
 * useJobPagination Hook
 *
 * Manages pagination state for job search results.
 * Handles URL synchronization, page changes, and job selection.
 */

import { useEffect, useMemo, useState } from 'react'
import type { SetURLSearchParams } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

import { PAGINATION } from '../constants'
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
 * Search function type - accepts any filter format
 */
export type SearchFunction = (
  searchQuery: string,
  filters: unknown,
  pagination: { page?: number; pageSize?: number }
) => Promise<{ jobs: Job[]; pagination: ApiPagination | null }>

/**
 * Return type for the useJobPagination hook
 */
export interface UseJobPaginationReturn {
  currentPage: number
  totalPages: number
  totalJobs: number
  currentPageJobs: Job[]
  selectedJob: Job | null
  selectedJobId: string | null
  setSelectedJobId: (id: string | null) => void
  handlePageChange: (newPage: number) => Promise<void>
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
 * @param searchQuery - Current search query string
 * @param activeFilters - Current active filters (any format)
 */
export function useJobPagination(
  apiJobs: Job[],
  apiPagination: ApiPagination | null,
  searchJobs: SearchFunction,
  searchQuery: string,
  activeFilters: unknown
): UseJobPaginationReturn {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  // Get current page from URL, default to 1
  const currentPage =
    parseInt(searchParams.get('p') ?? '') || PAGINATION.DEFAULT_PAGE

  // Calculate pagination values from API metadata
  const totalJobs = apiPagination?.total ?? 0
  const totalPages = apiPagination
    ? Math.ceil(apiPagination.total / apiPagination.limit)
    : PAGINATION.DEFAULT_PAGE

  // For server-side pagination, currentPageJobs = all apiJobs
  const currentPageJobs = apiJobs

  // Handle page change - make new API call
  const handlePageChange = async (newPage: number): Promise<void> => {
    const newSearchParams = new URLSearchParams(searchParams)

    if (newPage === PAGINATION.DEFAULT_PAGE) {
      newSearchParams.delete('p')
    } else {
      newSearchParams.set('p', newPage.toString())
    }

    setSearchParams(newSearchParams)

    // Make API call for new page
    try {
      await searchJobs(searchQuery, activeFilters, {
        page: newPage,
        pageSize: PAGINATION.PAGE_SIZE,
      })
    } catch (error) {
      console.error('Failed to fetch page:', error)
    }
  }

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
