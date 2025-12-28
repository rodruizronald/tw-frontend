/**
 * useJobSearch Hook
 *
 * React Query-based hook for managing job search operations.
 * Provides search functionality with caching, loading states, and error handling.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'

import { useLogger } from '@/services/logging'
import type { SupabaseAppError } from '@/services/supabase/errors'

import { searchJobs as searchJobsApi } from '../api/jobService'
import type { JobSearchFilters, JobSearchPagination } from '../types/filters'
import type { Job } from '../types/models'

// =============================================================================
// Types
// =============================================================================

/**
 * Pagination state returned by the hook
 */
export interface PaginationState {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

/**
 * Search state containing jobs and pagination
 */
export interface SearchState {
  jobs: Job[]
  pagination: PaginationState | null
}

/**
 * Internal search parameters for query key generation
 */
interface SearchParameters {
  filters: JobSearchFilters
  pagination: JobSearchPagination
}

/**
 * Return type for the useJobSearch hook
 */
export interface UseJobSearchReturn {
  /** List of jobs from the search results */
  jobs: Job[]
  /** Pagination information */
  pagination: PaginationState | null
  /** True during initial load (no data yet) */
  isLoading: boolean
  /** True when fetching (including background refetch) */
  isFetching: boolean
  /** True if the last request failed */
  isError: boolean
  /** Error details if isError is true */
  error: SupabaseAppError | null
  /** Execute a job search */
  search: (
    filters: JobSearchFilters,
    pagination?: JobSearchPagination
  ) => Promise<SearchState>
  /** Clear all search results and reset state */
  clearSearch: () => void
  /** Retry the last failed search */
  retrySearch: () => void
}

// =============================================================================
// Query Key Factory
// =============================================================================

/**
 * Create a stable query key from search parameters
 */
function createQueryKey(
  params: SearchParameters | null
): readonly ['jobs', 'search', ...unknown[]] {
  if (!params) {
    return ['jobs', 'search', 'empty'] as const
  }

  return [
    'jobs',
    'search',
    params.filters.query,
    params.filters.experienceLevel,
    params.filters.employmentType,
    params.filters.workMode,
    params.filters.province,
    params.filters.jobFunction,
    params.filters.language,
    params.filters.company,
    params.filters.datePreset,
    params.pagination.page,
    params.pagination.pageSize,
  ] as const
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Custom hook for managing job search with React Query
 *
 * @example
 * ```typescript
 * const { jobs, pagination, isLoading, search } = useJobSearch()
 *
 * // Execute search
 * await search(
 *   { query: 'react developer', experienceLevel: ['senior'] },
 *   { page: 1, pageSize: 20 }
 * )
 *
 * // Access results
 * console.log(`Found ${pagination?.total} jobs`)
 * jobs.forEach(job => console.log(job.title))
 * ```
 */
export function useJobSearch(): UseJobSearchReturn {
  const logger = useLogger('useJobSearch')
  const queryClient = useQueryClient()

  // Track current search parameters
  const [searchParams, setSearchParams] = useState<SearchParameters | null>(
    null
  )

  // Track the last error from the API
  const [apiError, setApiError] = useState<SupabaseAppError | null>(null)

  // Create query key from search parameters
  const queryKey = createQueryKey(searchParams)

  // React Query for API calls
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey,
    queryFn: async (): Promise<SearchState> => {
      if (!searchParams) {
        return { jobs: [], pagination: null }
      }

      const { filters, pagination } = searchParams

      logger.info('Executing job search', {
        query: filters.query,
        filters: {
          experienceLevel: filters.experienceLevel,
          employmentType: filters.employmentType,
          workMode: filters.workMode,
          province: filters.province,
          jobFunction: filters.jobFunction,
          language: filters.language,
          company: filters.company,
          datePreset: filters.datePreset,
        },
        pagination,
      })

      const result = await searchJobsApi(filters, pagination)

      // Handle API-level errors
      if (result.error) {
        logger.error('Job search failed', {
          error: result.error.message,
          type: result.error.type,
        })
        setApiError(result.error)
        // Still return the empty result structure
        return {
          jobs: result.jobs,
          pagination: result.pagination,
        }
      }

      // Clear any previous error on success
      setApiError(null)

      logger.info('Job search completed', {
        jobCount: result.jobs.length,
        total: result.pagination?.total ?? 0,
        hasMore: result.pagination?.hasMore ?? false,
      })

      return {
        jobs: result.jobs,
        pagination: result.pagination,
      }
    },
    // Only run if we have a valid search query
    enabled: !!searchParams?.filters.query?.trim(),
    // Cache configuration
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Keep previous data while fetching new data
    placeholderData: previousData => previousData,
  })

  /**
   * Execute a job search
   */
  const search = useCallback(
    async (
      filters: JobSearchFilters,
      pagination: JobSearchPagination = {}
    ): Promise<SearchState> => {
      const emptyState: SearchState = { jobs: [], pagination: null }

      // Validate query
      if (!filters.query?.trim()) {
        logger.debug('Skipping search - empty query')
        setSearchParams(null)
        setApiError(null)
        return emptyState
      }

      const normalizedFilters: JobSearchFilters = {
        ...filters,
        query: filters.query.trim(),
      }

      const normalizedPagination: JobSearchPagination = {
        page: pagination.page ?? 1,
        pageSize: pagination.pageSize ?? 20,
      }

      const newParams: SearchParameters = {
        filters: normalizedFilters,
        pagination: normalizedPagination,
      }

      // Check for duplicate requests
      const newQueryKey = createQueryKey(newParams)
      const currentQueryKey = createQueryKey(searchParams)

      if (JSON.stringify(newQueryKey) === JSON.stringify(currentQueryKey)) {
        logger.debug('Skipping duplicate search request')
        return data ?? emptyState
      }

      logger.debug('Initiating new search', {
        query: normalizedFilters.query,
        page: normalizedPagination.page,
      })

      // Update state to trigger query
      setSearchParams(newParams)

      // Fetch and return results
      try {
        const result = await queryClient.fetchQuery({
          queryKey: createQueryKey(newParams),
          queryFn: async (): Promise<SearchState> => {
            const apiResult = await searchJobsApi(
              normalizedFilters,
              normalizedPagination
            )

            if (apiResult.error) {
              setApiError(apiResult.error)
            } else {
              setApiError(null)
            }

            return {
              jobs: apiResult.jobs,
              pagination: apiResult.pagination,
            }
          },
          staleTime: 5 * 60 * 1000,
        })

        return result
      } catch (error) {
        logger.error('Search query failed', { error })
        return emptyState
      }
    },
    [searchParams, data, queryClient, logger]
  )

  /**
   * Clear search results and reset state
   */
  const clearSearch = useCallback((): void => {
    logger.debug('Clearing search results')
    setSearchParams(null)
    setApiError(null)
    queryClient.removeQueries({ queryKey: ['jobs', 'search'] })
  }, [queryClient, logger])

  /**
   * Retry the last search
   */
  const retrySearch = useCallback((): void => {
    if (searchParams) {
      logger.info('Retrying last search')
      setApiError(null)
      refetch()
    } else {
      logger.warn('No previous search to retry')
    }
  }, [searchParams, refetch, logger])

  return {
    // Data
    jobs: data?.jobs ?? [],
    pagination: data?.pagination ?? null,

    // Loading states
    isLoading,
    isFetching,

    // Error state
    isError: isError || apiError !== null,
    error: apiError,

    // Actions
    search,
    clearSearch,
    retrySearch,
  }
}
