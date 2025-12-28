-- Migration: Create Search Jobs Function
-- Description: Creates the stored procedure for searching jobs with filters
-- Updated: Support multi-select filters using arrays

-- Drop existing function if exists (to handle parameter changes)
DROP FUNCTION IF EXISTS search_jobs;

CREATE OR REPLACE FUNCTION search_jobs(
  search_query TEXT,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0,
  p_experience_level experience_level_enum[] DEFAULT NULL,  -- Array for multi-select
  p_employment_type employment_type_enum[] DEFAULT NULL,    -- Array for multi-select
  p_work_mode work_mode_enum[] DEFAULT NULL,                -- Array for multi-select
  p_province province_enum[] DEFAULT NULL,                  -- Array for multi-select
  p_job_function job_function_enum[] DEFAULT NULL,          -- Array for multi-select
  p_company TEXT[] DEFAULT NULL,                            -- Array for multi-select
  p_date_from TIMESTAMP DEFAULT NULL,
  p_date_to TIMESTAMP DEFAULT NULL,
  p_language language_enum DEFAULT 'english'                -- Single value (radio button)
)
RETURNS TABLE (
  id INT,
  company_id INT,
  title VARCHAR,
  description TEXT,
  responsibilities TEXT[],
  skill_must_have TEXT[],
  skill_nice_have TEXT[],
  main_technologies TEXT[],
  benefits TEXT[],
  experience_level experience_level_enum,
  employment_type employment_type_enum,
  location location_enum,
  city VARCHAR,
  province province_enum,
  work_mode work_mode_enum,
  job_function job_function_enum,
  language language_enum,
  application_url VARCHAR,
  is_active BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  company_name VARCHAR,
  total_count BIGINT
)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH search_query_cte AS (
    SELECT plainto_tsquery(p_language::text::regconfig, search_query) AS query
  )
  SELECT 
    j.id,
    j.company_id,
    j.title,
    j.description,
    j.responsibilities,
    j.skill_must_have,
    j.skill_nice_have,
    j.main_technologies,
    j.benefits,
    j.experience_level,
    j.employment_type,
    j.location,
    j.city,
    j.province,
    j.work_mode,
    j.job_function,
    j.language,
    j.application_url,
    j.is_active,
    j.created_at,
    j.updated_at,
    c.name AS company_name,
    COUNT(*) OVER() AS total_count
  FROM jobs j
  JOIN companies c ON j.company_id = c.id
  CROSS JOIN search_query_cte sq
  WHERE 
    j.is_active = true 
    AND j.search_vector @@ sq.query
    AND j.language = p_language
    -- Array filters: NULL or empty array means no filter, otherwise use ANY()
    AND (p_experience_level IS NULL OR array_length(p_experience_level, 1) IS NULL OR j.experience_level = ANY(p_experience_level))
    AND (p_employment_type IS NULL OR array_length(p_employment_type, 1) IS NULL OR j.employment_type = ANY(p_employment_type))
    AND (p_work_mode IS NULL OR array_length(p_work_mode, 1) IS NULL OR j.work_mode = ANY(p_work_mode))
    AND (p_province IS NULL OR array_length(p_province, 1) IS NULL OR j.province = ANY(p_province))
    AND (p_job_function IS NULL OR array_length(p_job_function, 1) IS NULL OR j.job_function = ANY(p_job_function))
    AND (p_company IS NULL OR array_length(p_company, 1) IS NULL OR c.name = ANY(p_company))
    -- Date filters
    AND (p_date_from IS NULL OR j.created_at >= p_date_from)
    AND (p_date_to IS NULL OR j.created_at <= p_date_to)
  ORDER BY j.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Add comment to function
COMMENT ON FUNCTION search_jobs IS 'Full-text search for jobs with multi-select filtering and pagination support';

-- =============================================================================
-- Function: Get Companies for Search
-- Description: Returns distinct company names that have jobs matching a search query
--              and all currently applied filters (except company filter itself)
-- Used to populate the company filter dropdown after a search is performed
-- =============================================================================

DROP FUNCTION IF EXISTS get_companies_for_search;

CREATE OR REPLACE FUNCTION get_companies_for_search(
  search_query TEXT,
  p_limit INT DEFAULT 100,
  p_experience_level experience_level_enum[] DEFAULT NULL,  -- Same filters as search_jobs
  p_employment_type employment_type_enum[] DEFAULT NULL,
  p_work_mode work_mode_enum[] DEFAULT NULL,
  p_province province_enum[] DEFAULT NULL,
  p_job_function job_function_enum[] DEFAULT NULL,
  p_date_from TIMESTAMP DEFAULT NULL,
  p_date_to TIMESTAMP DEFAULT NULL,
  p_language language_enum DEFAULT 'english'
)
RETURNS TABLE (
  company_name VARCHAR,
  job_count BIGINT
)
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH search_query_cte AS (
    SELECT plainto_tsquery(p_language::text::regconfig, search_query) AS query
  )
  SELECT 
    c.name AS company_name,
    COUNT(j.id) AS job_count
  FROM jobs j
  JOIN companies c ON j.company_id = c.id
  CROSS JOIN search_query_cte sq
  WHERE 
    j.is_active = true 
    AND c.is_active = true
    AND j.search_vector @@ sq.query
    AND j.language = p_language
    -- Apply same filters as search_jobs (except p_company)
    AND (p_experience_level IS NULL OR array_length(p_experience_level, 1) IS NULL OR j.experience_level = ANY(p_experience_level))
    AND (p_employment_type IS NULL OR array_length(p_employment_type, 1) IS NULL OR j.employment_type = ANY(p_employment_type))
    AND (p_work_mode IS NULL OR array_length(p_work_mode, 1) IS NULL OR j.work_mode = ANY(p_work_mode))
    AND (p_province IS NULL OR array_length(p_province, 1) IS NULL OR j.province = ANY(p_province))
    AND (p_job_function IS NULL OR array_length(p_job_function, 1) IS NULL OR j.job_function = ANY(p_job_function))
    AND (p_date_from IS NULL OR j.created_at >= p_date_from)
    AND (p_date_to IS NULL OR j.created_at <= p_date_to)
  GROUP BY c.name
  ORDER BY job_count DESC, c.name ASC
  LIMIT p_limit;
END;
$$;

-- Add comment to function
COMMENT ON FUNCTION get_companies_for_search IS 'Returns distinct company names with job counts for a given search query and applied filters';
