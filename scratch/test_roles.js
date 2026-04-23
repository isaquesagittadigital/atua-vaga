
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConstraints() {
  // Querying pg_constraint to get the exact check clause
  const { data, error } = await supabase.rpc('get_table_constraints', { t_name: 'profiles' });
  
  // Since I don't know if get_table_constraints exists, I'll try a raw query via postgrest if possible
  // Actually, I can't run arbitrary SQL via postgrest.
  
  // I'll try to insert a dummy row with various roles to see which ones fail.
  const rolesToTest = ['candidate', 'company', 'company_admin', 'company_user', 'admin', 'super_admin'];
  
  console.log("Testing role values against profiles table...");
  
  for (const r of rolesToTest) {
    // We try to update the user's role to each one.
    // We expect them to fail if the constraint doesn't allow it.
    const { error } = await supabase
      .from('profiles')
      .update({ role: r })
      .eq('id', 'ce83d17e-a669-46cc-b953-f5bf8d03b543');

    if (error && error.code === '23514') {
      console.log(`- Role '${r}': REJECTED by check constraint`);
    } else if (error) {
       console.log(`- Role '${r}': Failed with other error: ${error.message} (${error.code})`);
    } else {
      console.log(`- Role '${r}': ACCEPTED`);
    }
  }
}

checkConstraints();
