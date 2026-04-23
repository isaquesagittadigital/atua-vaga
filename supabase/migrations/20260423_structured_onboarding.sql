
-- Migration: Structured Onboarding Data for Companies

-- 1. Standardize existing data in 'industry' column
UPDATE public.companies 
SET industry = 'Outros' 
WHERE industry IS NOT NULL 
  AND industry NOT IN ('Tecnologia', 'Varejo / Comércio', 'Indústria', 'Serviços', 'Saúde', 'Educação', 'Construção Civil', 'Logística', 'Agronegócio', 'Outros');

-- 2. Standardize existing data in 'company_size' column
UPDATE public.companies 
SET company_size = '1-9' 
WHERE company_size IS NOT NULL 
  AND company_size NOT IN ('1-9', '10-49', '50-99', '100-499', '500+');

-- 3. Add CHECK constraints to 'industry'
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_industry_check;
ALTER TABLE public.companies 
ADD CONSTRAINT companies_industry_check 
CHECK (industry IN ('Tecnologia', 'Varejo / Comércio', 'Indústria', 'Serviços', 'Saúde', 'Educação', 'Construção Civil', 'Logística', 'Agronegócio', 'Outros'));

-- 4. Add CHECK constraints to 'company_size'
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS companies_size_check;
ALTER TABLE public.companies 
ADD CONSTRAINT companies_size_check 
CHECK (company_size IN ('1-9', '10-49', '50-99', '100-499', '500+'));

-- 5. Ensure onboarding_data is valid JSONB if not already (it is, but good to check)
-- No changes needed as it's already JSONB.
