-- Add missing columns to companies table to support rich profile data
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Add index on owner_id for performance
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);
