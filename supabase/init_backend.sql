-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. MIGRATIONS & FIXES (Handle existing incompatible enums and policy dependencies)
DO $$
DECLARE
    pol_record RECORD;
BEGIN
    -- Fix jobs.status if it's tied to an old enum
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'jobs' AND column_name = 'status') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'status' AND udt_name = 'job_status') THEN
            -- Drop ALL policies on jobs to allow type change (Postgres requirement)
            FOR pol_record IN SELECT policyname FROM pg_policies WHERE tablename = 'jobs' AND schemaname = 'public' LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.jobs', pol_record.policyname);
            END LOOP;
            
            ALTER TABLE public.jobs ALTER COLUMN status TYPE TEXT USING status::text;
            -- Add check constraint if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE table_name = 'jobs' AND constraint_name = 'jobs_status_check') THEN
                ALTER TABLE public.jobs ADD CONSTRAINT jobs_status_check CHECK (status IN ('active', 'closed', 'draft'));
            END IF;
        END IF;
    END IF;

    -- Fix job_applications.status if it's tied to an old enum
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'job_applications' AND column_name = 'status') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'job_applications' AND column_name = 'status' AND udt_name = 'application_status') THEN
            FOR pol_record IN SELECT policyname FROM pg_policies WHERE tablename = 'job_applications' AND schemaname = 'public' LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.job_applications', pol_record.policyname);
            END LOOP;
            
            ALTER TABLE public.job_applications ALTER COLUMN status TYPE TEXT USING status::text;
            IF NOT EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE table_name = 'job_applications' AND constraint_name = 'applications_status_check') THEN
                ALTER TABLE public.job_applications ADD CONSTRAINT applications_status_check CHECK (status IN ('applied', 'reviewing', 'interviewing', 'rejected', 'hired'));
            END IF;
        END IF;
    END IF;
END $$;

-- 3. TABLES

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'candidate' CHECK (role IN ('candidate', 'company', 'company_admin', 'company_user', 'admin', 'super_admin')),
    cpf TEXT UNIQUE,
    phone TEXT,
    birth_date DATE,
    civil_status TEXT,
    bio TEXT,
    cep TEXT,
    city TEXT,
    state TEXT,
    neighborhood TEXT,
    street TEXT,
    number TEXT,
    cnh BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Companies Table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    document TEXT UNIQUE NOT NULL, -- CNPJ
    logo_url TEXT,
    website TEXT,
    industry TEXT,
    size TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Company Members (Links Users to Companies)
CREATE TABLE IF NOT EXISTS public.company_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('company_admin', 'company_user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(company_id, user_id)
);

-- Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    benefits TEXT[],
    location TEXT NOT NULL,
    type TEXT CHECK (type IN ('onsite', 'remote', 'hybrid')) NOT NULL,
    salary_min NUMERIC,
    salary_max NUMERIC,
    salary_range TEXT, -- For legacy compatibility
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Job Applications
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'reviewing', 'interviewing', 'rejected', 'hired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(job_id, user_id)
);

-- Behavioral Tests Table
CREATE TABLE IF NOT EXISTS public.behavioral_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'big_five',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Test Questions
CREATE TABLE IF NOT EXISTS public.test_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    test_id UUID REFERENCES public.behavioral_tests(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    category TEXT, -- e.g., 'N1', 'A1' for formula mapping
    "order" INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Candidate Test Results
CREATE TABLE IF NOT EXISTS public.candidate_test_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    test_id UUID REFERENCES public.behavioral_tests(id) ON DELETE CASCADE,
    responses JSONB, -- { "q_id": score }
    scores JSONB,    -- { "Trait": value }
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, test_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notification Settings
CREATE TABLE IF NOT EXISTS public.notification_settings (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    is_active BOOLEAN DEFAULT true,
    email_alerts BOOLEAN DEFAULT true,
    push_alerts BOOLEAN DEFAULT true,
    job_types TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Saved Jobs
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, job_id)
);

-- 4. RLS POLICIES & SECURITY

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles: Own view/edit
CREATE POLICY "Profiles are self-viewable" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles are self-editable" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Jobs: Public view active, Company manage own
CREATE POLICY "Jobs are public" ON public.jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Company manage jobs" ON public.jobs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.company_members WHERE company_id = jobs.company_id AND user_id = auth.uid())
);

-- Applications: User view own, Company view for their jobs
CREATE POLICY "Users view own applications" ON public.job_applications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users apply to jobs" ON public.job_applications FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Company view applications" ON public.job_applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.jobs j JOIN public.company_members cm ON j.company_id = cm.company_id WHERE j.id = job_id AND cm.user_id = auth.uid())
);

-- 5. TRIGGERS

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'candidate')
  );
  -- Also init notification settings
  INSERT INTO public.notification_settings (user_id, is_active) VALUES (NEW.id, true) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. INITIAL SEED (Optional Test Data)
INSERT INTO public.behavioral_tests (id, title, description, type)
VALUES ('00000000-0000-0000-0000-000000000001', 'Teste comportamental Big Five', 'Identifique seu perfil com base nos 5 grandes traços de personalidade.', 'big_five')
ON CONFLICT DO NOTHING;
