
import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
    Search, ChevronDown, MapPin, DollarSign, Clock, Briefcase,
    ChevronRight, Calendar, ChevronLeft
} from 'lucide-react';
import JobDetailsPanel from '../components/jobs/JobDetailsPanel';

interface Job {
    id: string;
    title: string;
    company_id: string;
    description: string;
    location: string;
    type: string;
    salary_min: number;
    salary_max: number;
    status: string;
    created_at: string;
    // Augmented
    company?: string;
    match_score?: number;
    requirements?: string[];
}

const JobsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('jobs')
                .select(`*, companies(name)`)
                .eq('status', 'open')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                setJobs(data.map((job: any) => ({
                    ...job,
                    company: job.companies?.name || 'Empresa Confidencial',
                    match_score: Math.floor(Math.random() * 40) + 60, // Mock match score
                    requirements: job.requirements || ['Experiência com React', 'TypeScript', 'TailwindCSS'] // Fallback reqs
                })));
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900">
            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 py-12">

                {!selectedJob && (
                    <div className="flex flex-col items-center mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#F04E23] mb-8 text-center tracking-tight">
                            Encontre sua vaga aqui!
                        </h1>

                        {/* Search Bar */}
                        <div className="relative w-full max-w-2xl mb-6">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Pesquise pelo cargo, palavra-chave ou empresa"
                                className="w-full pl-14 pr-6 py-4 rounded-xl border border-gray-200 shadow-sm text-gray-700 bg-white focus:ring-4 focus:ring-[#F04E23]/10 focus:border-[#F04E23] outline-none transition-all placeholder:text-gray-400 font-medium"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Modelo de trabalho', 'Km de você', 'Publicação', 'Salário', 'Área', 'Contrato', 'PCD'].map((label) => (
                                <button key={label} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 font-medium text-sm hover:border-[#F04E23] hover:text-[#F04E23] transition-colors shadow-sm active:scale-95">
                                    {label}
                                    <ChevronDown size={14} />
                                </button>
                            ))}
                            <button className="px-4 py-2.5 bg-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors">
                                Resetar filtros
                            </button>
                        </div>
                    </div>
                )}

                {/* View Switching */}
                {selectedJob ? (
                    /* Detail View */
                    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-300">
                        {/* Left Sidebar List (Desktop) */}
                        <div className="hidden lg:block w-1/3 overflow-y-auto pr-2 custom-scrollbar pb-20">
                            <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-[#F04E23] transition-colors pl-1">
                                <ChevronLeft size={20} /> Voltar para lista
                            </button>
                            <div className="space-y-4">
                                {jobs.map(job => (
                                    <div
                                        key={job.id}
                                        onClick={() => setSelectedJob(job)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all group ${selectedJob.id === job.id ? 'border-[#F04E23] bg-orange-50 shadow-md' : 'border-gray-100 bg-white hover:border-orange-200 hover:shadow-sm'}`}
                                    >
                                        <h4 className={`font-bold text-lg mb-1 group-hover:text-[#F04E23] transition-colors ${selectedJob.id === job.id ? 'text-[#F04E23]' : 'text-gray-900'}`}>{job.title}</h4>
                                        <p className="text-sm text-gray-500 font-medium">{job.company}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Detail Panel */}
                        <div className="flex-1 h-full flex flex-col">
                            <div className="lg:hidden mb-4">
                                <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#F04E23] bg-white px-4 py-2 rounded-lg shadow-sm w-fit">
                                    <ChevronLeft size={20} /> Voltar
                                </button>
                            </div>
                            <JobDetailsPanel job={selectedJob} onClose={() => setSelectedJob(null)} />
                        </div>
                    </div>
                ) : (
                    /* Grid View */
                    <div className="space-y-16 pb-20">
                        {jobs.length === 0 && !loading && (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <p className="text-gray-400 text-lg">Nenhuma vaga encontrada no momento.</p>
                            </div>
                        )}

                        {jobs.length > 0 && (
                            <>
                                <JobSection title="Mais recentes" subtitle="Baseado no seu perfil, preferências e requisitos da vaga." jobs={jobs} onSelect={setSelectedJob} />
                                <JobSection title="Recomendadas para você" subtitle="Baseado no seu perfil, preferências e requisitos da vaga." jobs={[...jobs].reverse()} onSelect={setSelectedJob} />
                                <JobSection title="Contratação imediata" subtitle="Baseado no seu perfil, preferências e requisitos da vaga." jobs={jobs} onSelect={setSelectedJob} />
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

const JobSection: React.FC<{ title: string, subtitle?: string, jobs: Job[], onSelect: (j: Job) => void }> = ({ title, subtitle, jobs, onSelect }) => (
    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-end justify-between mb-8">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
            </div>
            <button className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-[#F04E23] transition-colors">
                Ver todas <ChevronRight size={16} />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.slice(0, 3).map(job => (
                <JobGridCard key={job.id} job={job} onClick={() => onSelect(job)} />
            ))}
        </div>
    </section>
);

const JobGridCard: React.FC<{ job: Job, onClick: () => void }> = ({ job, onClick }) => {
    const formatSalary = (min: number, max: number) => {
        if (!min && !max) return 'A combinar';
        return `R$ ${min || max}`;
    };

    const adherenceColor = (score: number) => {
        if (score >= 80) return 'bg-blue-50 text-blue-600 border-blue-100';
        if (score >= 50) return 'bg-orange-50 text-orange-600 border-orange-100';
        return 'bg-red-50 text-red-600 border-red-100';
    };

    const score = job.match_score || 70;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-[24px] border border-gray-200 p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:border-orange-200 transition-all cursor-pointer group flex flex-col justify-between h-full"
        >
            <div>
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 font-bold text-xl">
                        {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-lg text-[#1E3A8A] truncate group-hover:text-[#F04E23] transition-colors">{job.title}</h3>
                        <p className="text-gray-500 text-sm truncate font-medium">{job.company}</p>
                    </div>
                </div>

                <div className="space-y-2.5 mb-6 text-sm text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#5AB7F7]" />
                        <span className="capitalize">{job.type === 'onsite' ? 'Presencial' : job.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-[#5AB7F7]" />
                        <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#5AB7F7]" />
                        <span>Período flexível</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-[#5AB7F7]" />
                        <span>VR/VT</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className={`w-fit px-4 py-1.5 rounded-full text-center text-xs font-bold border mx-auto ${adherenceColor(score)}`}>
                    {score}% de aderência
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[#F04E23] font-bold text-sm hover:underline">Ver mais</span>
                    <div className="flex items-center gap-1 text-gray-400 text-xs font-medium">
                        <Calendar size={14} />
                        <span>1 dia atrás</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsPage;
