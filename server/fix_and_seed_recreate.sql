-- NUCLEAR FIX: DROP AND RECREATE JOBS TABLE
-- This is necessary because the existing table has a wrong Foreign Key pointing to 'profiles' instead of 'companies'.

-- 1. DROP Existing table to clear bad constraints
DROP TABLE IF EXISTS public.jobs CASCADE;

-- 2. Ensure Types exist
DO $$ BEGIN
    CREATE TYPE job_type AS ENUM ('remote', 'onsite', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create Table Correctly (Referencing COMPANIES)
CREATE TABLE public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL, -- Correct FK
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    location TEXT,
    salary_min NUMERIC,
    salary_max NUMERIC,
    type job_type DEFAULT 'onsite',
    status job_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS and Policies
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view open jobs" ON public.jobs
    FOR SELECT USING (status = 'open');

CREATE POLICY "Company members can manage their jobs" ON public.jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.company_members cm
            WHERE cm.company_id = jobs.company_id
            AND cm.user_id = auth.uid()
        )
    );

-- 5. Seed Data
DO $$
DECLARE
    v_company_id UUID;
BEGIN
    -- Try to find an existing company or create one
    SELECT id INTO v_company_id FROM public.companies LIMIT 1;
    
    IF v_company_id IS NULL THEN
        INSERT INTO public.companies (name, document)
        VALUES ('Empresa Demo', '00000000000000')
        RETURNING id INTO v_company_id;
    END IF;

    INSERT INTO public.jobs (company_id, title, description, requirements, location, salary_min, salary_max, type, status)
    VALUES
    (v_company_id, 'Desenvolvedor Frontend React', 'Desenvolver interfaces modernas.', ARRAY['React', 'TypeScript', 'Tailwind'], 'São Paulo, SP', 5000, 8000, 'hybrid', 'open'),
    (v_company_id, 'Desenvolvedor Backend Node.js', 'API Restful e Microserviços.', ARRAY['Node.js', 'PostgreSQL', 'Docker'], 'Remoto', 6000, 9000, 'remote', 'open'),
    (v_company_id, 'Designer UI/UX', 'Criar protótipos de alta fidelidade.', ARRAY['Figma', 'Prototipação', 'User Research'], 'Rio de Janeiro, RJ', 4500, 7000, 'onsite', 'open'),
    (v_company_id, 'Product Manager', 'Gerenciar roadmap do produto.', ARRAY['Agile', 'Scrum', 'Visão de Produto'], 'São Paulo, SP', 9000, 15000, 'hybrid', 'open'),
    (v_company_id, 'Analista de Dados', 'Análise de métricas e KPIs.', ARRAY['SQL', 'Python', 'Power BI'], 'Remoto', 5500, 8500, 'remote', 'open'),
    (v_company_id, 'DevOps Engineer', 'CI/CD e Infraestrutura.', ARRAY['AWS', 'Terraform', 'Kubernetes'], 'Remoto', 8000, 14000, 'remote', 'open'),
    (v_company_id, 'Estagiário de TI', 'Apoio no suporte e desenvolvimento.', ARRAY['Lógica de Programação', 'Vontade de Aprender'], 'Curitiba, PR', 1500, 2000, 'onsite', 'open'),
    (v_company_id, 'Tech Lead', 'Liderança técnica da squad.', ARRAY['Liderança', 'Arquitetura de Software', 'Mentoria'], 'São Paulo, SP', 12000, 18000, 'hybrid', 'open'),
    (v_company_id, 'QA Engineer', 'Testes automatizados e manuais.', ARRAY['Cypress', 'Jest', 'Automação'], 'Belo Horizonte, MG', 5000, 7500, 'remote', 'open'),
    (v_company_id, 'Marketing Digital', 'Gestão de campanhas e redes sociais.', ARRAY['SEO', 'Google Ads', 'Copywriting'], 'Remoto', 4000, 6000, 'remote', 'open'),
    (v_company_id, 'Desenvolvedor Fullstack', 'React + Node.js.', ARRAY['React', 'Node.js', 'SQL'], 'Florianópolis, SC', 7000, 11000, 'hybrid', 'open'),
    (v_company_id, 'Scrum Master', 'Facilitar cerimônias ágeis.', ARRAY['Scrum', 'Kanban', 'Facilitação'], 'Remoto', 8000, 12000, 'remote', 'open'),
    (v_company_id, 'Analista de Suporte', 'Atendimento ao cliente N1/N2.', ARRAY['Comunicação', 'Linux', 'Troubleshooting'], 'Porto Alegre, RS', 3000, 4500, 'onsite', 'open'),
    (v_company_id, 'Engenheiro de Software Java', 'Desenvolvimento corporativo.', ARRAY['Java', 'Spring Boot', 'Microservices'], 'São Paulo, SP', 7500, 11500, 'hybrid', 'open'),
    (v_company_id, 'Desenvolvedor Mobile Flutter', 'App Android e iOS.', ARRAY['Flutter', 'Dart', 'Mobile'], 'Remoto', 6000, 9500, 'remote', 'open');

END $$;
