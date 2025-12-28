/**
 * FilterMenuContainer Component
 *
 * Container that renders the appropriate filter content based on filter type.
 * Uses filter configuration to determine content type and options.
 */

import type { CompanyOption } from '../../../hooks/useCompanyOptions'
import type { Language } from '../../../types/enums'
import type {
  DatePreset,
  FilterKey,
  MultiSelectFilterKey,
} from '../../../types/filters'
import { getFilterConfig } from '../filterConfig'
import {
  CheckboxFilterContent,
  DateFilterContent,
  LanguageFilterContent,
  SearchFilterContent,
} from './FilterContent'
import FilterMenu from './FilterMenu'

// =============================================================================
// Types
// =============================================================================

interface FilterMenuContainerProps {
  /** Filter key to render */
  filterKey: FilterKey
  /** Anchor element for the menu */
  anchorEl: HTMLElement | null
  /** Whether the menu is open */
  open: boolean
  /** Close handler */
  onClose: () => void
  /** Current filter values (for getting selected values) */
  filterValues: {
    datePreset?: DatePreset | undefined
    experienceLevel?: string[] | undefined
    employmentType?: string[] | undefined
    workMode?: string[] | undefined
    province?: string[] | undefined
    jobFunction?: string[] | undefined
    company?: string[] | undefined
    language?: Language | undefined
  }
  /** Toggle handler for multi-select filters */
  onToggleFilter: (key: MultiSelectFilterKey, value: string) => void
  /** Set handler for single-select filters */
  onSetFilter: (key: 'datePreset', value: DatePreset) => void
  /** Set handler for language filter */
  onSetLanguage: (value: Language) => void
  /** Company options (for dynamic company filter) */
  companyOptions?: CompanyOption[]
  /** Whether company options are loading */
  isLoadingCompanies?: boolean
}

// =============================================================================
// Component
// =============================================================================

/**
 * Filter menu container that renders appropriate content based on filter type
 */
export default function FilterMenuContainer({
  filterKey,
  anchorEl,
  open,
  onClose,
  filterValues,
  onToggleFilter,
  onSetFilter,
  onSetLanguage,
  companyOptions = [],
  isLoadingCompanies = false,
}: FilterMenuContainerProps) {
  const config = getFilterConfig(filterKey)

  if (!config) {
    return null
  }

  /**
   * Render the appropriate filter content based on filter key and type
   */
  const renderFilterContent = () => {
    switch (filterKey) {
      case 'datePreset':
        return (
          <DateFilterContent
            options={config.options ?? []}
            value={filterValues.datePreset ?? 'any'}
            onChange={value => onSetFilter('datePreset', value)}
          />
        )

      case 'language':
        return (
          <LanguageFilterContent
            options={config.options ?? []}
            value={filterValues.language}
            onChange={onSetLanguage}
          />
        )

      case 'company':
        return (
          <SearchFilterContent
            options={companyOptions}
            selectedValues={filterValues.company ?? []}
            onChange={value => onToggleFilter('company', value)}
            searchPlaceholder={config.searchPlaceholder}
            isLoading={isLoadingCompanies}
          />
        )

      case 'experienceLevel':
        return (
          <CheckboxFilterContent
            options={config.options ?? []}
            selectedValues={filterValues.experienceLevel ?? []}
            onChange={value => onToggleFilter('experienceLevel', value)}
          />
        )

      case 'workMode':
        return (
          <CheckboxFilterContent
            options={config.options ?? []}
            selectedValues={filterValues.workMode ?? []}
            onChange={value => onToggleFilter('workMode', value)}
          />
        )

      case 'employmentType':
        return (
          <CheckboxFilterContent
            options={config.options ?? []}
            selectedValues={filterValues.employmentType ?? []}
            onChange={value => onToggleFilter('employmentType', value)}
          />
        )

      case 'province':
        return (
          <CheckboxFilterContent
            options={config.options ?? []}
            selectedValues={filterValues.province ?? []}
            onChange={value => onToggleFilter('province', value)}
          />
        )

      case 'jobFunction':
        return (
          <CheckboxFilterContent
            options={config.options ?? []}
            selectedValues={filterValues.jobFunction ?? []}
            onChange={value => onToggleFilter('jobFunction', value)}
          />
        )

      default:
        return null
    }
  }

  return (
    <FilterMenu anchorEl={anchorEl} open={open} onClose={onClose}>
      {renderFilterContent()}
    </FilterMenu>
  )
}
