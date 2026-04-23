import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JobCard from '../JobCard';
import CandidateRankingCard from './CandidateRankingCard';
import { supabase } from '@/lib/supabase';

const JobCandidatesPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [jobData, setJobData] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);

    useEffect(() => {
        const fetchJobAndCandidates = async () => {
            if (!id) return;
            setLoading(true);

            try {
                // 1. Fetch Job Details
                const { data: job, error: jobError } = await supabase
                    .from('jobs')
                    .select('*, companies(name, logo_url)')
                    .eq('id', id)
                    .single();

                if (jobError) throw jobError;
                setJobData(job);

                // 2. Fetch Applications with Profile info
                const { data: apps, error: appsError } = await supabase
                    .from('job_applications')
                    .select(`
                        id,
                        match_score,
                        profiles!job_applications_user_id_fkey (
                            id,
                            full_name,
                            avatar_url,
                            job_objective,
                            birth_date,
                            city,
                            state
                        )
                    `)
                    .eq('job_id', id)
                    .order('match_score', { ascending: false });

                if (appsError) throw appsError;

                const formattedCandidates = (apps || []).map((app: any) => {
                    const profile = app.profiles;
                    
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
                        id: app.id,
                        name: profile.full_name || 'Candidato Sem Nome',
                        role: profile.job_objective || 'Não especificado',
                        age: age > 0 ? age : 25,
                        location: profile.city && profile.state ? `${profile.city}, ${profile.state}` : 'Brasil',
                        matchPercentage: app.match_score || 0,
                        imgUrl: profile.avatar_url
                    };
                });

                setCandidates(formattedCandidates);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobAndCandidates();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#F04E23] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!jobData) {
        return (
            <div className="max-w-[1400px] w-full mx-auto px-6 py-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Vaga não encontrada</h2>
                <button onClick={() => navigate('/company/dashboard')} className="mt-4 text-[#F04E23] font-bold underline">Voltar para o Dashboard</button>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] w-full mx-auto px-6 py-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Minhas vagas</h1>
            <p className="text-gray-500 mb-8">Baseado no seu perfil, preferências e requisitos da vaga.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Job Details */}
                <div className="lg:col-span-1">
                    <JobCard
                        id={id}
                        title={jobData.title}
                        company={jobData.companies?.name || 'Sua Empresa'}
                        location={jobData.location || (jobData.is_remote ? 'Remoto' : 'Presencial')}
                        salary={jobData.salary_range || 'A combinar'}
                        contractType={jobData.contract_type || 'Não especificado'}
                        benefits="Confira na vaga"
                        postedAt={new Date(jobData.created_at).toLocaleDateString('pt-BR')}
                    />
                </div>

                {/* Right Column: Candidates Ranking */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Ranking</h2>
                        <p className="text-gray-500 mb-8">Confira abaixo o ranking dos melhores candidatos para essa vaga.</p>

                        <div className="flex flex-col gap-4">
                            {candidates.length > 0 ? (
                                candidates.map(candidate => (
                                    <React.Fragment key={candidate.id}>
                                        <CandidateRankingCard 
                                            {...candidate} 
                                            onView={() => navigate(`/company/candidates/${candidate.id}`)}
                                        />
                                        <div className="h-[1px] bg-gray-50 last:hidden"></div>
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 font-medium">Nenhuma candidatura recebida para esta vaga ainda.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCandidatesPage;
