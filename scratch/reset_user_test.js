
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetUserTest() {
  const userName = "Devs Sagitta";
  
  console.log(`Searching for user: ${userName}...`);
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name')
    .ilike('full_name', `%${userName}%`)
    .limit(1)
    .single();

  if (profileError || !profile) {
    console.error("User not found:", profileError?.message || "No match");
    return;
  }

  console.log(`Found user: ${profile.full_name} (${profile.id})`);
  
  console.log(`Deleting test results for user ${profile.id}...`);
  
  const { error: deleteError } = await supabase
    .from('candidate_test_results')
    .delete()
    .eq('user_id', profile.id);

  if (deleteError) {
    console.error("Error deleting results:", deleteError.message);
  } else {
    console.log("Test results successfully reset for user.");
  }
}

resetUserTest();
