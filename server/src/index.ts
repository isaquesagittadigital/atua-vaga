import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from './middleware/auth';
import { supabaseAdmin } from './config/supabase';
import { isValidCPF, isValidPassword } from './utils/validators';


import { validateRegistration, register, login } from './controllers/authController';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes

// Public Auth Routes
app.post('/api/auth/validate', validateRegistration);
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

app.post('/api/jobs', requireAuth, async (req, res) => {
    try {
        const user = (req as any).user;
        const { title, description, location, type, salary_range, status } = req.body;

        const { data, error } = await supabaseAdmin
            .from('jobs')
            .insert({
                company_id: user.id,
                title,
                description,
                location,
                type,
                salary_range,
                status: status || 'active'
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error: any) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: error.message || 'Error creating job' });
    }
});

app.get('/api/jobs', requireAuth, async (req, res) => {
    try {
        const user = (req as any).user;

        const { data, error } = await supabaseAdmin
            .from('jobs')
            .select('*')
            .eq('company_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (error: any) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: error.message || 'Error fetching jobs' });
    }
});

app.get('/api/dashboard/metrics', requireAuth, async (req, res) => {
    try {
        const user = (req as any).user;

        // Fetch counts from Supabase
        const { count: totalJobs, error: errorTotal } = await supabaseAdmin
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', user.id);

        const { count: activeJobs, error: errorActive } = await supabaseAdmin
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', user.id)
            .eq('status', 'active');

        // Assuming 'closed' status exists, or we define it now
        const { count: closedJobs, error: errorClosed } = await supabaseAdmin
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', user.id)
            .eq('status', 'closed');

        if (errorTotal || errorActive || errorClosed) throw new Error('Error fetching metrics');

        res.json({
            openJobs: activeJobs || 0,
            closedJobs: closedJobs || 0,
            inProgressJobs: 0, // Placeholder
            totalJobs: totalJobs || 0,
            hired: 0, // Placeholder
            talentPool: 0 // Placeholder
        });
    } catch (error: any) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({ error: error.message || 'Error fetching metrics' });
    }
});

app.get('/api/candidates/matches', requireAuth, async (req, res) => {
    try {
        // In a real scenario, this would query a 'candidates' table and run a matching algorithm.
        // For now, we move the mock data to the backend to centralize the API contract.
        const mockCandidates = [
            { id: 1, role: 'Pessoa Recursos Humanos', matchPercentage: 90, companyRef: 'Digital Marketing Experts S/A' },
            { id: 2, role: 'Pessoa Recursos Humanos', matchPercentage: 90, companyRef: 'Digital Marketing Experts S/A' },
            { id: 3, role: 'Analista de RH', matchPercentage: 85, companyRef: 'Tech Solutions Inc.' }
        ];

        res.json(mockCandidates);
    } catch (error: any) {
        res.status(500).json({ error: 'Error fetching candidates' });
    }
});

app.post('/api/company/onboarding', requireAuth, async (req, res) => {
    try {
        const user = (req as any).user;
        const onboardingData = req.body;

        // In a real app, we would upsert this into a 'company_profiles' table
        // For now, we will just log it and return success to simulate the flow
        console.log(`Onboarding data received for user ${user.id}:`, onboardingData);

        // Example DB call (commented out until table exists):
        /*
        const { error } = await supabaseAdmin
            .from('company_profiles')
            .upsert({ user_id: user.id, ...onboardingData });
        if (error) throw error;
        */

        res.status(200).json({ message: 'Onboarding data saved successfully' });
    } catch (error: any) {
        console.error('Error saving onboarding data:', error);
        res.status(500).json({ error: 'Failed to save onboarding data' });
    }
});

app.get('/', (req, res) => {
    res.send('Atua Vaga API is running');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
