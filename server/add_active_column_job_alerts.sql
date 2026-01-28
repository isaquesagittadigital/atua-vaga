-- Add is_active column to job_alerts to allow enabling/disabling notifications
ALTER TABLE public.job_alerts
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false; -- Default false as per "Enable" flow
