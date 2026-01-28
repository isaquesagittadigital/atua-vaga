-- Seed Data for North, Northeast, and Central-West Regions
-- 7 Companies, 39 Jobs

DO $$
DECLARE
    -- Companies IDs
    v_comp_amazonas UUID := gen_random_uuid();
    v_comp_banco_solar UUID := gen_random_uuid();
    v_comp_pise_bem UUID := gen_random_uuid();
    v_comp_tech_sales UUID := gen_random_uuid();
    v_comp_rota_oeste UUID := gen_random_uuid();
    v_comp_nordeste_criativo UUID := gen_random_uuid();
    v_comp_voz_venda UUID := gen_random_uuid();
    
    -- Owner ID (using a placeholder or fetching the first user if exists, usually better to specify or use 'auth.uid()')
    -- For seed scripts, we often set a dummy owner or null if nullable. 
    -- Assuming companies don't stricly need a user owner constraint for public listing, or we use a known ID.
    -- Ideally, we'd fetch a valid user. Let's try to get one or use a fixed UUID that might exist or just NULL if allowed.
    -- Checking schema: companies usually might need an owner. 
    -- Let's assume we can INSERT without a specific owner for 'system' companies or use a specific admin ID.
    -- If constraint exists, user needs to run this. We will try to fetch the first user in the system to assign ownership.
    v_owner_id UUID;
