# Backend Atua Vaga

Este diretório contém a implementação do backend da plataforma Atua Vaga, utilizando **Node.js (Express)** e **Supabase**.

## Estrutura do Backend

O backend é dividido em duas partes principais:

1.  **Banco de Dados (Supabase)**: Onde residem as tabelas, políticas de segurança (RLS) e gatilhos (Triggers).
2.  **Servidor de API (Node.js)**: Utilizado para operações que requerem privilégios de administrador ou processamento pesado (ex: cálculo de fórmulas comportamentais).

---

## 🚀 Como Configurar

### 1. Banco de Dados (Supabase)

O arquivo principal de inicialização está em `/supabase/init_backend.sql`.

1.  Acesse o [Dashboard do Supabase](https://supabase.com/dashboard).
2.  Vá em **SQL Editor**.
3.  Crie uma nova query e cole o conteúdo do arquivo `supabase/init_backend.sql`.
4.  Execute a query. Isso criará:
    *   Tabelas (`profiles`, `jobs`, `companies`, `job_applications`, `behavioral_tests`, etc).
    *   Políticas RLS (Segurança de acesso aos dados).
    *   Trigger `handle_new_user` (Criação automática de perfis ao registrar via Google/E-mail).

### 2. Servidor API (Node.js)

O servidor gerencia lógica complexa como o cálculo do Big Five.

1.  Entre na pasta `server`: `cd server`
2.  Instale as dependências: `npm install`
3.  Configure o arquivo `.env` com suas credenciais:
    ```env
    PORT=3001
    SUPABASE_URL=sua_url_do_supabase
    SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
    ```
4.  Inicie o servidor: `npm run dev`

---

## 🛠️ Endpoints Principais

*   `POST /api/auth/register`: Registro robusto de candidatos e empresas.
*   `POST /api/auth/login`: Autenticação via servidor.
*   `POST /api/tests/calculate`: Processa as respostas do teste comportamental e salva os resultados.
*   `GET /api/dashboard/metrics`: Retorna métricas para o painel da empresa.

---

## 🔐 Segurança

O sistema utiliza **RLS (Row Level Security)**. Isso significa que mesmo que alguém tenha acesso à URL do seu banco, ele só poderá ler/editar dados que as políticas permitirem (geralmente apenas os seus próprios dados).
