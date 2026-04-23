
-- Migration: Add JSON and numeric fields to jobs table
-- These fields are used for screening questions, requirements, and salary filtering.

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS requirements_json JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS screening_questions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS salary_min NUMERIC,
ADD COLUMN IF NOT EXISTS salary_max NUMERIC;

-- Also ensure match_score exists in job_applications
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS match_score INTEGER DEFAULT 0;

-- Refresh PostgREST cache
NOTIFY pgrst, 'reload schema';
