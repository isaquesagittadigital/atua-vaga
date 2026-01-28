-- Link ALL existing jobs to Random Companies
-- This script updates every job record to have a valid, randomly selected company_id from the companies table.

DO $$
DECLARE
    v_job RECORD;
    v_company_id UUID;
BEGIN
    -- Raise notice to show progress
    RAISE NOTICE 'Starting redistribution of jobs to companies...';

    -- Loop through all jobs
    FOR v_job IN SELECT id FROM public.jobs LOOP
        
        -- Select a random company ID
        SELECT id INTO v_company_id
        FROM public.companies
        ORDER BY random()
        LIMIT 1;

        -- Update the job with this company ID
        IF v_company_id IS NOT NULL THEN
            UPDATE public.jobs
            SET company_id = v_company_id
            WHERE id = v_job.id;
        END IF;
        
    END LOOP;

    RAISE NOTICE 'All jobs have been linked to random companies.';
END $$;
