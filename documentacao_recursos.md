# Documentação de Recursos do Projeto - Atua Vaga

Este documento detalha os recursos funcionais e técnicos atualmente implementados no sistema Atua Vaga.

## 1. Visão Geral
O sistema é uma plataforma de empregabilidade que conecta **Candidatos** a **Empresas**, com um painel administrativo para gestão. A arquitetura é baseada em React (Frontend) e Node.js/Express (Backend) com Supabase (Banco de Dados e Auth).

## 2. Módulos de Acesso

O sistema possui controle de acesso baseado em níveis (RBAC):

### 👤 Candidato
Focado na busca de oportunidades e auto-desenvolvimento.
- **Autenticação**: Login (Email/Senha, Google), Cadastro Simplificado, Recuperação de Senha.
- **Dashboard**: Visão geral de candidaturas e status.
- **Vagas**:
    - Listagem de todas as vagas disponíveis.
    - **Minhas Vagas**: Acompanhamento de vagas onde se candidatou.
- **Perfil Profissional**: Edição de dados pessoais e currículo.
- **Teste Comportamental**: Área para realização de testes e visualização de resultados (DISC/Outros).
- **Outros**: FAQ, Notificações, Visualização de Perfil de Empresas.

### 🏢 Empresa
Focado na gestão de processos seletivos.
- **Cadastro Corporativo**: Fluxo em 3 etapas (Conta, Responsável, Dados da Empresa).
- **Dashboard**: Métricas de vagas abertas, fechadas e candidatos.
- **Gestão de Vagas**:
    - **Criar Vaga**: Formulário detalhado com requisitos, salário, etc.
    - **Listar Vagas**: Visão geral das vagas da empresa.
    - **Ranking de Candidatos**: Visualização de candidatos aplicados com "Match" (percentual de compatibilidade).
- **Onboarding**: Configuração inicial da conta da empresa.

### 🧤 Administrador (Super Admin)
- **Dashboard**: Visão geral do sistema (em desenvolvimento).

## 3. Recursos Técnicos (Backend & Infraestrutura)

### Autenticação & Segurança
- **Supabase Auth**: Gerenciamento de usuários.
- **Middleware JWT**: (`auth.ts`) Validação de tokens de acesso.
- **RBAC (Role-Based Access Control)**: (`rbac.ts`) Middleware para restringir rotas por nível de acesso (candidate, company_admin, etc.).
- **Isolamento de Dados (Multi-tenancy)**: API filtra dados automaticamente baseado na Empresa do usuário logado.

### Banco de Dados (Supabase/PostgreSQL)
- **Tabelas Principais**:
    - `public.companies`: Dados das empresas.
    - `public.profiles`: Perfis de usuários com roles.
    - `public.company_members`: Vínculo entre usuários e empresas.
    - `public.jobs`: Vagas de emprego.
    - `auth.users`: Tabela interna do Supabase para credenciais.

### API (Node.js/Express)
Endpoints disponíveis (`server/src/index.ts`):
- **Auth**:
    - `POST /api/auth/register`: Registro unificado (cria usuário, perfil e empresa se necessário).
    - `POST /api/auth/login`: Autenticação e retorno de sessão.
- **Vagas (Jobs)**:
    - `POST /api/jobs`: Criar nova vaga (Requer Empresa).
    - `GET /api/jobs`: Listar vagas da empresa logada.
- **Dashboard**:
    - `GET /api/dashboard/metrics`: Contadores de vagas (abertas, fechadas).
- **Candidatos**:
    - `GET /api/candidates/matches`: Retorna candidatos com compatibilidade (Mock/Simulado atualmente).

## 4. Frontend (React/Vite)
- **Tecnologias**: React 18, TailwindCSS, Lucide Icons, React Router Dom.
- **Estrutura de Pastas**:
    - `contexts/`: `AuthContext` (Gerencia sessão, perfil e dados da empresa globalmente).
    - `components/layouts/`: Layouts específicos para cada perfil (CandidateLayout, CompanyLayout, AdminLayout).
    - `components/auth/`: Formulários de login/registro reutilizáveis.
    - `components/pages/`: Páginas divididas por módulo (candidate, company, admin).

## 5. Próximos Passos (Sugestões)
- Implementar algoritmo real de "Match" entre Candidato e Vaga.
- Finalizar fluxo de inscrição do candidato em uma vaga.
- Desenvolver área administrativa do sistema (Super Admin).
