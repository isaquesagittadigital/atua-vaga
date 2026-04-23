
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getDetailedJobOwners() {
  console.log("Fetching jobs and their associated company owners...");
  
  // Fetch jobs, companies, and their members (users)
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      company_id,
      companies (
        id,
        name,
        company_members (
          user_id,
          role,
          profiles (
            full_name,
            email
          )
        )
      )
    `);

  if (jobsError) {
    console.error("Error fetching data:", jobsError.message);
    return;
  }

  if (!jobs || jobs.length === 0) {
    console.log("No jobs found.");
    return;
  }

  const companiesProcessed = new Set();

  console.log("\n--- List of Jobs and Owners ---");
  jobs.forEach(job => {
    const company = job.companies;
    console.log(`\nVaga: "${job.title}"`);
    if (company) {
      console.log(`Empresa: ${company.name}`);
      const members = company.company_members;
      if (members && members.length > 0) {
        console.log(`Usuários vinculados:`);
        members.forEach(member => {
          const profile = member.profiles;
          console.log(`  - ${profile?.full_name || 'Sem nome'} (${profile?.email}) [Cargo: ${member.role}]`);
        });
      } else {
        console.log(`  - Nenhum usuário vinculado encontrado.`);
      }
    } else {
      console.log(`Empresa: DESCONHECIDA (ID: ${job.company_id})`);
    }
  });
}

getDetailedJobOwners();
