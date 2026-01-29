-- ==============================================================================
-- Security Policies & RLS Configuration (Idempotent Version)
-- Run this script in the Supabase SQL Editor to secure your application.
-- ==============================================================================

-- 1. Enable RLS on valid tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_skills ENABLE ROW LEVEL SECURITY;
-- Add other tables as needed (e.g. behavioral_tests if user specific)

-- ==============================================================================
-- PROFILES POLICY
-- ==============================================================================

-- Drop existing policies to avoid conflict
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles" ON public.profiles;

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Allow public (or authenticated) to view basic profile info if needed
-- (Adjust this if you want profiles to be completely private until applied)
-- CREATE POLICY "Public profiles" ON public.profiles FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- TRIGGER: Prevent Role Escalation
-- Prevents a user from changing their own 'role' field via API
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is being changed
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    -- Allow if it's a super_admin making the change (optional check, requires recursive policy or dedicated admin function)
    -- For now, purely block self-update of role.
    RAISE EXCEPTION 'You cannot change your own role.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_role_change ON public.profiles;
CREATE TRIGGER check_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_role_change();

-- ==============================================================================
-- JOBS POLICY
-- ==============================================================================

DROP POLICY IF EXISTS "Public read jobs" ON public.jobs;
DROP POLICY IF EXISTS "Company members manage own jobs" ON public.jobs;

-- Allow everyone to read active jobs
CREATE POLICY "Public read jobs" ON public.jobs
FOR SELECT USING (status = 'active'); 
-- Or simply USING (true) if you show closed jobs too.

-- Allow Company Admins/Users to CRUD jobs for their company
-- Note: This assumes you have a `company_members` table linking users to companies.
CREATE POLICY "Company members manage own jobs" ON public.jobs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.company_members cm
    WHERE cm.user_id = auth.uid() 
    AND cm.company_id = jobs.company_id
  )
);

-- ==============================================================================
-- CANDIDATE DATA POLICIES (Education, Experience, Skills)
-- ==============================================================================

-- Education
DROP POLICY IF EXISTS "Users manage own education" ON public.academic_education;

CREATE POLICY "Users manage own education" ON public.academic_education
FOR ALL USING (user_id = auth.uid());

-- Experience
DROP POLICY IF EXISTS "Users manage own experience" ON public.professional_experience;

CREATE POLICY "Users manage own experience" ON public.professional_experience
FOR ALL USING (user_id = auth.uid());

-- Skills
DROP POLICY IF EXISTS "Users manage own skills" ON public.candidate_skills;

CREATE POLICY "Users manage own skills" ON public.candidate_skills
FOR ALL USING (user_id = auth.uid());

-- ==============================================================================
-- STORAGE POLICIES (If using Supabase Storage)
-- ==============================================================================
-- Ensure you have a bucket named 'resumes' or 'avatars'

-- Example for Avatars:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Policy: Anyone can view avatars
-- DROP POLICY IF EXISTS "Avatar Public View" ON storage.objects;
-- CREATE POLICY "Avatar Public View" ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );

-- Policy: Users can only upload/update their own avatar
-- DROP POLICY IF EXISTS "User Avatar Upload" ON storage.objects;
-- CREATE POLICY "User Avatar Upload" ON storage.objects FOR INSERT 
-- WITH CHECK ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );
