
import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search, ChevronDown, MapPin, DollarSign, Clock, Briefcase,
    ChevronRight, Calendar, ChevronLeft, ArrowRight
} from 'lucide-react';
import JobsFilterBar from '../components/jobs/JobsFilterBar';
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
    // New fields
    contract_type?: string;
    function_area?: string;
    is_pcd?: boolean;
    work_schedule?: string;
    seniority?: string;
    pcd_type?: string;
    created_at: string;
    // Augmented
    company?: string;
    match_score?: number;
    requirements?: string[];
}

const JobsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewAllMode, setViewAllMode] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sidebarPage, setSidebarPage] = React.useState(1);
    const ITEMS_PER_PAGE = 20;
    const SIDEBAR_ITEMS_PER_PAGE = 10;

    // Filter states
    const [filters, setFilters] = React.useState({
        location: '',
        type: [] as string[], // Modelo de trabalho (now array)
        salary: '',
        area: [] as string[],
        contract: [] as string[],
        pcd: false,
        startDate: '',
        endDate: '',
        work_schedule: [] as string[],
        seniority: [] as string[],
        pcd_type: [] as string[]
    });

    const handleViewAll = () => {
        setViewAllMode(true);
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToList = () => {
        setViewAllMode(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate pagination for View All mode
    const sortedJobs = React.useMemo(() => {
        if (!viewAllMode) return filteredJobs;
        return [...filteredJobs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [filteredJobs, viewAllMode]);

    const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
    const currentJobs = sortedJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [jobs, searchQuery, filters]);

    // Handle navigation state select
    useEffect(() => {
        const state = location.state as { selectedJobId?: string };
        if (state?.selectedJobId && jobs.length > 0) {
            const jobToSelect = jobs.find(j => j.id === state.selectedJobId);
            if (jobToSelect) {
                setSelectedJob(jobToSelect);
                // Clear state to avoid re-selecting on refresh if desired, or keep it.
                // navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [jobs, location.state]);

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
                const formattedJobs = data.map((job: any) => ({
                    ...job,
                    company: job.companies?.name || 'Empresa Confidencial',
                    match_score: Math.floor(Math.random() * 40) + 60, // Mock match score
                    requirements: job.requirements || ['Experiência com React', 'TypeScript', 'TailwindCSS'] // Fallback reqs
                }));
                setJobs(formattedJobs);
                setFilteredJobs(formattedJobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = jobs;

        // Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.company?.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query)
            );
        }

        // Filters
        // Filters
        if (filters.type.length > 0) {
            result = result.filter(job => filters.type.includes(job.type));
        }
        if (filters.contract.length > 0) {
            result = result.filter(job => job.contract_type && filters.contract.includes(job.contract_type));
        }
        if (filters.area.length > 0) {
            result = result.filter(job => job.function_area && filters.area.includes(job.function_area));
        }
        if (filters.work_schedule.length > 0) {
            result = result.filter(job => job.work_schedule && filters.work_schedule.includes(job.work_schedule));
        }
        if (filters.seniority.length > 0) {
            result = result.filter(job => job.seniority && filters.seniority.includes(job.seniority));
        }
        if (filters.pcd) {
            result = result.filter(job => job.is_pcd === true);
            if (filters.pcd_type.length > 0) {
                result = result.filter(job => job.pcd_type && filters.pcd_type.includes(job.pcd_type));
            }
        }

        // Date Range Logic
        if (filters.startDate || filters.endDate) {
            result = result.filter(job => {
                const jobDate = new Date(job.created_at).setHours(0, 0, 0, 0);
                const start = filters.startDate ? new Date(filters.startDate).setHours(0, 0, 0, 0) : null;
                const end = filters.endDate ? new Date(filters.endDate).setHours(0, 0, 0, 0) : null;

                if (start && jobDate < start) return false;
                if (end && jobDate > end) return false;
                return true;
            });
        }

        // TODO: Salary logic can be complex, adding simple version later

        setFilteredJobs(result);
    };

    // Base options configuration
    const BASE_OPTIONS = {
        area: ['Administração', 'Tecnologia', 'Marketing', 'Vendas', 'Design', 'Financeiro', 'Recursos Humanos', 'Engenharia', 'Logística', 'Produto', 'Dados', 'Infraestrutura', 'QA', 'Agile', 'Suporte', 'Mobile', 'Serviços Gerais', 'Limpeza', 'Atendimento', 'Saúde', 'Automotivo', 'Agro', 'Indústria', 'Turismo', 'Pesca', 'Educação', 'Jurídico'],
        contract: ['CLT', 'PJ', 'Estágio', 'Temporário', 'Autônomo'],
        schedule: ['Período Integral', 'Parcial manhãs', 'Parcial tardes', 'Parcial noites', 'Noturno'],
        seniority: ['Estagiário', 'Auxiliar', 'Assistente', 'Junior', 'Pleno', 'Senior', 'Especialista', 'Gerente'],
        pcdType: ['Auditiva', 'Fisica', 'Visual', 'Mental', 'Intelectual'],
        type: [
            { label: 'Presencial', value: 'onsite' },
            { label: 'Híbrido', value: 'hybrid' },
            { label: 'Remoto', value: 'remote' }
        ]
    };

    // Calculate dynamic counts
    const filterOptions = React.useMemo(() => {
        const counts = {
            area: {} as Record<string, number>,
            contract: {} as Record<string, number>,
            schedule: {} as Record<string, number>,
            seniority: {} as Record<string, number>,
            pcdType: {} as Record<string, number>,
            type: {} as Record<string, number>
        };

        // Initialize counts
        BASE_OPTIONS.area.forEach(opt => counts.area[opt] = 0);
        BASE_OPTIONS.contract.forEach(opt => counts.contract[opt] = 0);
        BASE_OPTIONS.schedule.forEach(opt => counts.schedule[opt] = 0);
        BASE_OPTIONS.seniority.forEach(opt => counts.seniority[opt] = 0);
        BASE_OPTIONS.pcdType.forEach(opt => counts.pcdType[opt] = 0);
        BASE_OPTIONS.type.forEach(opt => counts.type[opt.value] = 0);

        // Tally up
        jobs.forEach(job => {
            if (job.function_area && counts.area[job.function_area] !== undefined) counts.area[job.function_area]++;
            if (job.contract_type && counts.contract[job.contract_type] !== undefined) counts.contract[job.contract_type]++;
            if (job.work_schedule && counts.schedule[job.work_schedule] !== undefined) counts.schedule[job.work_schedule]++;
            if (job.seniority && counts.seniority[job.seniority] !== undefined) counts.seniority[job.seniority]++;
            if (job.pcd_type && counts.pcdType[job.pcd_type] !== undefined) counts.pcdType[job.pcd_type]++;
            if (job.type && counts.type[job.type] !== undefined) counts.type[job.type]++;
        });

        // Format for MegaMenu
        return {
            area: BASE_OPTIONS.area.map(val => ({ label: val, value: val, count: counts.area[val] || 0 })),
            contract: BASE_OPTIONS.contract.map(val => ({ label: val, value: val, count: counts.contract[val] || 0 })),
            schedule: BASE_OPTIONS.schedule.map(val => ({ label: val, value: val, count: counts.schedule[val] || 0 })),
            seniority: BASE_OPTIONS.seniority.map(val => ({ label: val, value: val, count: counts.seniority[val] || 0 })),
            pcdType: BASE_OPTIONS.pcdType.map(val => ({ label: val, value: val, count: counts.pcdType[val] || 0 })),
            type: BASE_OPTIONS.type.map(opt => ({ label: opt.label, value: opt.value, count: counts.type[opt.value] || 0 }))
        };
    }, [jobs]);


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 py-8">

                {/* Hero Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#F04E23] mb-3">
                        Encontre sua vaga aqui!
                    </h1>
                </div>

                {/* Filters */}
                <JobsFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    setFilters={setFilters}
                    options={filterOptions}
                />
                {!selectedJob && !viewAllMode && (
                    <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">

                        {/* Empty State */}
                        {filteredJobs.length === 0 && !loading && (
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-12 mb-12">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                                    <div className="flex-1 max-w-lg text-center md:text-left">
                                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                            Nenhuma vaga encontrada
                                        </h3>
                                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                                            Sem vagas disponíveis no momento? Não se desanime!
                                            Tente resetar os filtros, continue explorando as vagas disponíveis
                                            e candidate-se às <span className="text-[#F04E23] font-medium">oportunidades que despertam seu interesse</span>.
                                            Mantenha-se focado e continue avançando!
                                        </p>
                                        <button
                                            onClick={() => setFilters({
                                                location: '',
                                                type: [],
                                                salary: '',
                                                area: [],
                                                contract: [],
                                                pcd: false,
                                                startDate: '',
                                                endDate: '',
                                                work_schedule: [],
                                                seniority: [],
                                                pcd_type: []
                                            })}
                                            className="px-8 py-3 bg-[#F04E23] hover:bg-[#d63f15] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20"
                                        >
                                            Resetar filtros
                                        </button>
                                    </div>
                                    <div className="flex-1 w-full max-w-md flex justify-center">
                                        <img
                                            src="/vaga-vazia.svg"
                                            alt="Nenhuma vaga encontrada"
                                            className="w-full max-w-sm h-auto object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Job Lists */}
                        {filteredJobs.length > 0 && (
                            <div className="flex flex-col gap-12">
                                <JobSection
                                    title="Destaques para você"
                                    subtitle="Baseado no seu perfil"
                                    jobs={filteredJobs.slice(0, 3)}
                                    onSelect={setSelectedJob}
                                    onViewAll={handleViewAll}
                                />

                                <JobSection
                                    title="Vagas recentes"
                                    jobs={filteredJobs}
                                    onSelect={setSelectedJob}
                                    onViewAll={handleViewAll}
                                />

                                <JobSection
                                    title="Recomendadas para você"
                                    subtitle="Sugestões baseadas nas suas preferências"
                                    jobs={[...filteredJobs].reverse()}
                                    onSelect={setSelectedJob}
                                    onViewAll={handleViewAll}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* View All Grid Mode */}
                {!selectedJob && viewAllMode && (
                    <div className="pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Todas as Vagas</h2>
                                <p className="text-gray-500 text-sm">Mostrando {currentJobs.length} de {sortedJobs.length} vagas</p>
                            </div>
                            <button
                                onClick={handleBackToList}
                                className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#F04E23] transition-colors"
                            >
                                <ChevronLeft size={20} /> Voltar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                            {currentJobs.map(job => (
                                <JobGridCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="text-gray-600 font-medium">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Job Details Panel */}
                {selectedJob && (
                    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-300">
                        {/* Left Sidebar List (Desktop) */}
                        <div className="hidden lg:flex w-1/3 flex-col h-full bg-white rounded-l-2xl border-r border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#F04E23] transition-colors text-sm">
                                    <ChevronLeft size={18} /> Voltar para lista
                                </button>
                                <span className="text-xs font-medium text-gray-400">Vagas similares</span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                {filteredJobs
                                    .filter(j => j.id !== selectedJob.id) // Exclude current
                                    .slice((sidebarPage - 1) * SIDEBAR_ITEMS_PER_PAGE, sidebarPage * SIDEBAR_ITEMS_PER_PAGE)
                                    .map(job => (
                                        <div key={job.id} onClick={() => setSelectedJob(job)}>
                                            <JobGridCard job={job} onClick={() => { }} compact />
                                        </div>
                                    ))}
                            </div>

                            {/* Sidebar Pagination */}
                            {filteredJobs.length > SIDEBAR_ITEMS_PER_PAGE && (
                                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <button
                                        onClick={() => setSidebarPage(p => Math.max(1, p - 1))}
                                        disabled={sidebarPage === 1}
                                        className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-xs text-gray-500">
                                        {sidebarPage} / {Math.ceil((filteredJobs.length - 1) / SIDEBAR_ITEMS_PER_PAGE)}
                                    </span>
                                    <button
                                        onClick={() => setSidebarPage(p => Math.min(Math.ceil((filteredJobs.length - 1) / SIDEBAR_ITEMS_PER_PAGE), p + 1))}
                                        disabled={sidebarPage >= Math.ceil((filteredJobs.length - 1) / SIDEBAR_ITEMS_PER_PAGE)}
                                        className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            )}
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
                )}

            </main>
        </div >
    );
};

const JobSection: React.FC<{ title: string, subtitle?: string, jobs: Job[], onSelect: (j: Job) => void, onViewAll?: () => void }> = ({ title, subtitle, jobs, onSelect, onViewAll }) => (
    <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex items-end justify-between mb-8">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
            </div>
            {onViewAll && (
                <button
                    onClick={onViewAll}
                    className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-[#F04E23] transition-colors"
                >
                    Ver todas <ChevronRight size={16} />
                </button>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.slice(0, 3).map(job => (
                <JobGridCard key={job.id} job={job} onClick={() => onSelect(job)} />
            ))}
        </div>
    </section>
);

const JobGridCard: React.FC<{ job: Job, onClick: () => void, compact?: boolean }> = ({ job, onClick, compact }) => {
    const formatSalary = (min: number, max: number) => {
        if (!min && !max) return 'A combinar';
        return `R$ ${min || max}`;
    };

    const adherenceColor = (score: number) => {
        if (score >= 80) return 'text-blue-600 border-blue-200 bg-blue-50';
        if (score >= 50) return 'text-orange-600 border-orange-200 bg-orange-50';
        return 'text-red-600 border-red-200 bg-red-50';
    };

    const score = job.match_score || 70;

    return (
        <div
            onClick={onClick}
            className={`group relative bg-white rounded-xl border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full ${compact ? 'p-3' : 'p-5'}`}
        >
            {/* Header: Logo(mock) + Title + Company */}
            <div className="flex items-start gap-3 mb-4">
                <div className={`rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 ${compact ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-lg'}`}>
                    {job.company ? job.company.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className={`font-bold text-[#1E3A8A] group-hover:text-[#F04E23] transition-colors line-clamp-2 leading-tight ${compact ? 'text-sm' : 'text-lg'}`} title={job.title}>
                        {job.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1 truncate">{job.company}</p>
                </div>
            </div>

            {/* Info Icons */}
            <div className={`space-y-2 mb-4 flex-1 ${compact ? 'hidden' : 'block'}`}>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Briefcase size={14} className="text-blue-400 shrink-0" />
                    <span className="capitalize">{job.type === 'onsite' ? 'Presencial' : job.type === 'hybrid' ? 'Híbrido' : 'Remoto'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <DollarSign size={14} className="text-blue-400 shrink-0" />
                    <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock size={14} className="text-blue-400 shrink-0" />
                    <span>Período flexível</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Briefcase size={14} className="text-blue-400 shrink-0" />
                    <span>VR/VT</span>
                </div>
            </div>

            {/* Compact Info (for sidebar) */}
            {compact && (
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-gray-500 capitalize">{job.type}</span>
                    <span className="text-[10px] bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-gray-500">{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
            )}

            {/* Adherence Pill - Centered */}
            <div className={`w-full flex justify-center mb-4 ${compact ? 'mb-2' : ''}`}>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${adherenceColor(score)}`}>
                    {score}% de aderência
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                <span className="text-sm font-bold text-[#F04E23] group-hover:underline">
                    Ver mais
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    Há {Math.floor((new Date().getTime() - new Date(job.created_at).getTime()) / (1000 * 3600 * 24))} dias
                </span>
            </div>
        </div>
    );
};

export default JobsPage;
