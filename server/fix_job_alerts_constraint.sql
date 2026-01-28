-- Add unique constraint to user_id to allow UPSERT operations
ALTER TABLE public.job_alerts
ADD CONSTRAINT job_alerts_user_id_key UNIQUE (user_id);
