/**
 * JobFilters Component
 *
 * Renders all filter dropdown menus based on filter configuration.
 * This component is responsible for rendering FilterMenuContainer
 * for each filter type.
 */

import type { CompanyOption } from '../../hooks/useCompanyOptions'
import type { Language } from '../../types/enums'
import type {
  DatePreset,
  FilterKey,
  JobSearchFilters,
  MultiSelectFilterKey,
} from '../../types/filters'
import { FILTER_CONFIG } from './filterConfig'
import FilterMenuContainer from './FilterMenuContainer'

// =============================================================================
// Types
// =============================================================================

interface JobFiltersProps {
  /** Current filter values */
  filters: Partial<JobSearchFilters>
  /** Anchor elements for each filter dropdown */
  anchorEls: Record<FilterKey, HTMLElement | null>
  /** Close handler for dropdowns */
  onCloseDropdown: (key: FilterKey) => void
  /** Toggle handler for multi-select filters */
  onToggleFilter: (key: MultiSelectFilterKey, value: string) => void
  /** Set handler for date preset filter */
  onSetDatePreset: (key: 'datePreset', value: DatePreset) => void
  /** Set handler for language filter */
  onSetLanguage: (value: Language) => void
  /** Company options for the company filter */
  companyOptions?: CompanyOption[] | undefined
  /** Whether company options are loading */
  isLoadingCompanies?: boolean | undefined
}

// =============================================================================
// Component
// =============================================================================

/**
 * Job filters component that renders all filter dropdown menus
 *
 * @example
 * ```tsx
 * <JobFilters
 *   filters={filters}
 *   anchorEls={anchorEls}
 *   onCloseDropdown={closeDropdown}
 *   onToggleFilter={toggleFilter}
 *   onSetDatePreset={(value) => setFilter('datePreset', value)}
 *   onSetLanguage={(value) => setFilter('language', value)}
 *   companyOptions={companies}
 *   isLoadingCompanies={isLoadingCompanies}
 * />
 * ```
 */
export default function JobFilters({
  filters,
  anchorEls,
  onCloseDropdown,
  onToggleFilter,
  onSetDatePreset,
  onSetLanguage,
  companyOptions = [],
  isLoadingCompanies = false,
}: JobFiltersProps) {
  return (
    <>
      {FILTER_CONFIG.map(config => (
        <FilterMenuContainer
          key={config.key}
          filterKey={config.key}
          anchorEl={anchorEls[config.key]}
          open={Boolean(anchorEls[config.key])}
          onClose={() => onCloseDropdown(config.key)}
          filterValues={{
            datePreset: filters.datePreset,
            experienceLevel: filters.experienceLevel,
            employmentType: filters.employmentType,
            workMode: filters.workMode,
            province: filters.province,
            jobFunction: filters.jobFunction,
            company: filters.company,
            language: filters.language,
          }}
          onToggleFilter={onToggleFilter}
          onSetFilter={onSetDatePreset}
          onSetLanguage={onSetLanguage}
          companyOptions={companyOptions}
          isLoadingCompanies={isLoadingCompanies}
        />
      ))}
    </>
  )
}
