import React, { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
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
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchJobs();
    }, [session]);

    const fetchJobs = async () => {
        if (!session) return;

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

            // Fetch jobs
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

    // Filter jobs by search term
    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <p className="text-sm text-gray-500">Baseado no seu perfil, preferências e requisitos da vaga.</p>
                
                {/* Search Input */}
                <div className="relative w-full md:w-[400px]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input 
                        type="text"
                        placeholder="Buscar vaga pelo nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#F04E23] focus:ring-1 focus:ring-[#F04E23]/20 transition-all text-sm font-medium shadow-sm"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F04E23]"></div>
                </div>
            ) : filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">
                        {searchTerm ? 'Nenhuma vaga encontrada para sua busca' : 'Nenhuma vaga encontrada'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm ? 'Tente buscar com outros termos.' : 'Comece criando sua primeira vaga para encontrar talentos.'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => navigate('/company/jobs/new')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Criar vaga agora
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredJobs.map((job) => (
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
