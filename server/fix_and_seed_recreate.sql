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
    contract_type TEXT DEFAULT 'CLT', -- New: CLT, PJ, Estágio, Temporário
    function_area TEXT DEFAULT 'Tecnologia', -- New: Tecnologia, Marketing, etc
    is_pcd BOOLEAN DEFAULT false, -- New: Vaga afirmativa
    work_schedule TEXT, -- New: Integral, Parcial, Noturno
    seniority TEXT, -- New: Junior, Pleno, Senior, Especialista
    pcd_type TEXT, -- New: Auditiva, Fisica, Visual, etc.
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

    INSERT INTO public.jobs (company_id, title, description, requirements, location, salary_min, salary_max, type, status, contract_type, function_area, is_pcd, work_schedule, seniority, pcd_type)
    VALUES
    (v_company_id, 'Desenvolvedor Frontend React', 'Desenvolver interfaces modernas.', ARRAY['React', 'TypeScript', 'Tailwind'], 'São Paulo, SP', 5000, 8000, 'hybrid', 'open', 'CLT', 'Tecnologia', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Desenvolvedor Backend Node.js', 'API Restful e Microserviços.', ARRAY['Node.js', 'PostgreSQL', 'Docker'], 'Remoto', 6000, 9000, 'remote', 'open', 'PJ', 'Tecnologia', false, 'Período Integral', 'Senior', null),
    (v_company_id, 'Designer UI/UX', 'Criar protótipos de alta fidelidade.', ARRAY['Figma', 'Prototipação', 'User Research'], 'Rio de Janeiro, RJ', 4500, 7000, 'onsite', 'open', 'CLT', 'Design', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Product Manager', 'Gerenciar roadmap do produto.', ARRAY['Agile', 'Scrum', 'Visão de Produto'], 'São Paulo, SP', 9000, 15000, 'hybrid', 'open', 'CLT', 'Produto', false, 'Período Integral', 'Especialista', null),
    (v_company_id, 'Analista de Dados', 'Análise de métricas e KPIs.', ARRAY['SQL', 'Python', 'Power BI'], 'Remoto', 5500, 8500, 'remote', 'open', 'PJ', 'Dados', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'DevOps Engineer', 'CI/CD e Infraestrutura.', ARRAY['AWS', 'Terraform', 'Kubernetes'], 'Remoto', 8000, 14000, 'remote', 'open', 'PJ', 'Infraestrutura', false, 'Período Integral', 'Senior', null),
    (v_company_id, 'Estagiário de TI', 'Apoio no suporte e desenvolvimento.', ARRAY['Lógica de Programação', 'Vontade de Aprender'], 'Curitiba, PR', 1500, 2000, 'onsite', 'open', 'Estágio', 'Tecnologia', true, 'Parcial tardes', 'Estagiário', 'Auditiva'),
    (v_company_id, 'Tech Lead', 'Liderança técnica da squad.', ARRAY['Liderança', 'Arquitetura de Software', 'Mentoria'], 'São Paulo, SP', 12000, 18000, 'hybrid', 'open', 'CLT', 'Tecnologia', false, 'Período Integral', 'Especialista', null),
    (v_company_id, 'QA Engineer', 'Testes automatizados e manuais.', ARRAY['Cypress', 'Jest', 'Automação'], 'Belo Horizonte, MG', 5000, 7500, 'remote', 'open', 'PJ', 'QA', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Marketing Digital', 'Gestão de campanhas e redes sociais.', ARRAY['SEO', 'Google Ads', 'Copywriting'], 'Remoto', 4000, 6000, 'remote', 'open', 'PJ', 'Marketing', false, 'Período Integral', 'Junior', null),
    (v_company_id, 'Desenvolvedor Fullstack', 'React + Node.js.', ARRAY['React', 'Node.js', 'SQL'], 'Florianópolis, SC', 7000, 11000, 'hybrid', 'open', 'CLT', 'Tecnologia', false, 'Período Integral', 'Senior', null),
    (v_company_id, 'Scrum Master', 'Facilitar cerimônias ágeis.', ARRAY['Scrum', 'Kanban', 'Facilitação'], 'Remoto', 8000, 12000, 'remote', 'open', 'PJ', 'Agile', false, 'Período Integral', 'Senior', null),
    (v_company_id, 'Analista de Suporte', 'Atendimento ao cliente N1/N2.', ARRAY['Comunicação', 'Linux', 'Troubleshooting'], 'Porto Alegre, RS', 3000, 4500, 'onsite', 'open', 'CLT', 'Suporte', true, 'Período Integral', 'Junior', 'Fisica'),
    (v_company_id, 'Engenheiro de Software Java', 'Desenvolvimento corporativo.', ARRAY['Java', 'Spring Boot', 'Microservices'], 'São Paulo, SP', 7500, 11500, 'hybrid', 'open', 'CLT', 'Tecnologia', false, 'Período Integral', 'Senior', null),
    (v_company_id, 'Desenvolvedor Mobile Flutter', 'App Android e iOS.', ARRAY['Flutter', 'Dart', 'Mobile'], 'Remoto', 6000, 9500, 'remote', 'open', 'PJ', 'Mobile', false, 'Período Integral', 'Pleno', null),

    -- Novos Jobs (Solicitação do Usuário)
    
    -- Serviços Gerais e Limpeza
    (v_company_id, 'Auxiliar de Serviços Gerais', 'Limpeza e conservação de escritórios.', ARRAY['Limpeza', 'Organização'], 'São Paulo, SP', 1500, 1800, 'onsite', 'open', 'CLT', 'Serviços Gerais', false, 'Período Integral', 'Auxiliar', null),
    (v_company_id, 'Faxineiro(a)', 'Responsável pela limpeza geral do prédio.', ARRAY['Limpeza', 'Proatividade'], 'Osasco, SP', 1600, 1900, 'onsite', 'open', 'CLT', 'Limpeza', false, 'Período Integral', 'Auxiliar', null),
    (v_company_id, 'Zelador Predial', 'Zeladoria e pequenas manutenções.', ARRAY['Manutenção', 'Elétrica Básica'], 'São Bernardo do Campo, SP', 2200, 2600, 'onsite', 'open', 'CLT', 'Serviços Gerais', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Auxiliar de Limpeza Hospitalar', 'Limpeza técnica em ambiente hospitalar.', ARRAY['Higiene', 'Normas ANVISA'], 'São Paulo, SP', 1800, 2100, 'onsite', 'open', 'CLT', 'Limpeza', false, 'Noturno', 'Auxiliar', null),
    (v_company_id, 'Jardineiro', 'Manutenção de jardins e áreas verdes.', ARRAY['Jardinagem', 'Poda'], 'Cotia, SP', 2000, 2500, 'onsite', 'open', 'CLT', 'Serviços Gerais', false, 'Período Integral', 'Assistente', null),

    -- Atendimento ao Público
    (v_company_id, 'Recepcionista Bilíngue', 'Recepção de hóspedes internacionais.', ARRAY['Inglês Fluente', 'Simpatia'], 'São Paulo, SP', 3500, 4500, 'onsite', 'open', 'CLT', 'Atendimento', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Atendente de Loja', 'Atendimento ao cliente em loja.', ARRAY['Vendas', 'Moda'], 'Barueri, SP', 1800, 2200, 'onsite', 'open', 'CLT', 'Atendimento', false, 'Parcial tardes', 'Junior', null),
    (v_company_id, 'Operador de Caixa', 'Operação de caixa e atendimento.', ARRAY['Atenção', 'Matemática'], 'São Paulo, SP', 1700, 2000, 'onsite', 'open', 'CLT', 'Atendimento', true, 'Período Integral', 'Auxiliar', 'Fisica'),
    (v_company_id, 'Assistente de SAC', 'Atendimento telefônico e via chat.', ARRAY['Boa dicção', 'Paciência'], 'Remoto', 1600, 2000, 'remote', 'open', 'CLT', 'Atendimento', false, 'Parcial manhãs', 'Junior', null),
    (v_company_id, 'Concierge', 'Informações e auxílio aos clientes.', ARRAY['Postura', 'Comunicação'], 'São Paulo, SP', 2500, 3000, 'onsite', 'open', 'CLT', 'Atendimento', false, 'Período Integral', 'Pleno', null),

    -- Vendas e Automotivo
    (v_company_id, 'Vendedor de Veículos Novos', 'Venda de carros 0km.', ARRAY['Negociação', 'CNH B'], 'São Paulo, SP', 3000, 8000, 'onsite', 'open', 'CLT', 'Automotivo', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Consultor de Vendas Premium', 'Venda de veículos importados.', ARRAY['Experiência Premium', 'Inglês'], 'São Paulo, SP', 5000, 15000, 'onsite', 'open', 'PJ', 'Automotivo', false, 'Período Integral', 'Senior', null),
    (v_company_id, 'Vendedor Externo', 'Vendas PAP de produtos.', ARRAY['Vendas', 'Persuasão'], 'Grande SP', 2500, 5000, 'hybrid', 'open', 'CLT', 'Vendas', false, 'Período Integral', 'Junior', null),
    (v_company_id, 'Gerente de Loja de Peças', 'Gerenciamento de equipe e estoque.', ARRAY['Liderança', 'Mecânica'], 'Santo André, SP', 6000, 9000, 'onsite', 'open', 'CLT', 'Automotivo', false, 'Período Integral', 'Gerente', null),
    (v_company_id, 'Assistente de Vendas', 'Apoio aos corretores e atendimento.', ARRAY['Proatividade', 'Vontade de aprender'], 'São Paulo, SP', 2000, 4000, 'onsite', 'open', 'Estágio', 'Vendas', false, 'Parcial tardes', 'Estagiário', null),

    -- Saúde
    (v_company_id, 'Enfermeiro(a) UTI', 'Cuidados intensivos.', ARRAY['Coren Ativo', 'UTI'], 'São Paulo, SP', 5000, 7000, 'onsite', 'open', 'CLT', 'Saúde', false, 'Noturno', 'Pleno', null),
    (v_company_id, 'Técnico de Enfermagem', 'Procedimentos básicos e coleta.', ARRAY['Coren', 'Punção'], 'Osasco, SP', 3000, 3800, 'onsite', 'open', 'CLT', 'Saúde', false, 'Período Integral', 'Junior', null),
    (v_company_id, 'Recepcionista Clínica', 'Agendamento e recepção.', ARRAY['Sympla', 'Organização'], 'São Paulo, SP', 2000, 2500, 'onsite', 'open', 'CLT', 'Saúde', true, 'Período Integral', 'Assistente', 'Auditiva'),
    (v_company_id, 'Fisioterapeuta', 'Reabilitação esportiva.', ARRAY['Fisioterapia', 'Pilates'], 'São Paulo, SP', 4000, 6000, 'onsite', 'open', 'PJ', 'Saúde', false, 'Parcial manhãs', 'Pleno', null),
    (v_company_id, 'Médico do Trabalho', 'Exames admissionais.', ARRAY['CRM', 'Medicina do Trabalho'], 'Barueri, SP', 12000, 18000, 'onsite', 'open', 'PJ', 'Saúde', false, 'Parcial tardes', 'Senior', null),

    -- Tecnologia (Mais Vagas)
    (v_company_id, 'Desenvolvedor React Junior', 'Desenvolvimento de interfaces.', ARRAY['React', 'CSS', 'Git'], 'Remoto', 3500, 5000, 'remote', 'open', 'CLT', 'Tecnologia', false, 'Período Integral', 'Junior', null),
    (v_company_id, 'Tech Lead', 'Liderança técnica de squad.', ARRAY['Arquitetura', 'Java', 'AWS'], 'São Paulo, SP', 18000, 25000, 'hybrid', 'open', 'CLT', 'Tecnologia', false, 'Período Integral', 'Especialista', null),
    (v_company_id, 'QA Automation Engineer', 'Automação de testes E2E.', ARRAY['Cypress', 'Python', 'CI/CD'], 'Remoto', 8000, 12000, 'remote', 'open', 'PJ', 'Tecnologia', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Product Owner', 'Gestão de backlog e roadmap.', ARRAY['Scrum', 'Jira', 'Visão de Produto'], 'São Paulo, SP', 10000, 15000, 'hybrid', 'open', 'CLT', 'Produto', false, 'Período Integral', 'Senior', null),
    (v_company_id, 'Suporte Técnico N1', 'Atendimento de chamados de TI.', ARRAY['Windows', 'Redes Básicas'], 'Remoto', 2000, 2500, 'remote', 'open', 'CLT', 'Suporte', true, 'Período Integral', 'Junior', 'Visual'),

    (v_company_id, 'Vendedor de Consórcio', 'Venda de cartas de crédito.', ARRAY['Vendas', 'Telefone'], 'Campinas, SP', 2000, 6000, 'onsite', 'open', 'CLT', 'Vendas', false, 'Período Integral', 'Pleno', null),

    -- Novos Jobs (Norte e Nordeste - Agro, Indústria, Turismo, Pesca, Educação, Jurídico)

    -- Agro (MT, BA, PE, TO)
    (v_company_id, 'Agrônomo de Campo', 'Consultoria técnica para produtores de soja e milho.', ARRAY['Agronomia', 'Soja', 'Consultoria'], 'Barreiras, BA', 6000, 9000, 'onsite', 'open', 'CLT', 'Agro', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Técnico Agrícola', 'Monitoramento de pragas e manejo.', ARRAY['Técnico', 'Manejo', 'Pragas'], 'Petrolina, PE', 3000, 4500, 'onsite', 'open', 'CLT', 'Agro', false, 'Período Integral', 'Junior', null),
    (v_company_id, 'Gerente de Fazenda', 'Gestão operacional de fazenda de gado.', ARRAY['Gestão', 'Pecuária', 'Liderança'], 'Araguaína, TO', 8000, 12000, 'onsite', 'open', 'PJ', 'Agro', false, 'Período Integral', 'Gerente', null),
    (v_company_id, 'Operador de Colheitadeira', 'Operação de máquinas pesadas.', ARRAY['Máquinas Agrícolas', 'GPS'], 'Sinop, MT', 4000, 6000, 'onsite', 'open', 'Temporário', 'Agro', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Zootecnista', 'Nutrição animal e melhoramento genético.', ARRAY['Zootecnia', 'Nutrição Animal'], 'Feira de Santana, BA', 5000, 7500, 'onsite', 'open', 'CLT', 'Agro', false, 'Período Integral', 'Pleno', null),

    -- Indústria (AM, PE, CE)
    (v_company_id, 'Engenheiro de Produção', 'Otimização de linha de montagem.', ARRAY['Lean Manufacturing', 'Six Sigma'], 'Manaus, AM', 7000, 10000, 'onsite', 'open', 'CLT', 'Indústria', false, 'Período Integral', 'Senior', null),
    (v_company_id, 'Operador de Máquina Injetora', 'Operação de injetoras plásticas.', ARRAY['Injeção Plástica', 'Operação'], 'Camaçari, BA', 2500, 3500, 'onsite', 'open', 'CLT', 'Indústria', false, 'Noturno', 'Assistente', null),
    (v_company_id, 'Técnico de Segurança do Trabalho', 'Inspeção e treinamento de EPIs.', ARRAY['NRs', 'Segurança', 'EPI'], 'Suape, PE', 3500, 4500, 'onsite', 'open', 'CLT', 'Indústria', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Analista de Qualidade Industrial', 'Controle de qualidade de produtos.', ARRAY['ISO 9001', 'Qualidade'], 'Maracanaú, CE', 4000, 5500, 'onsite', 'open', 'CLT', 'Indústria', false, 'Período Integral', 'Junior', null),
    (v_company_id, 'Eletricista Industrial', 'Manutenção elétrica de máquinas.', ARRAY['Elétrica', 'Comandos', 'PLC'], 'Manaus, AM', 3000, 4200, 'onsite', 'open', 'CLT', 'Indústria', false, 'Período Integral', 'Pleno', null),

    -- Turismo (CE, RN, BA, AL)
    (v_company_id, 'Gerente de Hotel', 'Gestão completa de hotel butique.', ARRAY['Hotelaria', 'Gestão', 'Inglês'], 'Jericoacoara, CE', 6000, 9000, 'onsite', 'open', 'PJ', 'Turismo', false, 'Período Integral', 'Gerente', null),
    (v_company_id, 'Guia de Turismo Regional', 'Passeios ecológicos e históricos.', ARRAY['Turismo', 'História Local', 'Inglês'], 'Lençóis, BA', 2000, 4000, 'onsite', 'open', 'Autônomo', 'Turismo', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Recepcionista de Resort', 'Check-in, check-out e atendimento.', ARRAY['Inglês', 'Espanhol', 'Simpatia'], 'Porto de Galinhas, PE', 2500, 3200, 'onsite', 'open', 'CLT', 'Turismo', false, 'Período Integral', 'Junior', null),
    (v_company_id, 'Agente de Viagens', 'Venda de pacotes turísticos.', ARRAY['Vendas', 'Destinos', 'Amadeus'], 'Natal, RN', 2800, 5000, 'onsite', 'open', 'CLT', 'Turismo', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Chef de Cozinha', 'Cozinha regional nordestina.', ARRAY['Gastronomia', 'Frutos do Mar'], 'Maceió, AL', 4000, 6000, 'onsite', 'open', 'CLT', 'Turismo', false, 'Noturno', 'Senior', null),

    -- Pesca (PA, AM, CE)
    (v_company_id, 'Engenheiro de Pesca', 'Gerenciamento de produção aquícola.', ARRAY['Aquicultura', 'Tilápia', 'Camarão'], 'Fortaleza, CE', 6000, 8500, 'onsite', 'open', 'CLT', 'Pesca', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Pescador Profissional', 'Pesca artesanal motorizada.', ARRAY['Pesca', 'Navegação'], 'Belém, PA', 2500, 4000, 'onsite', 'open', 'Temporário', 'Pesca', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Técnico em Aquicultura', 'Manejo de tanques de peixe.', ARRAY['Biologia', 'Manejo'], 'Manaus, AM', 3000, 4000, 'onsite', 'open', 'Estágio', 'Pesca', false, 'Período Integral', 'Estagiário', null),
    (v_company_id, 'Classificador de Pescado', 'Controle de qualidade do pescado.', ARRAY['Qualidade', 'Frigorífico'], 'Itajaí, SC', 2800, 3500, 'onsite', 'open', 'CLT', 'Pesca', true, 'Período Integral', 'Auxiliar', 'Auditiva'),

    -- Educação (Norte/Nordeste)
    (v_company_id, 'Professor de Matemática', 'Ensino médio e fundamental.', ARRAY['Licenciatura', 'Didática'], 'Recife, PE', 3500, 5500, 'onsite', 'open', 'CLT', 'Educação', false, 'parcial manhãs', 'Pleno', null),
    (v_company_id, 'Coordenador Pedagógico', 'Coordenação de corpo docente.', ARRAY['Pedagogia', 'Gestão Escolar'], 'Salvador, BA', 5000, 7000, 'onsite', 'open', 'CLT', 'Educação', false, 'Período Integral', 'Senior', null),
    (v_company_id, 'Tutor EAD', 'Acompanhamento de alunos online.', ARRAY['Moodle', 'Educação a Distância'], 'Remoto', 1800, 2500, 'remote', 'open', 'PJ', 'Educação', true, 'Período Integral', 'Assistente', 'Fisica'),

    -- Jurídico (Norte/Nordeste)
    (v_company_id, 'Advogado Trabalhista', 'Audiências e petições.', ARRAY['OAB', 'Direito do Trabalho'], 'Fortaleza, CE', 4500, 7000, 'hybrid', 'open', 'Autônomo', 'Jurídico', false, 'Período Integral', 'Pleno', null),
    (v_company_id, 'Assistente Jurídico', 'Acompanhamento processual.', ARRAY['Direito', 'Escrita'], 'Manaus, AM', 2000, 3000, 'onsite', 'open', 'Estágio', 'Jurídico', false, 'Parcial tardes', 'Estagiário', null),
    (v_company_id, 'Advogado Ambiental', 'Consultoria e licenciamento.', ARRAY['Direito Ambiental', 'Licenciamento'], 'Belém, PA', 6000, 10000, 'hybrid', 'open', 'PJ', 'Jurídico', false, 'Período Integral', 'Senior', null);

END $$;
