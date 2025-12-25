-- Migration: Create Indexes
-- Description: Creates all indexes for optimizing query performance

-- ============================================
-- Companies Indexes
-- ============================================
CREATE UNIQUE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_active ON companies(id) WHERE is_active = TRUE;

-- ============================================
-- Jobs Indexes
-- ============================================

-- GIN index on the search_vector column to speed up full-text search queries
-- GIN (Generalized Inverted Index) is optimized for full-text search
CREATE INDEX idx_jobs_search_vector ON jobs USING GIN (search_vector);

-- Partial indexes for active jobs filtering
CREATE INDEX idx_jobs_city ON jobs(city) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_location ON jobs(location) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_province ON jobs(province) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_active ON jobs(id) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_language ON jobs(language) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_work_mode ON jobs(work_mode) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_job_function ON jobs(job_function) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type) WHERE is_active = TRUE;
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level) WHERE is_active = TRUE;

-- Standard indexes for foreign keys and sorting
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);

-- ============================================
-- Technologies Indexes
-- ============================================
CREATE UNIQUE INDEX idx_technologies_name_lower ON technologies(LOWER(name));
CREATE INDEX idx_technologies_parent_id ON technologies(parent_id);

-- ============================================
-- Technology Aliases Indexes
-- ============================================
CREATE INDEX idx_technology_aliases_technology_id ON technology_aliases(technology_id);
CREATE INDEX idx_technology_aliases_alias_lower ON technology_aliases(LOWER(alias));

-- ============================================
-- Job Technologies Indexes
-- ============================================
CREATE INDEX idx_job_technologies_job_id ON job_technologies(job_id);
CREATE INDEX idx_job_technologies_technology_id ON job_technologies(technology_id);
