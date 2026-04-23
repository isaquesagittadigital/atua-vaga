
-- Migration: Create tables for job attributes (Areas, Specializations, Levels, Schedules)

-- 1. Professional Areas
CREATE TABLE IF NOT EXISTS public.professional_areas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Specializations
CREATE TABLE IF NOT EXISTS public.specializations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    area_id UUID REFERENCES public.professional_areas(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(area_id, name)
);

-- 3. Seniority Levels
CREATE TABLE IF NOT EXISTS public.seniority_levels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Work Schedules
CREATE TABLE IF NOT EXISTS public.work_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Populate Data
INSERT INTO public.professional_areas (name) VALUES 
('Tecnologia'), ('Varejo / Comércio'), ('Indústria'), ('Serviços'), 
('Saúde'), ('Educação'), ('Construção Civil'), ('Logística'), 
('Agronegócio'), ('Financeiro'), ('Marketing'), ('Recursos Humanos')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.seniority_levels (name) VALUES 
('Estágio'), ('Assistente'), ('Analista'), ('Especialista'), 
('Supervisor'), ('Gerente'), ('Diretor'), ('Sócio')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.work_schedules (name) VALUES 
('Período Integral (08:00 - 18:00)'), 
('Meio Período (Manhã)'), 
('Meio Período (Tarde)'), 
('Escala 6x1'), 
('Escala 5x2'), 
('Escala 12x36'), 
('Jornada Flexível')
ON CONFLICT (name) DO NOTHING;

-- Populate some Specializations for 'Tecnologia'
DO $$
DECLARE
    tech_id UUID;
BEGIN
    SELECT id INTO tech_id FROM public.professional_areas WHERE name = 'Tecnologia';
    IF tech_id IS NOT NULL THEN
        INSERT INTO public.specializations (area_id, name) VALUES 
        (tech_id, 'Desenvolvimento Front-end'),
        (tech_id, 'Desenvolvimento Back-end'),
        (tech_id, 'Full-stack Developer'),
        (tech_id, 'Mobile Developer'),
        (tech_id, 'UI/UX Design'),
        (tech_id, 'Data Science / AI'),
        (tech_id, 'DevOps / Cloud'),
        (tech_id, 'Cibersegurança')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Populate some Specializations for 'Marketing'
DO $$
DECLARE
    mkt_id UUID;
BEGIN
    SELECT id INTO mkt_id FROM public.professional_areas WHERE name = 'Marketing';
    IF mkt_id IS NOT NULL THEN
        INSERT INTO public.specializations (area_id, name) VALUES 
        (mkt_id, 'Social Media'),
        (mkt_id, 'Copywriting'),
        (mkt_id, 'Tráfego Pago'),
        (mkt_id, 'SEO'),
        (mkt_id, 'Branding')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Populate some Specializations for 'Varejo / Comércio'
DO $$
DECLARE
    area_id UUID;
BEGIN
    SELECT id INTO area_id FROM public.professional_areas WHERE name = 'Varejo / Comércio';
    IF area_id IS NOT NULL THEN
        INSERT INTO public.specializations (area_id, name) VALUES 
        (area_id, 'Gestão de Loja'),
        (area_id, 'Atendimento ao Cliente'),
        (area_id, 'Vendas Internas'),
        (area_id, 'Visual Merchandising'),
        (area_id, 'Prevenção de Perdas')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Populate some Specializations for 'Indústria'
DO $$
DECLARE
    area_id UUID;
BEGIN
    SELECT id INTO area_id FROM public.professional_areas WHERE name = 'Indústria';
    IF area_id IS NOT NULL THEN
        INSERT INTO public.specializations (area_id, name) VALUES 
        (area_id, 'Operador de Produção'),
        (area_id, 'Manutenção Industrial'),
        (area_id, 'Qualidade'),
        (area_id, 'Engenharia de Produção'),
        (area_id, 'Segurança do Trabalho')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Populate some Specializations for 'Saúde'
DO $$
DECLARE
    area_id UUID;
BEGIN
    SELECT id INTO area_id FROM public.professional_areas WHERE name = 'Saúde';
    IF area_id IS NOT NULL THEN
        INSERT INTO public.specializations (area_id, name) VALUES 
        (area_id, 'Enfermagem'),
        (area_id, 'Medicina'),
        (area_id, 'Fisioterapia'),
        (area_id, 'Psicologia'),
        (area_id, 'Técnico de Enfermagem')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Populate some Specializations for 'Financeiro'
DO $$
DECLARE
    area_id UUID;
BEGIN
    SELECT id INTO area_id FROM public.professional_areas WHERE name = 'Financeiro';
    IF area_id IS NOT NULL THEN
        INSERT INTO public.specializations (area_id, name) VALUES 
        (area_id, 'Contabilidade'),
        (area_id, 'Tesouraria'),
        (area_id, 'Análise de Crédito'),
        (area_id, 'Auditoria'),
        (area_id, 'Planejamento Financeiro')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Populate some Specializations for 'Recursos Humanos'
DO $$
DECLARE
    area_id UUID;
BEGIN
    SELECT id INTO area_id FROM public.professional_areas WHERE name = 'Recursos Humanos';
    IF area_id IS NOT NULL THEN
        INSERT INTO public.specializations (area_id, name) VALUES 
        (area_id, 'Recrutamento e Seleção'),
        (area_id, 'Departamento Pessoal'),
        (area_id, 'Treinamento e Desenvolvimento'),
        (area_id, 'Cargos e Salários'),
        (area_id, 'Business Partner')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Enable RLS for all
ALTER TABLE public.professional_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seniority_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_schedules ENABLE ROW LEVEL SECURITY;

-- Allow public read
DROP POLICY IF EXISTS "Public read professional_areas" ON public.professional_areas;
CREATE POLICY "Public read professional_areas" ON public.professional_areas FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read specializations" ON public.specializations;
CREATE POLICY "Public read specializations" ON public.specializations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read seniority_levels" ON public.seniority_levels;
CREATE POLICY "Public read seniority_levels" ON public.seniority_levels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read work_schedules" ON public.work_schedules;
CREATE POLICY "Public read work_schedules" ON public.work_schedules FOR SELECT USING (true);
