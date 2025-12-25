-- Migration: Create ENUM Types
-- Description: Creates all enumeration types used across the job board application

-- Job function enumeration for job postings
-- Represents the functional area or department of the job
CREATE TYPE job_function_enum AS ENUM (
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
    'other'
);

-- Province enumeration for Costa Rican locations
-- Represents the provinces (administrative divisions) of Costa Rica
CREATE TYPE province_enum AS ENUM (
    'san-jose',
    'alajuela',
    'heredia',
    'guanacaste',
    'puntarenas',
    'limon',
    'cartago'
);

-- Experience level enumeration for job postings
-- Represents the seniority level required for a position
CREATE TYPE experience_level_enum AS ENUM (
    'entry-level',
    'mid-level',
    'senior',
    'manager',
    'director',
    'executive'
);

-- Employment type enumeration for job postings
-- Represents the type of employment relationship offered
CREATE TYPE employment_type_enum AS ENUM (
    'full-time',
    'part-time',
    'contractor',
    'temporary',
    'internship'
);

-- Work mode enumeration for job postings
-- Represents the work arrangement (location-based)
CREATE TYPE work_mode_enum AS ENUM (
    'remote',
    'hybrid',
    'onsite'
);

-- Location enumeration for job postings
-- Represents the geographic region where the job is available
CREATE TYPE location_enum AS ENUM (
    'costa-rica',
    'latam'
);

-- Language enumeration for job postings
-- Represents the language required to do the work 
CREATE TYPE language_enum AS ENUM ('english', 'spanish');
