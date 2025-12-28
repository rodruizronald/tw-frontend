/**
 * Job Transformers
 *
 * Transforms Supabase database types to frontend model types.
 * Handles the conversion from snake_case database fields to
 * camelCase frontend fields.
 */

import { logger } from '@/services/logging'

import type { Job, SearchResponse } from '../types/models'
import type { JobSearchResult } from './jobRepository'

// =============================================================================
// Single Job Transformation
// =============================================================================

/**
 * Transform a database job row to frontend Job format
 *
 * @param dbJob - Job row from the search_jobs RPC function
 * @returns Transformed Job object for frontend use
 */
export function transformJob(dbJob: JobSearchResult): Job {
  return {
    // Basic job information
    id: dbJob.id.toString(),
    title: dbJob.title,
    company: dbJob.company_name,
    companyId: dbJob.company_id.toString(),
    // Note: companyLogoUrl is omitted as it's not available in current schema

    // Job details
    description: dbJob.description,
    responsibilities: dbJob.responsibilities ?? [],
    benefits: dbJob.benefits ?? [],
    applicationUrl: dbJob.application_url,

    // Job classification
    experience: dbJob.experience_level,
    jobType: dbJob.employment_type,
    location: dbJob.location,
    workMode: dbJob.work_mode,
    province: dbJob.province,
    jobFunction: dbJob.job_function,
    language: dbJob.language,
    city: dbJob.city,

    // Requirements
    requirements: {
      mustHave: dbJob.skill_must_have ?? [],
      niceToHave: dbJob.skill_nice_have ?? [],
    },

    // Technologies
    technologies: dbJob.main_technologies ?? [],

    // Date information
    postedDate: formatRelativeDate(dbJob.created_at),
  }
}

// =============================================================================
// Batch Transformation
// =============================================================================

/**
 * Transform an array of database job rows to frontend Job format
 *
 * @param dbJobs - Array of job rows from the database
 * @returns Array of transformed Job objects
 */
export function transformJobs(dbJobs: JobSearchResult[]): Job[] {
  return dbJobs.map(transformJob)
}

// =============================================================================
// Search Response Transformation
// =============================================================================

/**
 * Parameters for building a search response
 */
export interface TransformSearchResponseParams {
  /** Raw job results from the database */
  jobs: JobSearchResult[]
  /** Total count of matching jobs */
  totalCount: number
  /** Current page number (1-indexed) */
  page: number
  /** Number of results per page */
  pageSize: number
}

/**
 * Transform search results to frontend SearchResponse format
 *
 * @param params - Search results and pagination info
 * @returns Complete SearchResponse for frontend use
 */
export function transformSearchResponse(
  params: TransformSearchResponseParams
): SearchResponse {
  const { jobs, totalCount, page, pageSize } = params
  const offset = (page - 1) * pageSize
  const hasMore = offset + jobs.length < totalCount

  return {
    jobs: transformJobs(jobs),
    pagination: {
      total: totalCount,
      limit: pageSize,
      offset,
      hasMore,
    },
  }
}

/**
 * Create an empty search response (for error cases or no results)
 *
 * @param page - Current page number
 * @param pageSize - Number of results per page
 * @returns Empty SearchResponse with zero results
 */
export function createEmptySearchResponse(
  page: number = 1,
  pageSize: number = 20
): SearchResponse {
  return {
    jobs: [],
    pagination: {
      total: 0,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      hasMore: false,
    },
  }
}

// =============================================================================
// Date Formatting
// =============================================================================

/**
 * Format a date string as a relative time (e.g., "2 days ago")
 *
 * @param dateString - ISO date string from the database
 * @returns Human-readable relative date string
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()

    // Handle negative differences (future dates)
    if (diffInMs < 0) {
      return 'just now'
    }

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    // Same day - show hours/minutes
    if (diffInDays === 0) {
      if (diffInMinutes <= 1) return '1 minute ago'
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
      if (diffInHours === 1) return '1 hour ago'
      return `${diffInHours} hours ago`
    }

    // Days
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`

    // Weeks
    if (diffInDays < 14) return '1 week ago'
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`

    // Months
    if (diffInDays < 60) return '1 month ago'
    return `${Math.floor(diffInDays / 30)} months ago`
  } catch (error) {
    logger.warn('Error parsing date', {
      component: 'transformer',
      action: 'formatRelativeDate',
      dateString,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return 'unknown'
  }
}

/**
 * Format a date string as an absolute date (e.g., "Jan 15, 2024")
 *
 * @param dateString - ISO date string from the database
 * @returns Formatted absolute date string
 */
export function formatAbsoluteDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    logger.warn('Error formatting date', {
      component: 'transformer',
      action: 'formatAbsoluteDate',
      dateString,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return 'unknown'
  }
}
