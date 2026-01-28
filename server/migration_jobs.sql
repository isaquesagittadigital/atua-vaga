-- Create Job Types Enum
DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('remote', 'onsite', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Job Status Enum
DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[], -- Array of strings
    location TEXT,
    salary_min NUMERIC,
    salary_max NUMERIC,
    type job_type DEFAULT 'onsite',
    status job_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Policies

-- 1. Public Read (Anyone can see open jobs)
CREATE POLICY "Public can view open jobs" ON public.jobs
    FOR SELECT USING (status = 'open');

-- 2. Company Admin can CRUD their own jobs
-- This requires a complex check on company_members. 
-- For simplicity in this demo, we might allow any authenticated user to create (if they have a company)
-- OR strictly: check if auth.uid() is in company_members for the given company_id.

CREATE POLICY "Company members can manage their jobs" ON public.jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.company_members cm
            WHERE cm.company_id = jobs.company_id
            AND cm.user_id = auth.uid()
        )
    );
