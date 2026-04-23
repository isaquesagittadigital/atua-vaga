import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'jobs' });
    if (error) {
        // Fallback to a simple select to see keys
        const { data: firstRow } = await supabase.from('jobs').select('*').limit(1).single();
        console.log("First row keys:", Object.keys(firstRow || {}));
    } else {
        console.log("Columns:", data);
    }
}

checkSchema();
