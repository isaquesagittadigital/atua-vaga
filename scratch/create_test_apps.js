
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestData() {
  // 1. Get some jobs
  const { data: jobs } = await supabase.from('jobs').select('id, title').limit(5);
  if (!jobs || jobs.length === 0) {
    console.log("No jobs found.");
    return;
  }

  // 2. Get some profiles
  const { data: profiles } = await supabase.from('profiles').select('id, full_name').limit(15);
  if (!profiles || profiles.length === 0) {
     console.log("No profiles found.");
     return;
  }

  // 3. Create applications
  const apps = [];
  for (const job of jobs) {
    const shuffled = [...profiles].sort(() => 0.5 - Math.random());
    const jobCandidates = shuffled.slice(0, 5);
    
    for (const candidate of jobCandidates) {
      apps.push({
        job_id: job.id,
        user_id: candidate.id, // Fixed: user_id
        match_score: Math.floor(Math.random() * 60) + 40,
        status: 'applied'
      });
    }
  }

  console.log(`Inserting ${apps.length} applications...`);
  const { error } = await supabase.from('job_applications').upsert(apps, { onConflict: 'job_id, user_id' });
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Success!");
  }
}

createTestData();
