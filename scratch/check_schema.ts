
import { supabase } from './src/lib/supabase';

async function checkSchema() {
  const { data, error } = await supabase.from('test_questions').select('*').limit(1);
  console.log('Question sample:', data);
}

checkSchema();
