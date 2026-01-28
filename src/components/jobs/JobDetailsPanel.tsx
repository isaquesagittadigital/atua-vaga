import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Clock, Briefcase, Calendar, CheckCircle2, Share2, Bookmark, Flag, HelpCircle } from 'lucide-react';
import { ReportFormModal, ReportSuccessModal, LowMatchModal, BehavioralTestModal } from './JobModals';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Job {
    id: string;
    title: string;
    company_name?: string;
    description: string;
    requirements?: string[];
    location: string;
    salary_min: number;
    salary_max: number;
    type: string;
    created_at: string;
    status: string;
    match_score?: number;
}

interface JobDetailsPanelProps {
    job: Job | null;
    onClose: () => void; // For mobile
    isApplied?: boolean;
    onCancelApplication?: () => void;
    onBehavioralTest?: () => void;
}

const JobDetailsPanel: React.FC<JobDetailsPanelProps> = ({ job, onClose, isApplied = false, onCancelApplication, onBehavioralTest }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'competition'>('details');

    // Modal States
    const [showReportForm, setShowReportForm] = useState(false);
    const [showReportSuccess, setShowReportSuccess] = useState(false);
    const [showApplyWarning, setShowApplyWarning] = useState(false); // Can swap this with BehavioralTestModal for testing
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (job && user) {
            checkIfSaved();
        }
    }, [job, user]);

    const checkIfSaved = async () => {
        if (!job || !user) return;
        const { data } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', job.id)
            .single();
        setIsSaved(!!data);
    };

    const handleToggleSave = async () => {
        if (!user) {
            alert('Faça login para salvar vagas');
            return;
        }
        if (!job) return;

        setSaving(true);
        try {
            if (isSaved) {
                // Unsave
                const { error } = await supabase
                    .from('saved_jobs')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('job_id', job.id);
                if (!error) setIsSaved(false);
            } else {
                // Save
                const { error } = await supabase
                    .from('saved_jobs')
                    .insert({ user_id: user.id, job_id: job.id });
                if (!error) setIsSaved(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (!job) {
        return (
            <div className="h-full bg-white rounded-[32px] border border-gray-100 p-10 flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <p>Selecione uma vaga para ver os detalhes</p>
                </div>
            </div>
        );
    }

    const handleApply = () => {
        // Simulate logic: Randomly show "Low Profile" warning or just succeed
        // For demo purposes, let's show the Low Match Warning
        setShowApplyWarning(true);
    };

    const handleReport = () => {
        setShowReportForm(true);
    };

    const handleReportSubmit = async () => {
        setShowReportForm(false);
        if (!job || !user) return;

        // Mock reason for now as modal doesn't pass it yet, or use generic
        try {
            await supabase.from('job_reports').insert({
                user_id: user.id,
                job_id: job.id,
                reason: 'Denúncia enviada via plataforma', // TODO: Get from modal
                status: 'pending'
            });
            setShowReportSuccess(true);
        } catch (err) {
            console.error('Error reporting job:', err);
            alert('Erro ao enviar denúncia.');
        }
    };

    // Formatting helpers
    const formatSalary = (min: number, max: number) => {
        if (!min && !max) return 'A combinar';
        if (min && max) return `R$ ${min} - ${max}`;
        return `R$ ${min || max}`;
    };

    const matchScore = job.match_score || 87; // Mock

    return (
        <>
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-lg flex flex-col relative z-0">
                <div className="p-8 pb-4 border-b border-gray-50 flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                            <h2 className="text-2xl font-black text-[#1E3A8A] mb-1 leading-tight">{job.title}</h2>
                            <p className="text-gray-500 font-medium text-lg">{job.company_name || 'Empresa'}</p>
                        </div>
                        {/* Company Logo (Mock) */}
                        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-2xl ml-4 shrink-0">
                            {job.company_name ? job.company_name.charAt(0).toUpperCase() : 'C'}
                        </div>
                    </div>

                    {/* Quick Info Grid - Image 2 Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-[15px] text-gray-600 mb-8 border-b border-gray-50 pb-8">
                        {/* Left Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Briefcase size={20} className="text-[#5AB7F7]" />
                                <span className="font-medium text-gray-700">{job.type === 'onsite' ? 'Presencial' : job.type}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock size={20} className="text-[#5AB7F7]" />
                                <span>Período flexível</span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3 md:text-right">
                            <div className="flex items-center gap-3 md:justify-end">
                                <DollarSign size={20} className="text-[#5AB7F7]" />
                                <span className="font-bold text-gray-900">{formatSalary(job.salary_min, job.salary_max)}</span>
                            </div>
                            <div className="flex items-center gap-3 md:justify-end">
                                <MapPin size={20} className="text-[#5AB7F7]" />
                                <span>{job.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Image 2 Style */}
                    <div className="flex items-center gap-4 mb-10">
                        {isApplied ? (
                            // Applied State Buttons
                            <>
                                <button
                                    onClick={onBehavioralTest}
                                    className="bg-[#F04E23] text-white px-6 py-3.5 rounded-lg font-bold shadow-sm hover:bg-[#E03E13] transition-all"
                                >
                                    Teste comportamental
                                </button>
                                <button
                                    onClick={onCancelApplication}
                                    className="text-red-500 font-bold hover:underline px-4"
                                >
                                    Cancelar candidatura
                                </button>
                            </>
                        ) : (
                            // Default State Buttons
                            <>
                                <button
                                    onClick={handleApply}
                                    className="flex-[2] bg-[#F04E23] text-white py-3.5 rounded-lg font-bold shadow-sm hover:bg-[#E03E13] transition-all text-center"
                                >
                                    Candidatar-se
                                </button>

                                <button
                                    onClick={handleToggleSave}
                                    disabled={saving}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 border rounded-lg font-bold transition-all ${isSaved
                                        ? 'bg-orange-50 border-[#F04E23] text-[#F04E23]'
                                        : 'bg-white border-orange-200 text-[#F04E23] hover:bg-orange-50'
                                        }`}
                                >
                                    <Bookmark size={18} className={isSaved ? "fill-[#F04E23]" : ""} />
                                    <span>{isSaved ? 'Vaga salva' : 'Salvar'}</span>
                                </button>

                                <button
                                    onClick={handleReport}
                                    className="ml-auto text-red-400 hover:text-red-500 font-bold text-sm whitespace-nowrap"
                                >
                                    Denunciar vaga
                                </button>
                            </>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-100 mb-6">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`pb-3 border-b-2 font-bold transition-colors ${activeTab === 'details' ? 'border-[#F04E23] text-[#F04E23]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Detalhes da vaga
                        </button>
                        <button
                            onClick={() => setActiveTab('competition')}
                            className={`pb-3 border-b-2 font-bold transition-colors ${activeTab === 'competition' ? 'border-[#F04E23] text-[#F04E23]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Concorrência
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeTab === 'details' && (
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Descrição</h3>
                                <p className="text-gray-600 text-[14px] leading-relaxed whitespace-pre-line text-justify">
                                    {job.description}
                                </p>
                                <p className="text-gray-600 text-[14px] leading-relaxed mt-4">
                                    A Digital Marketing Experts S/A está em busca de um {job.title} apaixonado por estratégias online.
                                    Nessa posição desafiadora, você terá a oportunidade de aplicar seus conhecimentos.
                                    Trabalhe de forma autônoma em um ambiente flexível.
                                </p>
                            </section>
                        )}

                        {activeTab === 'details' && job.requirements && job.requirements.length > 0 && (
                            <section>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Requisitos</h3>
                                <ul className="space-y-2">
                                    {job.requirements.map((req, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-gray-600 text-[14px]">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    {/* Competition Content */}
                    {activeTab === 'competition' && (
                        <div className="animate-in fade-in duration-300 space-y-6">
                            {[
                                { label: 'Comparativo', text: '80% melhor que a concorrência para essa vaga.', pct: 80 },
                                { label: 'Média', text: 'Você possui 90%, a média para essa vaga é 70%.', pct: 90, avg: 70 },
                                { label: 'Residentes', text: '80% dos candidatos são residentes na região da vaga.', pct: 80 },
                                { label: 'Pretensão salarial', text: 'Você tem xx%, a média para essa vaga é xx%', pct: 60 },
                                { label: 'Experiência com cargo', text: 'Você tem xx%, a média para essa vaga é xx%', pct: 75 },
                                { label: 'Trabalhando atualmente', text: 'Você tem xx%, a média para essa vaga é xx%', pct: 50 },
                                { label: 'Experiência no segmento', text: 'Você tem xx%, a média para essa vaga é xx%', pct: 65 },
                                { label: 'Idioma', text: 'Você tem xx%, a média para essa vaga é xx%', pct: 80 },
                                { label: 'Tempo médio empregos anteriores', text: 'Você tem xx%, a média para essa vaga é xx%', pct: 70 },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-sm">{item.label}</h4>
                                        <p className="text-xs text-gray-500">{item.text}</p>
                                    </div>
                                    <div className="w-48 h-3 bg-gray-100 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full bg-[#5AB7F7] rounded-full"
                                            style={{ width: `${item.pct}%` }}
                                        />
                                        {/* Optional "Average" marker/bar if needed, sticking to simple bar from image for now */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- Modals --- */}
            {showReportForm && (
                <ReportFormModal
                    onSubmit={handleReportSubmit}
                    onCancel={() => setShowReportForm(false)}
                />
            )}

            {showReportSuccess && (
                <ReportSuccessModal
                    onClose={() => setShowReportSuccess(false)}
                />
            )}

            {showApplyWarning && (
                <LowMatchModal
                    onApply={() => { setShowApplyWarning(false); alert('Candidatura enviada!'); }}
                    onEdit={() => setShowApplyWarning(false)}
                    onClose={() => setShowApplyWarning(false)}
                />
            )}
        </>
    );
};

export default JobDetailsPanel;
