/**
 * useCompanyOptions Hook
 *
 * Manages company options for the company filter dropdown.
 * Loads companies dynamically based on current search criteria.
 */

import { useCallback, useEffect, useState } from 'react'

import { useLogger } from '@/services/logging'
import type { SupabaseAppError } from '@/services/supabase/errors'

import { getCompanies, getCompaniesForJobs } from '../api/jobRepository'
import type { JobSearchFilters } from '../types/filters'
import { toGetCompaniesRpcParams } from '../types/filters'

// =============================================================================
// Types
// =============================================================================

/**
 * Company option with job count
 */
export interface CompanyOption {
  /** Company name */
  name: string
  /** Number of jobs from this company (optional, only when filtered) */
  jobCount?: number
}

/**
 * Return type for the useCompanyOptions hook
 */
export interface UseCompanyOptionsReturn {
  /** List of company options */
  companies: CompanyOption[]
  /** True while loading companies */
  isLoading: boolean
  /** Error if loading failed */
  error: SupabaseAppError | null
  /** Refresh companies based on current search filters */
  refreshForSearch: (filters: JobSearchFilters) => Promise<void>
  /** Load all companies (initial load) */
  loadAllCompanies: () => Promise<void>
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Hook for managing company filter options
 *
 * This hook provides two modes of operation:
 * 1. Initial load: Fetches all active companies from the database
 * 2. Filtered load: Fetches companies that have jobs matching the current search
 *
 * @param autoLoad - Whether to automatically load companies on mount (default: true)
 *
 * @example
 * ```typescript
 * const { companies, isLoading, refreshForSearch } = useCompanyOptions()
 *
 * // After a search, refresh company options
 * await refreshForSearch({ query: 'react developer', experienceLevel: ['senior'] })
 *
 * // Render company options
 * companies.forEach(company => {
 *   console.log(`${company.name} (${company.jobCount ?? '?'} jobs)`)
 * })
 * ```
 */
export function useCompanyOptions(
  autoLoad: boolean = true
): UseCompanyOptionsReturn {
  const logger = useLogger('useCompanyOptions')

  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<SupabaseAppError | null>(null)

  /**
   * Load all active companies (for initial dropdown population)
   */
  const loadAllCompanies = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)

    logger.debug('Loading all companies')

    try {
      const result = await getCompanies(100)

      if (result.error) {
        logger.error('Failed to load companies', {
          error: result.error.message,
        })
        setError(result.error)
        setCompanies([])
        return
      }

      const companyOptions: CompanyOption[] = result.data.map(company => ({
        name: company.name,
      }))

      logger.debug('Companies loaded', { count: companyOptions.length })
      setCompanies(companyOptions)
    } catch (err) {
      logger.error('Unexpected error loading companies', { error: err })
      setCompanies([])
    } finally {
      setIsLoading(false)
    }
  }, [logger])

  /**
   * Refresh companies based on current search filters
   * This shows only companies that have jobs matching the filters
   */
  const refreshForSearch = useCallback(
    async (filters: JobSearchFilters): Promise<void> => {
      // If no query, fall back to all companies
      if (!filters.query?.trim()) {
        await loadAllCompanies()
        return
      }

      setIsLoading(true)
      setError(null)

      logger.debug('Refreshing companies for search', {
        query: filters.query,
      })

      try {
        // Convert filters to RPC params (excluding company filter)
        const rpcParams = toGetCompaniesRpcParams(filters)

        const result = await getCompaniesForJobs(rpcParams)

        if (result.error) {
          logger.error('Failed to refresh companies for search', {
            error: result.error.message,
          })
          setError(result.error)
          // Keep existing companies on error
          return
        }

        const companyOptions: CompanyOption[] = result.data.map(item => ({
          name: item.company_name,
          jobCount: item.job_count,
        }))

        logger.debug('Companies refreshed for search', {
          count: companyOptions.length,
        })
        setCompanies(companyOptions)
      } catch (err) {
        logger.error('Unexpected error refreshing companies', { error: err })
        // Keep existing companies on error
      } finally {
        setIsLoading(false)
      }
    },
    [logger, loadAllCompanies]
  )

  // Auto-load companies on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadAllCompanies()
    }
  }, [autoLoad, loadAllCompanies])

  return {
    companies,
    isLoading,
    error,
    refreshForSearch,
    loadAllCompanies,
  }
}
