-- Enable Read Access to Companies for All Users
-- This is necessary so that Candidates can see the Company Name and Logo on Job Cards.

-- 1. Enable RLS on the table (good practice to ensure it's on, though usually is)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it conflicts (or separate policies for owner vs public)
DROP POLICY IF EXISTS "Public companies are viewable by everyone" ON public.companies;
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON public.companies;
DROP POLICY IF EXISTS "Authenticated users can select companies" ON public.companies;

-- 3. Create a policy that allows EVERYONE (or just authenticated) to SELECT
-- We verify that the user is authenticated, or valid. 
-- For a job board, usually company names are public.
CREATE POLICY "Companies are viewable by everyone" 
ON public.companies FOR SELECT 
USING (true);

-- 4. Grant access to authenticated users (and anon if needed)
GRANT SELECT ON public.companies TO authenticated;
GRANT SELECT ON public.companies TO anon;
