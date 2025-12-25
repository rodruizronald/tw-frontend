-- Migration: Enable Row Level Security (RLS)
-- Description: Enables RLS on all tables and creates appropriate access policies
-- 
-- Security Model:
-- - Public read access for jobs, companies, and technologies (public job board)
-- - Write access restricted to service_role (server-side only)
-- - This protects against unauthorized modifications via the public API

-- ============================================
-- Enable RLS on All Tables
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE technology_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_technologies ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Companies Policies
-- ============================================

-- Anyone can view active companies
CREATE POLICY "Public read access for active companies"
  ON companies
  FOR SELECT
  USING (is_active = true);

-- ============================================
-- Jobs Policies
-- ============================================

-- Anyone can view active jobs
CREATE POLICY "Public read access for active jobs"
  ON jobs
  FOR SELECT
  USING (is_active = true);

-- ============================================
-- Technologies Policies
-- ============================================

-- Anyone can view technologies (for filters, search, etc.)
CREATE POLICY "Public read access for technologies"
  ON technologies
  FOR SELECT
  USING (true);

-- ============================================
-- Technology Aliases Policies
-- ============================================

-- Anyone can view technology aliases
CREATE POLICY "Public read access for technology aliases"
  ON technology_aliases
  FOR SELECT
  USING (true);

-- ============================================
-- Job Technologies Policies
-- ============================================

-- Anyone can view job-technology relationships
CREATE POLICY "Public read access for job technologies"
  ON job_technologies
  FOR SELECT
  USING (true);

-- ============================================
-- Notes on Write Access
-- ============================================
-- 
-- No INSERT, UPDATE, or DELETE policies are created.
-- This means write operations can ONLY be performed using:
--   1. service_role key (bypasses RLS)
--   2. Database functions with SECURITY DEFINER
--   3. Direct database connection
--
-- This is intentional for a job board where:
--   - Job data is ingested via backend/scraper (uses service_role)
--   - Frontend only needs read access
--
-- If you need authenticated users to write data, add policies like:
--
-- CREATE POLICY "Authenticated users can insert"
--   ON table_name
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (true);
