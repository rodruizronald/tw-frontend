-- Migration: Create Jobs Table with Trigger and Function
-- Description: Creates the jobs table, search vector update function, and trigger

-- Jobs Table
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT[],
    skill_must_have TEXT[],
    skill_nice_have TEXT[],
    main_technologies TEXT[],
    benefits TEXT[],
    experience_level experience_level_enum NOT NULL,
    employment_type employment_type_enum NOT NULL,
    location location_enum NOT NULL,
    city VARCHAR(50) NOT NULL,
    province province_enum NOT NULL,
    work_mode work_mode_enum NOT NULL,
    job_function job_function_enum NOT NULL,
    language language_enum NOT NULL DEFAULT 'english',
    application_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    signature VARCHAR(64) UNIQUE,
    search_vector tsvector, -- Regular column for full-text search
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE jobs IS 'Stores job postings with full-text search capabilities';

-- Function to update search_vector
-- This function is called by a trigger to maintain the search vector
CREATE OR REPLACE FUNCTION update_jobs_search_vector()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    lang regconfig;
BEGIN
    lang := coalesce(NEW.language::text, 'english')::regconfig;
    
    NEW.search_vector := 
        setweight(to_tsvector(lang, coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector(lang, coalesce(array_to_string(NEW.skill_must_have, ' '), '')), 'B') ||
        setweight(to_tsvector(lang, coalesce(array_to_string(NEW.skill_nice_have, ' '), '')), 'C');
    RETURN NEW;
END;
$$;

-- Trigger to maintain search_vector on INSERT and UPDATE
CREATE TRIGGER update_jobs_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description, skill_must_have, skill_nice_have
ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_jobs_search_vector();
