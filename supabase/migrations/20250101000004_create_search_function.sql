-- Migration: Create Search Jobs Function
-- Description: Creates the stored procedure for searching jobs with filters

CREATE OR REPLACE FUNCTION search_jobs(
  search_query TEXT,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0,
  p_experience_level experience_level_enum DEFAULT NULL,
  p_employment_type employment_type_enum DEFAULT NULL,
  p_location location_enum DEFAULT NULL,
  p_work_mode work_mode_enum DEFAULT NULL,
  p_province province_enum DEFAULT NULL,
  p_job_function job_function_enum DEFAULT NULL,
  p_company TEXT DEFAULT NULL,
  p_date_from TIMESTAMP DEFAULT NULL,
  p_date_to TIMESTAMP DEFAULT NULL,
  p_language language_enum DEFAULT 'english'
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
    AND (p_experience_level IS NULL OR j.experience_level = p_experience_level)
    AND (p_employment_type IS NULL OR j.employment_type = p_employment_type)
    AND (p_location IS NULL OR j.location = p_location)
    AND (p_work_mode IS NULL OR j.work_mode = p_work_mode)
    AND (p_province IS NULL OR j.province = p_province)
    AND (p_job_function IS NULL OR j.job_function = p_job_function)
    AND (p_company IS NULL OR LOWER(c.name) = LOWER(p_company))
    AND (p_date_from IS NULL OR j.created_at >= p_date_from)
    AND (p_date_to IS NULL OR j.created_at <= p_date_to)
  ORDER BY j.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Add comment to function
COMMENT ON FUNCTION search_jobs IS 'Full-text search for jobs with filtering and pagination support';
