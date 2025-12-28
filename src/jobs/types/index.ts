/**
 * Jobs Types Module
 *
 * This module exports all types related to jobs, including:
 * - Frontend models (Job, SearchResponse)
 * - Enum types (ExperienceLevel, WorkMode, etc.)
 * - Filter types (JobSearchFilters, JobSearchPagination)
 */

// Models
export type { Job, SearchResponse } from './models'

// Enums and their utilities
export type {
  EmploymentType,
  ExperienceLevel,
  JobFunction,
  Language,
  Location,
  Province,
  WorkMode,
} from './enums'
export {
  // Label mappings
  EMPLOYMENT_TYPE_LABELS,
  // Value arrays
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVEL_LABELS,
  EXPERIENCE_LEVELS,
  // Utility functions
  getEmploymentTypeLabel,
  getExperienceLevelLabel,
  getJobFunctionLabel,
  getLanguageLabel,
  getLocationLabel,
  getProvinceLabel,
  getWorkModeLabel,
  JOB_FUNCTION_LABELS,
  JOB_FUNCTIONS,
  LANGUAGE_LABELS,
  LANGUAGES,
  LOCATION_LABELS,
  LOCATIONS,
  PROVINCE_LABELS,
  PROVINCES,
  WORK_MODE_LABELS,
  WORK_MODES,
} from './enums'

// Models - also export PaginationInfo
export type { PaginationInfo } from './models'

// Filters and search parameters
export type {
  DatePreset,
  FilterKey,
  GetCompaniesRpcParams,
  JobSearchFilters,
  JobSearchPagination,
  JobSearchParams,
  MultiSelectFilterKey,
  SearchJobsRpcParams,
  SingleSelectFilterKey,
} from './filters'
export {
  // Utility functions
  calculateOffset,
  calculateTotalPages,
  clearFilters,
  countActiveFilters,
  countFilterSelections,
  // Constants
  DATE_PRESETS,
  // Conversion functions
  datePresetToRange,
  filtersToURLParams,
  getDefaultPagination,
  hasActiveFilters,
  hasMorePages,
  MULTI_SELECT_FILTER_KEYS,
  SINGLE_SELECT_FILTER_KEYS,
  toGetCompaniesRpcParams,
  toggleFilterValue,
  toSearchJobsRpcParams,
  urlParamsToFilters,
} from './filters'
