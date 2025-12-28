/**
 * Frontend model types for the jobs feature
 */

import type {
  EmploymentType,
  ExperienceLevel,
  JobFunction,
  Language,
  Location,
  Province,
  WorkMode,
} from './enums'

// =============================================================================
// Search Response
// =============================================================================

/**
 * Pagination metadata for search results
 */
export interface PaginationInfo {
  /** Total number of matching jobs */
  total: number
  /** Number of jobs per page */
  limit: number
  /** Current offset (for pagination) */
  offset: number
  /** Whether there are more pages available */
  hasMore: boolean
}

/**
 * Complete search response with jobs and pagination
 */
export interface SearchResponse {
  jobs: Job[]
  pagination: PaginationInfo | null
}

// =============================================================================
// Job Model
// =============================================================================

/**
 * Frontend Job model
 *
 * This interface represents a job as used throughout the frontend.
 * Field names use camelCase and values are display-ready where possible.
 */
export interface Job {
  // Identifiers
  /** Unique job identifier */
  id: string
  /** Company identifier */
  companyId: string

  // Basic information
  /** Job title */
  title: string
  /** Company name */
  company: string
  /** URL to company logo (optional) */
  companyLogoUrl?: string

  // Job details
  /** Full job description */
  description: string
  /** List of job responsibilities */
  responsibilities: string[]
  /** List of benefits offered */
  benefits: string[]
  /** URL to apply for the job */
  applicationUrl: string

  // Classification (enum values)
  /** Experience level required */
  experience: ExperienceLevel
  /** Type of employment */
  jobType: EmploymentType
  /** Geographic location/region */
  location: Location
  /** Work arrangement */
  workMode: WorkMode
  /** Province (for Costa Rica jobs) */
  province: Province
  /** Job function/department */
  jobFunction: JobFunction
  /** Primary language of the job posting */
  language: Language
  /** City name */
  city: string

  // Skills and requirements
  /** Required and nice-to-have skills */
  requirements: {
    mustHave: string[]
    niceToHave: string[]
  }
  /** Main technologies used */
  technologies: string[]

  // Metadata
  /** Human-readable posted date (e.g., "2 days ago") */
  postedDate: string
}
