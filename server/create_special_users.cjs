const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAccounts() {
    const usersToCreate = [
        {
            email: 'atualzempresa@gmail.com',
            password: '123456789',
            role: 'company',
            name: 'Empresa Atua Vaga'
        },
        {
            email: 'atualzadmin@gmail.com',
            password: '123456789',
            role: 'admin',
            name: 'Admin Atua Vaga'
        }
    ];

    // Buscar todos os usuários primeiro para evitar erros de criação
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('Erro ao listar usuários:', listError.message);
        return;
    }

    for (const userData of usersToCreate) {
        console.log(`\n--- Processando usuário: ${userData.email} ---`);

        let userId;
        const existingUser = listData.users.find(u => u.email === userData.email);

        if (existingUser) {
            console.log('Usuário já existe no Auth.');
            userId = existingUser.id;
        } else {
            console.log('Criando novo usuário no Auth...');
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: userData.email,
                password: userData.password,
                email_confirm: true,
                user_metadata: { full_name: userData.name, role: userData.role }
            });

            if (authError) {
                console.error('Erro ao criar no Auth:', authError.message);
                continue;
            }
            userId = authData.user.id;
        }

        console.log('ID do Usuário:', userId);

        // 2. Atualizar/Inserir no Profiles
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: userData.email,
                role: userData.role,
                full_name: userData.name,
                name: userData.name
            });

        if (profileError) {
            console.error('Erro ao criar/atualizar perfil:', profileError.message);
        } else {
            console.log(`Perfil de ${userData.role} configurado com sucesso.`);
        }

        // 3. Lógica específica para Empresa
        if (userData.role === 'company') {
            const { data: compData, error: compErr } = await supabase
                .from('companies')
                .upsert({
                    owner_id: userId,
                    name: 'Atua Vaga Soluções',
                    industry: 'Tecnologia',
                    location: 'Brasil',
                    document: '00.000.000/0001-00'
                })
                .select()
                .maybeSingle();

            if (compErr) {
                console.error('Erro na empresa:', compErr.message);
            } else if (compData) {
                console.log('Empresa vinculada:', compData.name);
                const { error: memErr } = await supabase
                    .from('company_members')
                    .upsert({
                        company_id: compData.id,
                        user_id: userId,
                        role: 'company_admin'
                    });
                if (memErr) console.error('Erro no vínculo de membro:', memErr.message);
                else console.log('Membro administrador vinculado.');
            }
        }
    }

    console.log('\nProcesso finalizado!');
}

createAccounts();
