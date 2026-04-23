
-- Ensure salary_range column exists in jobs table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'salary_range') THEN
        ALTER TABLE public.jobs ADD COLUMN salary_range TEXT;
    END IF;
END $$;
