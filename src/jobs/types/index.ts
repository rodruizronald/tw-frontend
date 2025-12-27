/**
 * Jobs Types Module
 *
 * This module exports all types related to jobs, including:
 * - Frontend models (Job, SearchResponse)
 * - API types (ApiJob, ApiSearchResponse)
 * - Enum types (ExperienceLevel, WorkMode, etc.)
 * - Filter types (JobSearchFilters, FilterState)
 * - Pagination types
 */

// Models
export type { Job, SearchResponse } from './models'

// API types
export type {
  ApiJob,
  ApiParams,
  ApiRequirements,
  ApiSearchResponse,
  ApiTechnology,
  DateRange,
  SearchParams,
} from './api'

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

// Filters and search parameters
export type {
  ActiveFilterKey,
  FilterState,
  JobSearchFilters,
  JobSearchPagination,
  JobSearchParams,
  SearchJobsRpcParams,
} from './filters'
export {
  calculateOffset,
  calculateTotalPages,
  clearFilters,
  countActiveFilters,
  getDefaultPagination,
  hasActiveFilters,
  hasMorePages,
  toSearchJobsRpcParams,
} from './filters'

// Pagination
export type { PaginationParams } from './pagination'
