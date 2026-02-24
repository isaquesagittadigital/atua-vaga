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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createCandidate() {
    const email = 'atualzdev@gmail.com';
    const password = '123456789';

    console.log(`Creating user: ${email}`);

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            role: 'candidate',
            name: 'Atualz Dev',
            cpf: '000.000.000-00',
            phone: '(00) 00000-0000'
        }
    });

    if (error) {
        console.error('Error creating user:', error.message);
        if (error.message.includes('already been registered')) {
            console.log('User already exists, checking profile...');
        } else {
            process.exit(1);
        }
    } else {
        console.log('User created successfully:', data.user?.id);
    }

    // Double check if profile exists
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (profileError) {
        console.error('Error fetching profile:', profileError.message);
    } else {
        console.log('Profile validated:', profile.id, 'Role:', profile.role);
    }
}

createCandidate();
