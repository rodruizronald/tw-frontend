/**
 * Filter Configuration
 *
 * Centralized configuration for all job search filters.
 * Defines filter metadata, types, and options in one place.
 */

import {
  EMPLOYMENT_TYPE_LABELS,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVEL_LABELS,
  EXPERIENCE_LEVELS,
  JOB_FUNCTION_LABELS,
  JOB_FUNCTIONS,
  LANGUAGE_LABELS,
  LANGUAGES,
  PROVINCE_LABELS,
  PROVINCES,
  WORK_MODE_LABELS,
  WORK_MODES,
} from '../../types/enums'
import type { DatePreset, FilterKey } from '../../types/filters'
import { DATE_PRESETS } from '../../types/filters'

// =============================================================================
// Types
// =============================================================================

/**
 * Filter input types
 */
export type FilterInputType = 'checkbox' | 'checkbox-search' | 'radio'

/**
 * Option with value and label
 */
export interface FilterOption {
  value: string
  label: string
}

/**
 * Filter configuration item
 */
export interface FilterConfigItem {
  /** Unique filter key */
  key: FilterKey
  /** Display label for the filter chip */
  label: string
  /** Type of input control */
  type: FilterInputType
  /** Static options (for non-dynamic filters) */
  options?: FilterOption[]
  /** Whether options are loaded dynamically */
  dynamic?: boolean
  /** Placeholder text for search input */
  searchPlaceholder?: string
}

// =============================================================================
// Filter Options
// =============================================================================

/**
 * Date preset options for radio buttons
 */
export const DATE_PRESET_OPTIONS: FilterOption[] = DATE_PRESETS.map(preset => ({
  value: preset.value,
  label: preset.label,
}))

/**
 * Experience level options
 */
export const EXPERIENCE_LEVEL_OPTIONS: FilterOption[] = EXPERIENCE_LEVELS.map(
  level => ({
    value: level,
    label: EXPERIENCE_LEVEL_LABELS[level],
  })
)

/**
 * Work mode options
 */
export const WORK_MODE_OPTIONS: FilterOption[] = WORK_MODES.map(mode => ({
  value: mode,
  label: WORK_MODE_LABELS[mode],
}))

/**
 * Employment type options
 */
export const EMPLOYMENT_TYPE_OPTIONS: FilterOption[] = EMPLOYMENT_TYPES.map(
  type => ({
    value: type,
    label: EMPLOYMENT_TYPE_LABELS[type],
  })
)

/**
 * Province options
 */
export const PROVINCE_OPTIONS: FilterOption[] = PROVINCES.map(province => ({
  value: province,
  label: PROVINCE_LABELS[province],
}))

/**
 * Job function options
 */
export const JOB_FUNCTION_OPTIONS: FilterOption[] = JOB_FUNCTIONS.map(func => ({
  value: func,
  label: JOB_FUNCTION_LABELS[func],
}))

/**
 * Language options
 */
export const LANGUAGE_OPTIONS: FilterOption[] = LANGUAGES.map(lang => ({
  value: lang,
  label: LANGUAGE_LABELS[lang],
}))

// =============================================================================
// Filter Configuration
// =============================================================================

/**
 * Complete filter configuration array
 *
 * Order determines display order in the UI
 */
export const FILTER_CONFIG: FilterConfigItem[] = [
  {
    key: 'datePreset',
    label: 'Date',
    type: 'radio',
    options: DATE_PRESET_OPTIONS,
  },
  {
    key: 'company',
    label: 'Company',
    type: 'checkbox-search',
    dynamic: true,
    searchPlaceholder: 'Search companies...',
  },
  {
    key: 'experienceLevel',
    label: 'Experience',
    type: 'checkbox',
    options: EXPERIENCE_LEVEL_OPTIONS,
  },
  {
    key: 'workMode',
    label: 'Mode',
    type: 'checkbox',
    options: WORK_MODE_OPTIONS,
  },
  {
    key: 'employmentType',
    label: 'Type',
    type: 'checkbox',
    options: EMPLOYMENT_TYPE_OPTIONS,
  },
  {
    key: 'province',
    label: 'Province',
    type: 'checkbox',
    options: PROVINCE_OPTIONS,
  },
  {
    key: 'jobFunction',
    label: 'Function',
    type: 'checkbox',
    options: JOB_FUNCTION_OPTIONS,
  },
  {
    key: 'language',
    label: 'Language',
    type: 'radio',
    options: LANGUAGE_OPTIONS,
  },
]

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get filter configuration by key
 */
export function getFilterConfig(key: FilterKey): FilterConfigItem | undefined {
  return FILTER_CONFIG.find(config => config.key === key)
}

/**
 * Get filter label by key
 */
export function getFilterLabel(key: FilterKey): string {
  const config = getFilterConfig(key)
  return config?.label ?? key
}

/**
 * Get filter options by key
 */
export function getFilterOptions(key: FilterKey): FilterOption[] {
  const config = getFilterConfig(key)
  return config?.options ?? []
}

/**
 * Check if filter is multi-select (checkbox type)
 */
export function isMultiSelectFilter(key: FilterKey): boolean {
  const config = getFilterConfig(key)
  return config?.type === 'checkbox' || config?.type === 'checkbox-search'
}

/**
 * Check if filter has dynamic options
 */
export function isDynamicFilter(key: FilterKey): boolean {
  const config = getFilterConfig(key)
  return config?.dynamic === true
}

/**
 * Get label for a filter value
 */
export function getValueLabel(key: FilterKey, value: string): string {
  const config = getFilterConfig(key)
  if (!config?.options) return value

  const option = config.options.find(opt => opt.value === value)
  return option?.label ?? value
}

/**
 * Convert DatePreset to display label
 */
export function getDatePresetLabel(preset: DatePreset): string {
  const option = DATE_PRESET_OPTIONS.find(opt => opt.value === preset)
  return option?.label ?? preset
}
