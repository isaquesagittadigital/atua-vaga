
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testColumn() {
  const { data, error } = await supabase.from('companies').select('size').limit(1);
  if (error) {
    console.error("Column 'size' failed:", error.message);
    const { data: d2, error: e2 } = await supabase.from('companies').select('company_size').limit(1);
    if (e2) {
      console.error("Column 'company_size' failed:", e2.message);
    } else {
      console.log("Column 'company_size' EXISTS.");
    }
  } else {
    console.log("Column 'size' EXISTS.");
  }
}

testColumn();
