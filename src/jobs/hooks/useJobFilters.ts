/**
 * useJobFilters Hook
 *
 * Manages filter state for job search including:
 * - Multi-select filters (arrays)
 * - Single-select filters (radio buttons)
 * - Dropdown anchor elements
 * - URL synchronization
 */

import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import type {
  DatePreset,
  FilterKey,
  JobSearchFilters,
  MultiSelectFilterKey,
  SingleSelectFilterKey,
} from '../types/filters'
import {
  countFilterSelections,
  filtersToURLParams,
  hasActiveFilters,
  MULTI_SELECT_FILTER_KEYS,
  SINGLE_SELECT_FILTER_KEYS,
  toggleFilterValue,
  urlParamsToFilters,
} from '../types/filters'

// =============================================================================
// Types
// =============================================================================

/**
 * Anchor elements state for filter dropdowns
 */
export type AnchorElements = Record<FilterKey, HTMLElement | null>

/**
 * Return type for the useJobFilters hook
 */
export interface UseJobFiltersReturn {
  // Filter values
  /** Current filter state */
  filters: Partial<JobSearchFilters>

  // Anchor elements for dropdowns
  /** Anchor elements for each filter dropdown */
  anchorEls: AnchorElements

  // Filter actions
  /** Toggle a value in a multi-select filter */
  toggleFilter: (key: MultiSelectFilterKey, value: string) => void
  /** Set a single-select filter value */
  setFilter: <K extends SingleSelectFilterKey>(
    key: K,
    value: K extends 'language' ? string : DatePreset
  ) => void
  /** Clear a specific filter */
  clearFilter: (key: FilterKey) => void
  /** Clear all filters */
  clearAllFilters: () => void

  // Dropdown actions
  /** Open a filter dropdown */
  openDropdown: (key: FilterKey, el: HTMLElement) => void
  /** Close a filter dropdown */
  closeDropdown: (key: FilterKey) => void
  /** Check if a dropdown is open */
  isDropdownOpen: (key: FilterKey) => boolean

  // Utilities
  /** Get the count of active selections for a filter */
  getActiveCount: (key: FilterKey) => number
  /** Get total count of all active filters */
  getTotalActiveCount: () => number
  /** Check if a specific value is selected in a filter */
  isFilterActive: (key: FilterKey, value: string) => boolean
  /** Check if any filters are active */
  hasFilters: boolean
}

// =============================================================================
// Constants
// =============================================================================

/**
 * Initial anchor elements state
 */