BEGIN

    -- Attempt to get a user ID to assign as owner of these companies
    SELECT id INTO v_owner_id FROM auth.users LIMIT 1;
    
    -- Fallback if no user exists (though unlikely if app is used)
    IF v_owner_id IS NULL THEN
        RAISE NOTICE 'No user found in auth.users. Please create a user first.';
        RETURN;
    END IF;

    -------------------------------------------------------
    -- 1. INSERT COMPANIES
    -------------------------------------------------------
    
    -- 1. Indústria Amazonas (Industrial - Manaus, AM)
    INSERT INTO public.companies (id, name, description, industry, location, website, logo_url, owner_id)
    VALUES (
        v_comp_amazonas,
        'Indústria Amazonas',
        'Líder na produção de componentes eletrônicos no Polo Industrial de Manaus.',
        'Industrial',
        'Manaus, AM',
        'https://industriaamazonas.com.br',
        'https://ui-avatars.com/api/?name=Indústria+Amazonas&background=0D8ABC&color=fff',
        v_owner_id
    );

    -- 2. Banco Solar (Bancário - Salvador, BA)
    INSERT INTO public.companies (id, name, description, industry, location, website, logo_url, owner_id)
    VALUES (
        v_comp_banco_solar,
        'Banco Solar',
        'Instituição financeira focada em crédito sustentável para o Nordeste.',
        'Financeiro',
        'Salvador, BA',
        'https://bancosolar.com.br',
        'https://ui-avatars.com/api/?name=Banco+Solar&background=FDB813&color=fff',
        v_owner_id
    );

    -- 3. Pise Bem Calçados (Varejo - Fortaleza, CE)
    INSERT INTO public.companies (id, name, description, industry, location, website, logo_url, owner_id)
    VALUES (
        v_comp_pise_bem,
        'Pise Bem Calçados',
        'Rede de varejo de calçados com fabricação própria e design exclusivo.',
        'Varejo',
        'Fortaleza, CE',
        'https://pisebem.com.br',
        'https://ui-avatars.com/api/?name=Pise+Bem&background=E53935&color=fff',
        v_owner_id
    );

    -- 4. TechSales Go (Tecnologia/Vendas - Goiânia, GO)
    INSERT INTO public.companies (id, name, description, industry, location, website, logo_url, owner_id)
    VALUES (
        v_comp_tech_sales,
        'TechSales Go',
        'Soluções de CRM e automação de vendas para o agronegócio.',
        'Tecnologia',
        'Goiânia, GO',
        'https://techsalesgo.com.br',
        'https://ui-avatars.com/api/?name=Tech+Sales&background=4CAF50&color=fff',
        v_owner_id
    );

    -- 5. Rota Oeste Logística (Logística - Cuiabá, MT)
    INSERT INTO public.companies (id, name, description, industry, location, website, logo_url, owner_id)
    VALUES (
        v_comp_rota_oeste,
        'Rota Oeste Logística',
        'Especialista em transporte de grãos e cargas pesadas no Centro-Oeste.',
        'Logística',
        'Cuiabá, MT',
        'https://rotaoeste.com.br',
        'https://ui-avatars.com/api/?name=Rota+Oeste&background=795548&color=fff',
        v_owner_id
    );

    -- 6. Nordeste Criativo (Marketing - Recife, PE)
    INSERT INTO public.companies (id, name, description, industry, location, website, logo_url, owner_id)
    VALUES (
        v_comp_nordeste_criativo,
        'Nordeste Criativo',
        'Agência full-service com foco na cultura e mercado regional.',
        'Marketing',
        'Recife, PE',
        'https://nordestecriativo.com.br',
        'https://ui-avatars.com/api/?name=Nordeste+Criativo&background=9C27B0&color=fff',
        v_owner_id
    );

    -- 7. Voz e Venda (Serviços - Natal, RN)
    INSERT INTO public.companies (id, name, description, industry, location, website, logo_url, owner_id)
    VALUES (
        v_comp_voz_venda,
        'Voz e Venda',
        'Empresa especializada em locução profissional para lojas e eventos.',
        'Serviços',
        'Natal, RN',
        'https://vozevenda.com.br',
        'https://ui-avatars.com/api/?name=Voz+e+Venda&background=FF5722&color=fff',
        v_owner_id
    );


    -------------------------------------------------------
    -- 2. INSERT JOBS (39 Total)
    -------------------------------------------------------

    -- --- Jobs for Indústria Amazonas (Manaus, AM) ---
    INSERT INTO public.jobs (company_id, title, description, requirements, location, type, salary_min, salary_max, status, created_at, contract_type, function_area, is_pcd)
    VALUES
    (v_comp_amazonas, 'Engenheiro de Produção', 'Gestão de linha de montagem de componentes.', '{"Engenharia", "Gestão", "Lean Manufacturing"}', 'Manaus, AM', 'onsite', 8000, 12000, 'open', NOW(), 'CLT', 'Industrial', false),
    (v_comp_amazonas, 'Técnico em Eletrônica', 'Manutenção preventiva e corretiva de maquinário.', '{"Eletrônica", "Manutenção", "Técnico"}', 'Manaus, AM', 'onsite', 3500, 4500, 'open', NOW(), 'CLT', 'Industrial', false),
    (v_comp_amazonas, 'Auxiliar de Logística', 'Controle de estoque e expedição.', '{"Logística", "Excel", "Organização"}', 'Manaus, AM', 'onsite', 1800, 2200, 'open', NOW(), 'Temporário', 'Logística', false),
    (v_comp_amazonas, 'Analista de Qualidade', 'Garantia da qualidade dos produtos finais.', '{"ISO 9001", "Qualidade", "Inspeção"}', 'Manaus, AM', 'onsite', 4000, 5500, 'open', NOW(), 'CLT', 'Industrial', false),
    (v_comp_amazonas, 'Operador de Máquinas', 'Operação de maquinário industrial automatizado.', '{"Ensino Médio", "Curso Técnico", "Atenção"}', 'Manaus, AM', 'onsite', 2500, 3000, 'open', NOW(), 'CLT', 'Industrial', true), -- PCD Job
    (v_comp_amazonas, 'Gerente de Planta', 'Responsável geral pela unidade fabril.', '{"Gestão Sênior", "Engenharia", "Liderança"}', 'Manaus, AM', 'onsite', 15000, 22000, 'open', NOW(), 'PJ', 'Gestão', false);

    -- --- Jobs for Banco Solar (Salvador, BA) ---
    INSERT INTO public.jobs (company_id, title, description, requirements, location, type, salary_min, salary_max, status, created_at, contract_type, function_area, is_pcd)
    VALUES
    (v_comp_banco_solar, 'Gerente de Contas PJ', 'Atendimento a empresas e gestão de carteira.', '{"Bancário", "Vendas", "CPA-20"}', 'Salvador, BA', 'hybrid', 6000, 9000, 'open', NOW(), 'CLT', 'Financeiro', false),
    (v_comp_banco_solar, 'Analista de Crédito', 'Análise de risco e concessão de crédito.', '{"Finanças", "Análise de Risco", "Excel"}', 'Salvador, BA', 'hybrid', 4500, 6000, 'open', NOW(), 'CLT', 'Financeiro', false),
    (v_comp_banco_solar, 'Caixa Bancário', 'Atendimento ao público e operações de caixa.', '{"Atendimento", "Matemática", "Atenção"}', 'Salvador, BA', 'onsite', 2800, 3500, 'open', NOW(), 'CLT', 'Financeiro', true), -- PCD Job
    (v_comp_banco_solar, 'Desenvolvedor Java Backend', 'Desenvolvimento de APIs para o core bancário.', '{"Java", "Spring Boot", "SQL"}', 'Salvador, BA', 'remote', 7000, 11000, 'open', NOW(), 'PJ', 'Tecnologia', false),
    (v_comp_banco_solar, 'Assistente Administrativo', 'Suporte administrativo à agência.', '{"Organização", "Office", "Proatividade"}', 'Salvador, BA', 'onsite', 2000, 2500, 'open', NOW(), 'Estágio', 'Administrativo', false);

    -- --- Jobs for Pise Bem Calçados (Fortaleza, CE) ---
    INSERT INTO public.jobs (company_id, title, description, requirements, location, type, salary_min, salary_max, status, created_at, contract_type, function_area, is_pcd)
    VALUES
    (v_comp_pise_bem, 'Vendedor de Loja', 'Atendimento ao cliente e vendas de calçados.', '{"Vendas", "Simpatia", "Metas"}', 'Fortaleza, CE', 'onsite', 1500, 2500, 'open', NOW(), 'CLT', 'Vendas', false),
    (v_comp_pise_bem, 'Gerente de Loja', 'Gestão de equipe e resultados da loja.', '{"Liderança", "Varejo", "Gestão"}', 'Fortaleza, CE', 'onsite', 4000, 6000, 'open', NOW(), 'CLT', 'Vendas', false),
    (v_comp_pise_bem, 'Designer de Calçados', 'Criação de novas coleções.', '{"Design", "Moda", "CorelDraw"}', 'Fortaleza, CE', 'hybrid', 5000, 8000, 'open', NOW(), 'PJ', 'Design', false),
    (v_comp_pise_bem, 'Auxiliar de E-commerce', 'Separação e envio de pedidos online.', '{"E-commerce", "Agilidade", "Informática"}', 'Fortaleza, CE', 'onsite', 1600, 2000, 'open', NOW(), 'CLT', 'Logística', true), -- PCD Job
    (v_comp_pise_bem, 'Estoquista', 'Organização do estoque da loja.', '{"Organização", "Força Física", "Controle"}', 'Fortaleza, CE', 'onsite', 1500, 1800, 'open', NOW(), 'CLT', 'Logística', false),
    (v_comp_pise_bem, 'Analista de Marketing Digital', 'Gestão de redes sociais e campanhas.', '{"Marketing", "Instagram", "Ads"}', 'Fortaleza, CE', 'hybrid', 3500, 5000, 'open', NOW(), 'PJ', 'Marketing', false);

    -- --- Jobs for TechSales Go (Goiânia, GO) ---
    INSERT INTO public.jobs (company_id, title, description, requirements, location, type, salary_min, salary_max, status, created_at, contract_type, function_area, is_pcd)
    VALUES
    (v_comp_tech_sales, 'SDR - Pré-vendas', 'Qualificação de leads para o time de vendas.', '{"Vendas", "Telefone", "Persistência"}', 'Goiânia, GO', 'remote', 2500, 3500, 'open', NOW(), 'PJ', 'Vendas', false),
    (v_comp_tech_sales, 'Executivo de Contas', 'Fechamento de vendas consultivas B2B.', '{"B2B", "Negociação", "CRM"}', 'Goiânia, GO', 'remote', 5000, 10000, 'open', NOW(), 'PJ', 'Vendas', false),
    (v_comp_tech_sales, 'Desenvolvedor Fullstack', 'Manutenção da plataforma de CRM.', '{"Node.js", "React", "Postgres"}', 'Goiânia, GO', 'remote', 6000, 9000, 'open', NOW(), 'PJ', 'Tecnologia', false),
    (v_comp_tech_sales, 'Suporte Técnico', 'Atendimento aos usuários da plataforma.', '{"Suporte", "Chamados", "Paciência"}', 'Goiânia, GO', 'remote', 2000, 3000, 'open', NOW(), 'CLT', 'Tecnologia', true), -- PCD Job
    (v_comp_tech_sales, 'Gerente de Customer Success', 'Garantir o sucesso e retenção dos clientes.', '{"CS", "Relacionamento", "Métricas"}', 'Goiânia, GO', 'remote', 7000, 10000, 'open', NOW(), 'PJ', 'Vendas', false);

    -- --- Jobs for Rota Oeste Logística (Cuiabá, MT) ---
    INSERT INTO public.jobs (company_id, title, description, requirements, location, type, salary_min, salary_max, status, created_at, contract_type, function_area, is_pcd)
    VALUES
    (v_comp_rota_oeste, 'Motorista Carreteiro', 'Transporte de cargas estaduais.', '{"CNH E", "Experiência", "Disponibilidade"}', 'Cuiabá, MT', 'onsite', 4000, 6000, 'open', NOW(), 'CLT', 'Logística', false),
    (v_comp_rota_oeste, 'Assistente de Frota', 'Controle de manutenção e rastreamento.', '{"Logística", "Gestão", "Excel"}', 'Cuiabá, MT', 'onsite', 2500, 3200, 'open', NOW(), 'CLT', 'Logística', false),
    (v_comp_rota_oeste, 'Mecânico Diesel', 'Manutenção de caminhões da frota.', '{"Mecânica Diesel", "Experiência", "Ferramentas"}', 'Cuiabá, MT', 'onsite', 3500, 5000, 'open', NOW(), 'CLT', 'Manutenção', false),
    (v_comp_rota_oeste, 'Auxiliar Administrativo', 'Emissão de notas fiscais e manifestos.', '{"NFe", "CT-e", "Administrativo"}', 'Cuiabá, MT', 'onsite', 1800, 2200, 'open', NOW(), 'CLT', 'Administrativo', true), -- PCD Job
    (v_comp_rota_oeste, 'Coordenador de Logística', 'Planejamento de rotas e otimização.', '{"Logística", "Planejamento", "Liderança"}', 'Cuiabá, MT', 'onsite', 6000, 8000, 'open', NOW(), 'PJ', 'Logística', false);

    -- --- Jobs for Nordeste Criativo (Recife, PE) ---
    INSERT INTO public.jobs (company_id, title, description, requirements, location, type, salary_min, salary_max, status, created_at, contract_type, function_area, is_pcd)
    VALUES
    (v_comp_nordeste_criativo, 'Social Media', 'Criação de conteúdo para redes sociais.', '{"Redes Sociais", "Copywriting", "Design"}', 'Recife, PE', 'hybrid', 2500, 3500, 'open', NOW(), 'PJ', 'Marketing', false),
    (v_comp_nordeste_criativo, 'Designer Gráfico', 'Criação de peças visuais para campanhas.', '{"Photoshop", "Illustrator", "Criatividade"}', 'Recife, PE', 'hybrid', 3000, 4500, 'open', NOW(), 'PJ', 'Design', false),
    (v_comp_nordeste_criativo, 'Analista de Performance', 'Gestão de tráfego pago (Ads).', '{"Google Ads", "Meta Ads", "Analytics"}', 'Recife, PE', 'remote', 4000, 6000, 'open', NOW(), 'PJ', 'Marketing', false),
    (v_comp_nordeste_criativo, 'Atendimento Publicitário', 'Relacionamento com clientes da agência.', '{"Comunicação", "Organização", "Pauta"}', 'Recife, PE', 'hybrid', 3000, 4000, 'open', NOW(), 'CLT', 'Marketing', false),
    (v_comp_nordeste_criativo, 'Redator Publicitário', 'Criação de conceitos e textos criativos.', '{"Redação", "Criatividade", "Português"}', 'Recife, PE', 'remote', 3500, 5000, 'open', NOW(), 'PJ', 'Marketing', false),
    (v_comp_nordeste_criativo, 'Assistente de Arte', 'Apoio na criação de layouts simples.', '{"Design", "Estágio", "Vontade de Aprender"}', 'Recife, PE', 'hybrid', 1200, 1600, 'open', NOW(), 'Estágio', 'Design', true); -- PCD Job

    -- --- Jobs for Voz e Venda (Natal, RN) ---
    INSERT INTO public.jobs (company_id, title, description, requirements, location, type, salary_min, salary_max, status, created_at, contract_type, function_area, is_pcd)
    VALUES
    (v_comp_voz_venda, 'Locutor Comercial', 'Locução ao vivo em lojas parceiras.', '{"Voz", "Comunicação", "Carisma"}', 'Natal, RN', 'onsite', 2000, 3000, 'open', NOW(), 'PJ', 'Serviços', false),
    (v_comp_voz_venda, 'Promotor de Vendas', 'Abordagem de clientes e distribuição de brindes.', '{"Vendas", "Simpatia", "Proatividade"}', 'Natal, RN', 'onsite', 1500, 2000, 'open', NOW(), 'temporário', 'Vendas', false),
    (v_comp_voz_venda, 'Técnico de Som', 'Montagem e operação de equipamentos de som.', '{"Áudio", "Montagem", "Técnico"}', 'Natal, RN', 'onsite', 1800, 2500, 'open', NOW(), 'CLT', 'Serviços', false),
    (v_comp_voz_venda, 'Assistente Comercial', 'Prospecção de novos contratos de locução.', '{"Vendas", "Telefone", "Comercial"}', 'Natal, RN', 'hybrid', 1800, 2500, 'open', NOW(), 'CLT', 'Vendas', false),
    (v_comp_voz_venda, 'Recepcionista', 'Atendimento telefônico e recepção.', '{"Atendimento", "Simpatia", "Organização"}', 'Natal, RN', 'onsite', 1412, 1600, 'open', NOW(), 'CLT', 'Administrativo', true), -- PCD Job
    (v_comp_voz_venda, 'Gerente Operacional', 'Coordenação das equipes de rua.', '{"Logística", "Gestão", "Liderança"}', 'Natal, RN', 'onsite', 4000, 5500, 'open', NOW(), 'PJ', 'Gestão', false);

END $$;
