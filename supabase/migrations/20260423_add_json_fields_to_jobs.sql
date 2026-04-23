
-- Migration: Add JSON and numeric fields to jobs table
-- These fields are used for screening questions, requirements, and salary filtering.

ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS requirements_json JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS screening_questions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS salary_min NUMERIC,
ADD COLUMN IF NOT EXISTS salary_max NUMERIC;

-- Refresh PostgREST cache (Supabase handles this automatically on migration, 
-- but we ensure the columns are available)
NOTIFY pgrst, 'reload schema';
