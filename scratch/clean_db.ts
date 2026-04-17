
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanData() {
  console.log('Cleaning all candidate test results...');
  // Since we are using anon key, this might fail if RLS is enabled for DELETE.
  // However, I will try.
  const { data, error } = await supabase
    .from('candidate_test_results')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); 

  if (error) {
    console.error('Error cleaning data (likely RLS):', error.message);
  } else {
    console.log('Successfully cleaned all test results.');
  }
}

cleanData();
