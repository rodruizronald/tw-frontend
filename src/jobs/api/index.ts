/**
 * Jobs API Module
 *
 * This module provides the API layer for job-related operations.
 *
 * Architecture:
 * - jobService: High-level orchestration (use this in components/hooks)
 * - jobRepository: Low-level Supabase access (use for custom queries)
 * - transformer: Data transformation utilities
 */

// =============================================================================
// Service (Primary API)
// =============================================================================

export type { JobDetailResponse, JobSearchResponse } from './jobService'
export { jobService, searchJobs } from './jobService'

// =============================================================================
// Repository (Low-level Access)
// =============================================================================

export type {
  CompanyRow,
  JobSearchRepositoryResult,
  JobSearchResult,
} from './jobRepository'
export {
  getCompanies,
  getCompanyByName,
  getJobById,
  getJobWithCompany,
  jobRepository,
  searchJobs as searchJobsFromDb,
} from './jobRepository'

// =============================================================================
// Transformers
// =============================================================================

export type { TransformSearchResponseParams } from './transformer'
export {
  createEmptySearchResponse,
  formatAbsoluteDate,
  formatRelativeDate,
  transformJob,
  transformJobs,
  transformSearchResponse,
} from './transformer'
