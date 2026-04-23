
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function linkMember() {
  const userId = "ce83d17e-a669-46cc-b953-f5bf8d03b543"; // Devs Sagitta
  const companyId = "33a94187-f3ef-4fda-9b8b-9b7d02607fca"; // TechSales Go

  console.log("Linking user to company in company_members with role 'company_admin'...");
  const { error } = await supabase
    .from('company_members')
    .insert({
      company_id: companyId,
      user_id: userId,
      role: 'company_admin'
    });

  if (error) {
    console.error("Error linking member:", error.message);
  } else {
    console.log("Member successfully linked.");
  }
}

linkMember();
