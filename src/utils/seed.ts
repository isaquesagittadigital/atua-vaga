import { supabase } from '../lib/supabase';

// Helper to seed data if empty
export const seedJobs = async () => {
    const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true });

    if (count === 0) {
        // Get a user to be the owner (company)
        const { data: { user } } = await supabase.auth.getUser();

        // Check if user exists, if not we can't really seed unless we have a user ID.
        // For this demo, let's assume the current logged in user creates them.
        if (!user) return;

        // Ensure user has a profile
        // (This is handled by trigger but just to be safe)

        await supabase.from('jobs').insert([
            {
                company_id: user.id,
                title: 'Analista de Sistemas Jr',
                description: 'Desenvolvimento de software...',
                location: 'São Paulo, SP (Híbrido)',
                type: 'CLT',
                salary_range: 'R$ 4.000 - R$ 5.000',
                status: 'active'
            },
            {
                company_id: user.id,
                title: 'Designer UI/UX Pleno',
                description: 'Criação de interfaces...',
                location: 'Remoto',
                type: 'PJ',
                salary_range: 'R$ 6.000 - R$ 8.000',
                status: 'active'
            },
            {
                company_id: user.id,
                title: 'Gerente de Projetos',
                description: 'Gestão de times ágeis...',
                location: 'Rio de Janeiro, RJ',
                type: 'CLT',
                salary_range: 'A combinar',
                status: 'active'
            }
        ]);

        console.log("Database seeded with sample jobs!");
    }
};
