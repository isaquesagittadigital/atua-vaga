import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JobCard from './JobCard';
import { useAuth } from '../../../../src/contexts/AuthContext';

const JobsListPage: React.FC = () => {
    const navigate = useNavigate();
    const { session } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, [session]);

    const fetchJobs = async () => {
        if (!session) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${apiUrl}/jobs`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch jobs');

            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error loading jobs:', error);
        } finally {
            setLoading(false);
        }
    };

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
                            company="Sua Empresa" // We can fetch company name later or store in user metadata
                            location={job.location}
                            salary={job.salary_range}
                            contractType={job.type}
                            benefits="Benefícios (Ver detalhes)" // Placeholder or add to DB schema
                            postedAt={new Date(job.created_at).toLocaleDateString('pt-BR')}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default JobsListPage;
