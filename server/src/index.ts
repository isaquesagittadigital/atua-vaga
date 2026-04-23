import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from './middleware/auth';
import { supabaseAdmin } from './config/supabase';
import { isValidCPF, isValidPassword } from './utils/validators';


import { validateRegistration, register, login } from './controllers/authController';
import { calculateBehavioralScore } from './controllers/testController';

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

// Protected Test Routes
app.post('/api/tests/calculate', requireAuth, calculateBehavioralScore);

app.post('/api/jobs', requireAuth, async (req, res) => {
    try {
        const company = (req as any).company;

        if (!company) {
            return res.status(403).json({ error: 'Only companies can create jobs' });
        }

        const { title, description, location, type, salary_range, status, requirements_json, screening_questions } = req.body;

        // Parse salary_range into numeric min/max
        let salary_min = null;
        let salary_max = null;

        if (salary_range) {
            const cleanSalary = salary_range.replace(/[R$\s.]/g, '').replace(',', '.');
            if (cleanSalary.includes('-')) {
                const parts = cleanSalary.split('-');
                salary_min = parseFloat(parts[0]);
                salary_max = parseFloat(parts[1]);
            } else {
                salary_min = parseFloat(cleanSalary);
                salary_max = salary_min;
            }
        }

        const { data, error } = await supabaseAdmin
            .from('jobs')
            .insert({
                company_id: company.id,
                title,
                description,
                location,
                type,
                salary_range,
                salary_min,
                salary_max,
                status: status || 'active',
                requirements_json,
                screening_questions
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

app.patch('/api/jobs/:id', requireAuth, async (req, res) => {
    try {
        const company = (req as any).company;
        const { id } = req.params;

        if (!company) {
            return res.status(403).json({ error: 'Company access required' });
        }

        // Verify ownership
        const { data: job, error: fetchError } = await supabaseAdmin
            .from('jobs')
            .select('company_id')
            .eq('id', id)
            .single();

        if (fetchError || !job || job.company_id !== company.id) {
            return res.status(403).json({ error: 'Unauthorized to update this job' });
        }

        const { title, description, location, type, salary_range, status, requirements_json, screening_questions } = req.body;

        // Parse salary_range into numeric min/max
        let salary_min = null;
        let salary_max = null;

        if (salary_range) {
            const cleanSalary = salary_range.replace(/[R$\s.]/g, '').replace(',', '.');
            if (cleanSalary.includes('-')) {
                const parts = cleanSalary.split('-');
                salary_min = parseFloat(parts[0]);
                salary_max = parseFloat(parts[1]);
            } else {
                salary_min = parseFloat(cleanSalary);
                salary_max = salary_min;
            }
        }

        const { data, error } = await supabaseAdmin
            .from('jobs')
            .update({
                title,
                description,
                location,
                type,
                salary_range,
                salary_min,
                salary_max,
                status,
                requirements_json,
                screening_questions
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Notify candidates who applied or saved the job
        try {
            // 1. Get all affected users
            const [appsRes, savedRes] = await Promise.all([
                supabaseAdmin.from('job_applications').select('user_id').eq('job_id', id),
                supabaseAdmin.from('saved_jobs').select('user_id').eq('job_id', id)
            ]);

            const userIds = new Set([
                ...(appsRes.data?.map(a => a.user_id) || []),
                ...(savedRes.data?.map(s => s.user_id) || [])
            ]);

            if (userIds.size > 0) {
                const notifications = Array.from(userIds).map(uid => ({
                    user_id: uid,
                    title: 'Vaga Atualizada',
                    message: `A vaga "${title}" da empresa ${(req as any).company.name} recebeu novas atualizações. Confira os detalhes!`,
                    type: 'info',
                    read: false,
                    link: `/app/jobs?id=${id}`
                }));

                await supabaseAdmin.from('notifications').insert(notifications);
            }
        } catch (notifError) {
            console.error('Error sending update notifications:', notifError);
            // Don't fail the request if notifications fail
        }

        res.json(data);
    } catch (error: any) {
        console.error('Error updating job:', error);
        res.status(500).json({ error: error.message || 'Error updating job' });
    }
});

app.delete('/api/jobs/:id', requireAuth, async (req, res) => {
    try {
        const company = (req as any).company;
        const { id } = req.params;

        if (!company) {
            return res.status(403).json({ error: 'Company access required' });
        }

        // Verify ownership
        const { data: job, error: fetchError } = await supabaseAdmin
            .from('jobs')
            .select('company_id')
            .eq('id', id)
            .single();

        if (fetchError || !job || job.company_id !== company.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this job' });
        }

        const { error } = await supabaseAdmin
            .from('jobs')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(204).send();
    } catch (error: any) {
        console.error('Error deleting job:', error);
        res.status(500).json({ error: error.message || 'Error deleting job' });
    }
});

app.get('/api/jobs', requireAuth, async (req, res) => {
    try {
        const company = (req as any).company;

        if (!company) {
            // If candidate, maybe show all active jobs?
            // For now, let's assume this endpoint is for COMPANY DASHBOARD.
            // Accessing public jobs should probably be /api/public/jobs or /api/jobs/search
            return res.status(403).json({ error: 'Company access required' });
        }

        const { data, error } = await supabaseAdmin
            .from('jobs')
            .select('*')
            .eq('company_id', company.id)
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
        const company = (req as any).company;

        if (!company) {
            return res.status(403).json({ error: 'Company access required' });
        }

        // Fetch counts from Supabase
        const { count: totalJobs, error: errorTotal } = await supabaseAdmin
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id);

        const { count: activeJobs, error: errorActive } = await supabaseAdmin
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id)
            .eq('status', 'active');

        // Assuming 'closed' status exists, or we define it now
        const { count: closedJobs, error: errorClosed } = await supabaseAdmin
            .from('jobs')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id)
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
        const company = (req as any).company;
        if (!company) {
            return res.status(403).json({ error: 'Company access required' });
        }

        // 1. Fetch applications for jobs owned by this company
        const { data: apps, error } = await supabaseAdmin
            .from('job_applications')
            .select(`
                id,
                job_id,
                jobs!inner (
                    id,
                    title,
                    company_id
                ),
                profiles!inner (
                    id,
                    full_name,
                    avatar_url,
                    job_objective,
                    birth_date,
                    city,
                    state
                )
            `)
            .eq('jobs.company_id', company.id)
            .limit(10);

        if (error) throw error;

        // 2. Format the response to match CandidateMatchCard props
        const candidates = (apps || []).map((app: any) => {
            // Supabase may return it under the table name or the alias
            const profile = app.profiles || app.profiles_user_id || {};
            
            // Calculate age
            let age = 0;
            if (profile.birth_date) {
                const birth = new Date(profile.birth_date);
                const today = new Date();
                age = today.getFullYear() - birth.getFullYear();
                const m = today.getMonth() - birth.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }
            }

            return {
                id: profile.id,
                role: profile.job_objective || 'Candidato',
                matchPercentage: app.match_score || 0,
                companyRef: profile.full_name || 'Usuário',
                location: profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Brasil',
                imgUrl: profile.avatar_url,
                age: age > 0 ? age : 25
            };
        });

        console.log(`Returning ${candidates.length} candidates for company ${company.id}`);

        res.json(candidates);
    } catch (error: any) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Error fetching candidates' });
    }
});

app.get('/', (req, res) => {
    res.send('Atua Vaga API is running');
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

export default app;
