
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkApplications() {
  const { data: apps, error } = await supabase
    .from('job_applications')
    .select(`
      id,
      match_score,
      job_id,
      candidate_id,
      profiles:candidate_id (full_name),
      jobs:job_id (title)
    `)
    .limit(10);
    
  if (error) {
    console.error(error);
  } else {
    console.log("Found applications:", JSON.stringify(apps, null, 2));
  }
}

checkApplications();
