-- 1. Create Job Alerts Table
CREATE TABLE IF NOT EXISTS public.job_alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    work_models TEXT[], -- 'remote', 'hybrid', 'onsite'
    max_distance INTEGER, -- km (nullable, requires geolocation logic later)
    min_salary NUMERIC,
    function_areas TEXT[],
    contract_types TEXT[], -- 'CLT', 'PJ', etc
    is_pcd BOOLEAN DEFAULT false,
    pcd_types TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own alerts" ON public.job_alerts
    FOR ALL USING (auth.uid() = user_id);

-- 2. Create Notification Trigger Function
CREATE OR REPLACE FUNCTION public.match_new_job_to_alerts()
RETURNS TRIGGER AS $$
DECLARE
    alert RECORD;
    match_found BOOLEAN;
BEGIN
    -- Loop through all alerts
    FOR alert IN SELECT * FROM public.job_alerts LOOP
        match_found := TRUE;

        -- Check Function Area (If alert has specific areas)
        IF alert.function_areas IS NOT NULL AND array_length(alert.function_areas, 1) > 0 THEN
            IF NOT (NEW.function_area = ANY(alert.function_areas)) THEN
                match_found := FALSE;
            END IF;
        END IF;

        -- Check Salary (If alert has min salary)
        IF match_found AND alert.min_salary IS NOT NULL AND alert.min_salary > 0 THEN
            -- Check if job max salary is at least the alert min, or if job min is >= alert min
            -- Simplification: If job pays at least X (using max as potential)
            IF (NEW.salary_max IS NULL OR NEW.salary_max < alert.min_salary) THEN 
                 match_found := FALSE;
            END IF;
        END IF;

        -- Check Contract Type
        IF match_found AND alert.contract_types IS NOT NULL AND array_length(alert.contract_types, 1) > 0 THEN
            IF NOT (NEW.contract_type = ANY(alert.contract_types)) THEN
                match_found := FALSE;
            END IF;
        END IF;

        -- Check Work Model (remote, hybrid, onsite) - Cast NEW.type (enum) to text
        IF match_found AND alert.work_models IS NOT NULL AND array_length(alert.work_models, 1) > 0 THEN
            IF NOT (NEW.type::text = ANY(alert.work_models)) THEN
                match_found := FALSE;
            END IF;
        END IF;

        -- Check PCD
        IF match_found AND alert.is_pcd IS TRUE THEN
            IF NEW.is_pcd IS NOT TRUE THEN
                match_found := FALSE;
            END IF;
        END IF;

        -- If all checks pass, create notification
        IF match_found THEN
            INSERT INTO public.notifications (user_id, title, message, type, link)
            VALUES (
                alert.user_id,
                'Nova vaga encontrada: ' || NEW.title,
                'Uma nova vaga de ' || NEW.title || ' compatível com seus alertas foi publicada.',
                'success',
                '/jobs/' || NEW.id
            );
        END IF;

    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Trigger
DROP TRIGGER IF EXISTS on_job_created_check_alerts ON public.jobs;

CREATE TRIGGER on_job_created_check_alerts
    AFTER INSERT ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.match_new_job_to_alerts();
