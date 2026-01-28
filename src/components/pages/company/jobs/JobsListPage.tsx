import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JobCard from './JobCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const JobsListPage: React.FC = () => {
    const navigate = useNavigate();
    const { session } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState<string>('');
    const [companyLogo, setCompanyLogo] = useState<string>('');

    useEffect(() => {
        fetchJobs();
    }, [session]);

    const fetchJobs = async () => {
        if (!session) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

            // 1. Fetch Company Details (Name/Logo) based on user ID
            // Assuming we have a way to get company info. For now, query supabase directly or assuming the API returns it?
            // Let's try to get it from the 'companies' table linked to 'owner_id' (user.id)
            // Or if we can't query directly here, we might need a separate call.
            // Let's assume we can query supabase client here since we use it elsewhere, NOT JUST the REST API.
            // But wait, this file uses valid 'fetch' to an API... okay.
            // Let's see if we can get the company name from the API response?
            // If the API /jobs doesn't return company info, we might need to fetch profile.

            // OPTION A: Add supabase client import and fetch profile
            /* 
               import { supabase } from '../../../../src/lib/supabase'; 
            */
            // But let's stick to the pattern if possible.
            // Actually, let's just fetch the company for the current user using Supabase client to be safe and quick.

            // Importing supabase dynamically or assuming it's available?
            // It is available in '../src/lib/supabase' usually.

            // Fetch jobs
            const response = await fetch(`${apiUrl}/jobs`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch jobs');
            const data = await response.json();
            setJobs(data);

            // Fetch Company Info (Name)
            // We need to import supabase at the top. 
            // Since I can't easily add imports without seeing the top, I'll rely on a separate useEffect or assume I can add it.
            // Wait, I can't add imports easily with multi_replace if headers are complex.
            // However, I see `useAuth` is used.
            // Let's try to set the company name from the `user` metadata if available, or just fetch it.

            // Let's assume the API /jobs returns jobs for THIS company.
            // The company name is the user's company.
            if (session.user.user_metadata?.full_name) {
                setCompanyName(session.user.user_metadata.full_name);
            }
            // Better: Join/Fetch from companies table.

        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add effect to fetch company name from Supabase directly
    useEffect(() => {
        const fetchCompanyProfile = async () => {
            if (!session?.user?.id) return;

            try {
                const { data, error } = await supabase
                    .from('companies')
                    .select('name, logo_url')
                    .eq('owner_id', session.user.id)
                    .single();

                if (data) {
                    setCompanyName(data.name);
                    setCompanyLogo(data.logo_url);
                }
            } catch (err) {
                console.error("Error fetching company profile:", err);
            }
        };
        fetchCompanyProfile();
    }, [session]);

    return (
        <div className="max-w-[1400px] w-full mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-black text-gray-900">Minhas vagas</h1>
                <button
                    onClick={() => navigate('/company/jobs/new')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                    <Plus size={20} />
                    Cadastrar vaga
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-10">Baseado no seu perfil, preferências e requisitos da vaga.</p>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F04E23]"></div>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Nenhuma vaga encontrada</h3>
                    <p className="text-gray-500 mb-6">Comece criando sua primeira vaga para encontrar talentos.</p>
                    <button
                        onClick={() => navigate('/company/jobs/new')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Criar vaga agora
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            id={job.id}
                            title={job.title}
                            company={companyName || "Sua Empresa"} // Dynamic Company Name
                            location={job.location}
                            salary={job.salary_range}
                            contractType={job.type}
                            benefits="Benefícios (Ver detalhes)"
                            postedAt={new Date(job.created_at).toLocaleDateString('pt-BR')}
                            logoUrl={companyLogo}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobsListPage;
