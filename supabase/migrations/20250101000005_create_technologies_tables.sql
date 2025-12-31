-- Migration: Create Technologies Tables
-- Description: Creates tables for managing technologies, aliases, and job-technology relationships

-- Technologies Table (canonical names)
CREATE TABLE technologies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent_id INT REFERENCES technologies(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE technologies IS 'Canonical technology names with optional parent-child relationships';

-- Technology Aliases Table
CREATE TABLE technology_aliases (
    id SERIAL PRIMARY KEY,
    technology_id INT NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
    alias VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE technology_aliases IS 'Alternative names/aliases for technologies';

-- Job Technologies Junction Table
CREATE TABLE job_technologies (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    technology_id INT REFERENCES technologies(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(job_id, technology_id)
);

-- Add comment to table
COMMENT ON TABLE job_technologies IS 'Many-to-many relationship between jobs and technologies';
