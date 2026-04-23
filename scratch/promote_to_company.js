
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeUserCompanyOwner() {
  const userId = "ce83d17e-a669-46cc-b953-f5bf8d03b543"; // Devs Sagitta
  
  console.log("Updating user role to company_admin...");
  const { error: roleError } = await supabase
    .from('profiles')
    .update({ role: 'company_admin' })
    .eq('id', userId);

  if (roleError) {
    console.error("Error updating role:", roleError.message);
    return;
  }

  // Create or identify a main company
  console.log("Identifying company 'TechSales Go' to be the owner of all jobs...");
  const { data: company, error: companyError } = await supabase
    .from('companies')
    .select('id')
    .ilike('name', '%TechSales Go%')
    .limit(1)
    .single();

  if (companyError || !company) {
    console.error("TechSales Go not found, creating a new company 'Sagitta Digital'...");
    const { data: newCompany, error: createError } = await supabase
      .from('companies')
      .insert({
        name: 'Sagitta Digital',
        document: '00.000.000/0001-00',
        description: 'Empresa líder em soluções digitais.'
      })
      .select()
      .single();
      
    if (createError) {
      console.error("Error creating company:", createError.message);
      return;
    }
    var targetCompanyId = newCompany.id;
  } else {
    var targetCompanyId = company.id;
  }

  console.log(`Using company ID: ${targetCompanyId}`);

  // Associate user with company
  console.log("Linking user to company in company_members...");
  const { error: memberError } = await supabase
    .from('company_members')
    .insert({
      company_id: targetCompanyId,
      user_id: userId,
      role: 'admin'
    });

  if (memberError) {
    console.error("Error linking member:", memberError.message);
    // If it already exists, that's fine
  }

  // Associate all jobs with this company
  console.log("Updating all jobs to be owned by this company...");
  const { error: jobsUpdateError } = await supabase
    .from('jobs')
    .update({ company_id: targetCompanyId })
    .not('id', 'is', null); // Update all

  if (jobsUpdateError) {
    console.error("Error updating jobs:", jobsUpdateError.message);
  } else {
    console.log("All jobs successfully associated with the user's company.");
  }
}

makeUserCompanyOwner();
