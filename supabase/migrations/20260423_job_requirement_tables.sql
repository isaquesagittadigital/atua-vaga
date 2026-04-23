
-- Migration: Add Experience, Gender, and Education tables for job requirements

-- 1. Experience Levels
CREATE TABLE IF NOT EXISTS public.experience_levels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Genders
CREATE TABLE IF NOT EXISTS public.genders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Education Levels
CREATE TABLE IF NOT EXISTS public.education_levels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Populate Data
INSERT INTO public.experience_levels (name) VALUES 
('Sem experiência'), ('Menos de 1 ano'), ('1 a 2 anos'), ('2 a 3 anos'), ('3 a 5 anos'), ('Mais de 5 anos')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.genders (name) VALUES 
('Masculino'), ('Feminino'), ('Ambos')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.education_levels (name) VALUES 
('Ensino Fundamental'), ('Ensino Médio'), ('Ensino Técnico'), ('Ensino Superior (Incompleto)'), ('Ensino Superior (Completo)'), ('Pós-graduação / MBA'), ('Mestrado / Doutorado')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE public.experience_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_levels ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read experience_levels" ON public.experience_levels FOR SELECT USING (true);
CREATE POLICY "Public read genders" ON public.genders FOR SELECT USING (true);
CREATE POLICY "Public read education_levels" ON public.education_levels FOR SELECT USING (true);
