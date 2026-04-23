
-- Migration: Add match_score to job_applications
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS match_score INTEGER DEFAULT 0;
