-- Migration to fix job_status and job_type enum conflicts
-- We convert columns to TEXT to avoid strict enum issues and use flexible CHECK constraints.

DO $$ 
DECLARE
    pol_record RECORD;
BEGIN 
    -- 1. Drop policies that depend on the jobs table (required to change column type)
    FOR pol_record IN SELECT policyname FROM pg_policies WHERE tablename = 'jobs' AND schemaname = 'public' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.jobs', pol_record.policyname);
    END LOOP;

    -- 2. Convert status column to TEXT
    ALTER TABLE public.jobs ALTER COLUMN status TYPE TEXT USING status::text;

    -- 2.5 Normalize status data
    UPDATE public.jobs 
    SET status = 'active' 
    WHERE status IS NULL OR status NOT IN ('active', 'closed', 'draft');

    -- 3. Add status CHECK constraint
    ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_status_check;
    ALTER TABLE public.jobs ADD CONSTRAINT jobs_status_check CHECK (status IN ('active', 'closed', 'draft'));

    -- 3.5 Convert type column to TEXT and fix enum issues
    -- This handles the "invalid input value for enum job_type: 'CLT'" error
    ALTER TABLE public.jobs ALTER COLUMN type TYPE TEXT USING type::text;

    -- 3.6 Normalize type data to include CLT/PJ/Freelance and onsite/remote/hybrid
    UPDATE public.jobs 
    SET type = 'onsite' 
    WHERE type IS NULL;

    -- 3.7 Add type CHECK constraint with expanded options
    ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_type_check;
    -- We allow both formats to be safe
    ALTER TABLE public.jobs ADD CONSTRAINT jobs_type_check 
    CHECK (type IN ('onsite', 'remote', 'hybrid', 'CLT', 'PJ', 'Freelance', 'Estágio', 'Trainee'));

    -- 4. Re-create policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Jobs are public' AND tablename = 'jobs') THEN
        CREATE POLICY "Jobs are public" ON public.jobs FOR SELECT USING (status = 'active');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Company manage jobs' AND tablename = 'jobs') THEN
        CREATE POLICY "Company manage jobs" ON public.jobs FOR ALL USING (
            EXISTS (SELECT 1 FROM public.company_members WHERE company_id = jobs.company_id AND user_id = auth.uid())
        );
    END IF;

    -- 5. Set defaults
    ALTER TABLE public.jobs ALTER COLUMN status SET DEFAULT 'active';
    ALTER TABLE public.jobs ALTER COLUMN type SET DEFAULT 'onsite';

END $$;
