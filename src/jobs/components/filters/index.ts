/**
 * Filters Components Module
 *
 * Exports filter-related components for job search.
 */

// Main filters component
export { default as JobFilters } from './JobFilters'
export { default } from './JobFilters'

// Filter chip component
export { default as FilterChip } from './FilterChip/FilterChip'

// Filter configuration
export type {
  FilterConfigItem,
  FilterInputType,
  FilterOption,
} from './filterConfig'
export {
  DATE_PRESET_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  FILTER_CONFIG,
  getDatePresetLabel,
  getFilterConfig,
  getFilterLabel,
  getFilterOptions,
  getValueLabel,
  isDynamicFilter,
  isMultiSelectFilter,
  JOB_FUNCTION_OPTIONS,
  LANGUAGE_OPTIONS,
  PROVINCE_OPTIONS,
  WORK_MODE_OPTIONS,
} from './filterConfig'
