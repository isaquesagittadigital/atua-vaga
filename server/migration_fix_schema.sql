-- Fix specific columns for Profiles table
-- Use this if your 'profiles' table already existed but was missing new columns

-- 1. Ensure the user_role type exists
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('candidate', 'company_admin', 'company_user', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add 'full_name' column if missing
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- 3. Add 'role' column if missing
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN role user_role DEFAULT 'candidate';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- 4. Add 'email' column if missing
DO $$ BEGIN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- 5. Ensure Companies table exists (Create if not exists was in previous script, but good to double check)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    document TEXT UNIQUE, -- CNPJ
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Ensure Company Members table exists
CREATE TABLE IF NOT EXISTS public.company_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role DEFAULT 'company_user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- 7. Grant permissions (just in case)
GRANT ALL ON public.profiles TO postgres, service_role;
GRANT ALL ON public.companies TO postgres, service_role;
GRANT ALL ON public.company_members TO postgres, service_role;
