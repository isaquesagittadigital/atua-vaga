import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    console.log('--- Iniciando Configuração Automática ---');

    // 1. Criar coluna avatar_url se não existir
    console.log('1. Verificando/Criando coluna avatar_url...');
    try {
        // Usando rpc ou sql direto se possível, mas via js client é limitado.
        // Tentaremos um truque: se pudermos selecionar, a coluna existe.
        // Se falhar com erro de coluna inexistente, informaremos.
        const { error: colError } = await supabase.from('profiles').select('avatar_url').limit(1);
        if (colError && colError.message.includes('column "avatar_url" does not exist')) {
            console.log('Houve um erro: A coluna não existe. Infelizmente o cliente JS não pode criar colunas diretamente sem uma função RPC.');
            console.log('Por favor, execute este SQL no dashboard: ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;');
        } else {
            console.log('Coluna avatar_url presente ou verificada.');
        }
    } catch (e) {
        console.log('Aviso: Não foi possível verificar a coluna automaticamente.');
    }

    // 2. Criar Bucket
    console.log('\n2. Verificando/Criando Bucket "avatars"...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
        console.error('Erro ao listar buckets:', bucketError.message);
    } else {
        const hasBucket = buckets.find(b => b.id === 'avatars');
        if (!hasBucket) {
            const { error: createError } = await supabase.storage.createBucket('avatars', {
                public: true,
                fileSizeLimit: 5242880, // 5MB
                allowedMimeTypes: ['image/*']
            });
            if (createError) console.error('Erro ao criar bucket:', createError.message);
            else console.log('Bucket "avatars" criado com sucesso!');
        } else {
            console.log('Bucket "avatars" já existe.');
        }
    }

    console.log('\n--- Configuração Finalizada ---');
}

main();
