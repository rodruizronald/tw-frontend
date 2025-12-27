/**
 * Job-related enum types
 *
 * These types are derived from the auto-generated Supabase database types
 * and provide type-safe values for job filtering and display.
 */

import { Database } from '@/services/supabase/types/database'

// =============================================================================
// Type Aliases from Database Enums
// =============================================================================

/**
 * Employment type options for job postings
 * Represents the type of employment relationship offered
 */
export type EmploymentType = Database['public']['Enums']['employment_type_enum']

/**
 * Experience level options for job postings
 * Represents the seniority level required for a position
 */
export type ExperienceLevel =
  Database['public']['Enums']['experience_level_enum']

/**
 * Job function options for job postings
 * Represents the functional area or department of the job
 */
export type JobFunction = Database['public']['Enums']['job_function_enum']

/**
 * Language options for job postings
 * Represents the primary language used in the job
 */
export type Language = Database['public']['Enums']['language_enum']

/**
 * Location options for job postings
 * Represents the geographic region where the job is available
 */
export type Location = Database['public']['Enums']['location_enum']

/**
 * Province options for Costa Rican locations
 * Represents the provinces (administrative divisions) of Costa Rica
 */
export type Province = Database['public']['Enums']['province_enum']

/**
 * Work mode options for job postings
 * Represents the work arrangement (location-based)
 */
export type WorkMode = Database['public']['Enums']['work_mode_enum']

// =============================================================================
// Display Labels for UI
// =============================================================================

/**
 * Human-readable labels for employment types
 */
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contractor: 'Contractor',
  temporary: 'Temporary',
  internship: 'Internship',
}

/**
 * Human-readable labels for experience levels
 */
export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  'entry-level': 'Entry Level',
  'mid-level': 'Mid Level',
  senior: 'Senior',
  manager: 'Manager',
  director: 'Director',
  executive: 'Executive',
}

/**
 * Human-readable labels for job functions
 */
export const JOB_FUNCTION_LABELS: Record<JobFunction, string> = {
  'technology-engineering': 'Technology & Engineering',
  'sales-business-development': 'Sales & Business Development',
  'marketing-communications': 'Marketing & Communications',
  'operations-logistics': 'Operations & Logistics',
  'finance-accounting': 'Finance & Accounting',
  'human-resources': 'Human Resources',
  'customer-success-support': 'Customer Success & Support',
  'product-management': 'Product Management',
  'data-analytics': 'Data & Analytics',
  'healthcare-medical': 'Healthcare & Medical',
  'legal-compliance': 'Legal & Compliance',
  'design-creative': 'Design & Creative',
  'administrative-office': 'Administrative & Office',
  'consulting-strategy': 'Consulting & Strategy',
  'general-management': 'General Management',
  other: 'Other',
}

/**
 * Human-readable labels for languages
 */
export const LANGUAGE_LABELS: Record<Language, string> = {
  english: 'English',
  spanish: 'Spanish',
}

/**
 * Human-readable labels for locations
 */
export const LOCATION_LABELS: Record<Location, string> = {
  'costa-rica': 'Costa Rica',
  latam: 'Latin America',
}

/**
 * Human-readable labels for provinces
 */
export const PROVINCE_LABELS: Record<Province, string> = {
  'san-jose': 'San José',
  alajuela: 'Alajuela',
  heredia: 'Heredia',
  guanacaste: 'Guanacaste',
  puntarenas: 'Puntarenas',
  limon: 'Limón',
  cartago: 'Cartago',
}

/**
 * Human-readable labels for work modes
 */
export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
}

// =============================================================================
// Enum Value Arrays (for dropdowns, validation, etc.)
// =============================================================================

/**
 * All employment type values
 */
export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'full-time',
  'part-time',
  'contractor',
  'temporary',
  'internship',
]

/**
 * All experience level values
 */
export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'entry-level',
  'mid-level',
  'senior',
  'manager',
  'director',
  'executive',
]

/**
 * All job function values
 */
export const JOB_FUNCTIONS: JobFunction[] = [
  'technology-engineering',
  'sales-business-development',
  'marketing-communications',
  'operations-logistics',
  'finance-accounting',
  'human-resources',
  'customer-success-support',
  'product-management',
  'data-analytics',
  'healthcare-medical',
  'legal-compliance',
  'design-creative',
  'administrative-office',
  'consulting-strategy',
  'general-management',
  'other',
]

/**
 * All language values
 */
export const LANGUAGES: Language[] = ['english', 'spanish']

/**
 * All location values
 */
export const LOCATIONS: Location[] = ['costa-rica', 'latam']

/**
 * All province values
 */
export const PROVINCES: Province[] = [
  'san-jose',
  'alajuela',
  'heredia',
  'guanacaste',
  'puntarenas',
  'limon',
  'cartago',
]

/**
 * All work mode values
 */
export const WORK_MODES: WorkMode[] = ['remote', 'hybrid', 'onsite']

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get display label for an employment type
 */
export function getEmploymentTypeLabel(value: EmploymentType): string {
  return EMPLOYMENT_TYPE_LABELS[value]
}

/**
 * Get display label for an experience level
 */
export function getExperienceLevelLabel(value: ExperienceLevel): string {
  return EXPERIENCE_LEVEL_LABELS[value]
}

/**
 * Get display label for a job function
 */
export function getJobFunctionLabel(value: JobFunction): string {
  return JOB_FUNCTION_LABELS[value]
}

/**
 * Get display label for a language
 */
export function getLanguageLabel(value: Language): string {
  return LANGUAGE_LABELS[value]
}

/**
 * Get display label for a location
 */
export function getLocationLabel(value: Location): string {
  return LOCATION_LABELS[value]
}

/**
 * Get display label for a province
 */
export function getProvinceLabel(value: Province): string {
  return PROVINCE_LABELS[value]
}

/**
 * Get display label for a work mode
 */
export function getWorkModeLabel(value: WorkMode): string {
  return WORK_MODE_LABELS[value]
}
