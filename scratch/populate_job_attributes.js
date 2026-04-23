
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzlrzlfpetifmqqcijvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bHJ6bGZwZXRpZm1xcWNpanZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODM1MTUsImV4cCI6MjA4NDc1OTUxNX0.AHaUPIFZgtGbSjknC7Vg9RvaeJ7DHRAI9YgJA8tu9yk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function populate() {
    console.log("Starting population of job attributes...");

    // 1. Professional Areas
    const areas = [
        'Tecnologia', 'Varejo / Comércio', 'Indústria', 'Serviços', 
        'Saúde', 'Educação', 'Construção Civil', 'Logística', 
        'Agronegócio', 'Financeiro', 'Marketing', 'Recursos Humanos'
    ];

    for (const name of areas) {
        await supabase.from('professional_areas').upsert({ name }, { onConflict: 'name' });
    }
    console.log("Professional areas populated.");

    // 2. Seniority Levels
    const levels = ['Estágio', 'Assistente', 'Analista', 'Especialista', 'Supervisor', 'Gerente', 'Diretor', 'Sócio'];
    for (const name of levels) {
        await supabase.from('seniority_levels').upsert({ name }, { onConflict: 'name' });
    }
    console.log("Seniority levels populated.");

    // 3. Work Schedules
    const schedules = [
        'Período Integral (08:00 - 18:00)', 
        'Meio Período (Manhã)', 
        'Meio Período (Tarde)', 
        'Escala 6x1', 
        'Escala 5x2', 
        'Escala 12x36', 
        'Jornada Flexível'
    ];
    for (const name of schedules) {
        await supabase.from('work_schedules').upsert({ name }, { onConflict: 'name' });
    }
    console.log("Work schedules populated.");

    // 4. Specializations
    const { data: areaData } = await supabase.from('professional_areas').select('id, name');
    
    const specsMap = {
        'Tecnologia': ['Desenvolvimento Front-end', 'Desenvolvimento Back-end', 'Full-stack Developer', 'Mobile Developer', 'UI/UX Design', 'Data Science / AI', 'DevOps / Cloud', 'Cibersegurança'],
        'Marketing': ['Social Media', 'Copywriting', 'Tráfego Pago', 'SEO', 'Branding'],
        'Varejo / Comércio': ['Gestão de Loja', 'Atendimento ao Cliente', 'Vendas Internas', 'Visual Merchandising', 'Prevenção de Perdas'],
        'Indústria': ['Operador de Produção', 'Manutenção Industrial', 'Qualidade', 'Engenharia de Produção', 'Segurança do Trabalho'],
        'Saúde': ['Enfermagem', 'Medicina', 'Fisioterapia', 'Psicologia', 'Técnico de Enfermagem'],
        'Financeiro': ['Contabilidade', 'Tesouraria', 'Análise de Crédito', 'Auditoria', 'Planejamento Financeiro'],
        'Recursos Humanos': ['Recrutamento e Seleção', 'Departamento Pessoal', 'Treinamento e Desenvolvimento', 'Cargos e Salários', 'Business Partner']
    };

    for (const area of areaData) {
        const specs = specsMap[area.name];
        if (specs) {
            const insertData = specs.map(name => ({ area_id: area.id, name }));
            await supabase.from('specializations').upsert(insertData, { onConflict: 'area_id, name' });
        }
    }
    console.log("Specializations populated.");

    // 5. Experience Levels
    const expLevels = ['Sem experiência', 'Menos de 1 ano', '1 a 2 anos', '2 a 3 anos', '3 a 5 anos', 'Mais de 5 anos'];
    for (const name of expLevels) {
        await supabase.from('experience_levels').upsert({ name }, { onConflict: 'name' });
    }
    console.log("Experience levels populated.");

    // 6. Genders
    const genders = ['Masculino', 'Feminino', 'Ambos'];
    for (const name of genders) {
        await supabase.from('genders').upsert({ name }, { onConflict: 'name' });
    }
    console.log("Genders populated.");

    // 7. Education Levels
    const eduLevels = ['Ensino Fundamental', 'Ensino Médio', 'Ensino Técnico', 'Ensino Superior (Incompleto)', 'Ensino Superior (Completo)', 'Pós-graduação / MBA', 'Mestrado / Doutorado'];
    for (const name of eduLevels) {
        await supabase.from('education_levels').upsert({ name }, { onConflict: 'name' });
    }
    console.log("Education levels populated.");

    console.log("Done!");
}

populate();