const INITIAL_ANCHORS: AnchorElements = {
  experienceLevel: null,
  employmentType: null,
  workMode: null,
  province: null,
  jobFunction: null,
  company: null,
  language: null,
  datePreset: null,
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Hook for managing job search filters
 *
 * @param syncWithUrl - Whether to sync filter state with URL (default: true)
 * @returns Filter state and actions
 *
 * @example
 * ```typescript
 * const {
 *   filters,
 *   toggleFilter,
 *   setFilter,
 *   clearAllFilters,
 *   getActiveCount,
 * } = useJobFilters()
 *
 * // Toggle a multi-select filter
 * toggleFilter('experienceLevel', 'senior')
 *
 * // Set a single-select filter
 * setFilter('datePreset', 'week')
 *
 * // Get active count for a filter
 * const count = getActiveCount('experienceLevel') // Returns number of selected levels
 * ```
 */
export function useJobFilters(
  syncWithUrl: boolean = true
): UseJobFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams()

  // Filter state - initialize from URL on mount
  const [filters, setFilters] = useState<Partial<JobSearchFilters>>(() => {
    if (syncWithUrl) {
      return urlParamsToFilters(searchParams)
    }
    return {}
  })

  // Anchor elements for dropdowns
  const [anchorEls, setAnchorEls] = useState<AnchorElements>(INITIAL_ANCHORS)

  // ==========================================================================
  // URL Sync
  // ==========================================================================

  /**
   * Update URL with current filters
   */
  const updateUrl = useCallback(
    (newFilters: Partial<JobSearchFilters>): void => {
      if (!syncWithUrl) return

      const params = filtersToURLParams(newFilters)

      // Preserve non-filter params (like page)
      const currentPage = searchParams.get('p')
      if (currentPage) {
        params.set('p', currentPage)
      }

      setSearchParams(params, { replace: true })
    },
    [syncWithUrl, searchParams, setSearchParams]
  )

  // ==========================================================================
  // Filter Actions
  // ==========================================================================

  /**
   * Toggle a value in a multi-select filter
   */
  const toggleFilter = useCallback(
    (key: MultiSelectFilterKey, value: string): void => {
      setFilters(prev => {
        const currentValues = prev[key] as string[] | undefined
        const newValues = toggleFilterValue(currentValues, value)

        const newFilters = {
          ...prev,
          [key]: newValues.length > 0 ? newValues : undefined,
        }

        // Clean up undefined values
        if (newFilters[key] === undefined) {
          delete newFilters[key]
        }

        updateUrl(newFilters)
        return newFilters
      })
    },
    [updateUrl]
  )

  /**
   * Set a single-select filter value
   */
  const setFilter = useCallback(
    <K extends SingleSelectFilterKey>(
      key: K,
      value: K extends 'language' ? string : DatePreset
    ): void => {
      setFilters(prev => {
        const newFilters = {
          ...prev,
          [key]: value,
        }

        // Remove datePreset if set to 'any'
        if (key === 'datePreset' && value === 'any') {
          delete newFilters.datePreset
        }

        updateUrl(newFilters)
        return newFilters
      })
    },
    [updateUrl]
  )

  /**
   * Clear a specific filter
   */
  const clearFilter = useCallback(
    (key: FilterKey): void => {
      setFilters(prev => {
        const newFilters = { ...prev }
        delete newFilters[key]
        updateUrl(newFilters)
        return newFilters
      })
    },
    [updateUrl]
  )

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback((): void => {
    const newFilters: Partial<JobSearchFilters> = {}

    // Preserve query if it exists
    if (filters.query) {
      newFilters.query = filters.query
    }

    setFilters(newFilters)
    updateUrl(newFilters)
  }, [filters.query, updateUrl])

  // ==========================================================================
  // Dropdown Actions
  // ==========================================================================

  /**
   * Open a filter dropdown
   */
  const openDropdown = useCallback((key: FilterKey, el: HTMLElement): void => {
    setAnchorEls(prev => ({ ...prev, [key]: el }))
  }, [])

  /**
   * Close a filter dropdown
   */
  const closeDropdown = useCallback((key: FilterKey): void => {
    setAnchorEls(prev => ({ ...prev, [key]: null }))
  }, [])

  /**
   * Check if a dropdown is open
   */
  const isDropdownOpen = useCallback(
    (key: FilterKey): boolean => {
      return anchorEls[key] !== null
    },
    [anchorEls]
  )

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  /**
   * Get the count of active selections for a filter
   */
  const getActiveCount = useCallback(
    (key: FilterKey): number => {
      return countFilterSelections(filters, key)
    },
    [filters]
  )

  /**
   * Get total count of all active filters
   */
  const getTotalActiveCount = useCallback((): number => {
    let count = 0

    // Count multi-select filters
    for (const key of MULTI_SELECT_FILTER_KEYS) {
      const value = filters[key]
      if (Array.isArray(value)) {
        count += value.length
      }
    }

    // Count single-select filters
    for (const key of SINGLE_SELECT_FILTER_KEYS) {
      const value = filters[key]
      if (key === 'datePreset') {
        if (value && value !== 'any') count += 1
      } else if (value) {
        count += 1
      }
    }

    return count
  }, [filters])

  /**
   * Check if a specific value is selected in a filter
   */
  const isFilterActive = useCallback(
    (key: FilterKey, value: string): boolean => {
      const filterValue = filters[key]

      if (Array.isArray(filterValue)) {
        return (filterValue as string[]).includes(value)
      }

      return filterValue === value
    },
    [filters]
  )

  /**
   * Check if any filters are active
   */
  const hasFilters = useMemo(
    (): boolean => hasActiveFilters(filters),
    [filters]
  )

  // ==========================================================================
  // Return
  // ==========================================================================

  return {
    // Filter values
    filters,

    // Anchor elements
    anchorEls,

    // Filter actions
    toggleFilter,
    setFilter,
    clearFilter,
    clearAllFilters,

    // Dropdown actions
    openDropdown,
    closeDropdown,
    isDropdownOpen,

    // Utilities
    getActiveCount,
    getTotalActiveCount,
    isFilterActive,
    hasFilters,
  }
}
