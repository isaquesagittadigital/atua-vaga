import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Briefcase, Calendar, CheckCircle2, Share2, Bookmark, Flag, HelpCircle, TriangleAlert } from 'lucide-react';
import { ReportFormModal, ReportSuccessModal, LowMatchModal, BehavioralTestModal, IncompleteProfileModal } from './JobModals';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { calculateJobMatch } from '@/utils/matchingUtils';

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
    const [showApplyWarning, setShowApplyWarning] = useState(false);
    const [showIncompleteProfile, setShowIncompleteProfile] = useState(false);
    const [missingRequirements, setMissingRequirements] = useState<string[]>([]);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [candidateData, setCandidateData] = useState<{
        city?: string;
        salary?: number;
        yearsExp?: number;
        languages?: { name: string, level: string }[];
        hasDegree?: boolean;
    }>({});
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const { user, hasTestResult } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (job && user) {
            checkIfSaved();
            checkProfileCompletion();
        }
    }, [job, user]);

    const checkProfileCompletion = async () => {
        if (!user) return;
        
        try {
            const [profileRes, eduRes, expRes, testRes] = await Promise.all([
                supabase.from('profiles').select('full_name, cpf, phone, address, salary_objective, social_links').eq('id', user.id).single(),
                supabase.from('academic_education').select('*').eq('user_id', user.id),
                supabase.from('professional_experience').select('*').eq('user_id', user.id),
                supabase.from('candidate_test_results').select('id').eq('user_id', user.id).not('completed_at', 'is', null).limit(1)
            ]);

            const missing = [];
            const p = profileRes.data;
            const socials = p?.social_links as any || {};
            
            if (!p?.full_name || !p?.cpf || !p?.phone) missing.push('Dados pessoais (Nome, CPF ou Telefone)');
            if (!eduRes.data || eduRes.data.length === 0) missing.push('Formação acadêmica');
            if (!expRes.data || expRes.data.length === 0) missing.push('Experiência profissional');
            if (!testRes.data || testRes.data.length === 0) missing.push('Teste comportamental (Big Five)');

            setMissingRequirements(missing);
            setIsProfileComplete(missing.length === 0);

            // Process candidate metrics for charts
            const city = p?.address?.split(',')[0]?.trim();
            const salary = p?.salary_objective || 0;
            
            // Calculate years of experience
            let totalYears = 0;
            if (expRes.data) {
                expRes.data.forEach((exp: any) => {
                    const start = new Date(exp.start_date || '');
                    const end = exp.end_date ? new Date(exp.end_date) : new Date();
                    if (!isNaN(start.getTime())) {
                        totalYears += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
                    }
                });
            }

            setCandidateData({
                city,
                salary,
                yearsExp: Math.round(totalYears * 10) / 10,
                languages: socials.languages || [],
                hasDegree: eduRes.data && eduRes.data.length > 0
            });
        } catch (err) {
            console.error('Error checking profile completion:', err);
        }
    };

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
        if (!isProfileComplete) {
            setShowIncompleteProfile(true);
            return;
        }
        // If complete, show the match warning (or proceed to apply)
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

    const matchScore = calculateJobMatch(job.id, user?.id, hasTestResult);

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

                    {/* Quick Info - All stacked on the left as requested */}
                    <div className="flex flex-col gap-3 text-[15px] text-gray-600 mb-8 border-b border-gray-50 pb-8">
                        <div className="flex flex-wrap gap-x-12 gap-y-3">
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
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <DollarSign size={20} className="text-[#5AB7F7]" />
                                    <span className="font-bold text-gray-900">{formatSalary(job.salary_min, job.salary_max)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={20} className="text-[#5AB7F7]" />
                                    <span>{job.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center gap-2 mb-8 -mt-4 animate-in fade-in slide-in-from-left-4 duration-500">
                        {hasTestResult ? (
                            <>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                    <span className="text-xs font-black text-orange-600 whitespace-nowrap">
                                        {matchScore}% de aderência
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 font-bold leading-none translate-y-[1px]">
                                    com o cargo baseado no seu teste comportamental
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full">
                                    <span className="text-xs font-bold text-gray-400 whitespace-nowrap">
                                        (Teste não realizado)
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-none translate-y-[1px]">
                                    Realize o teste para ver sua aderência com a vaga
                                </p>
                            </>
                        )}
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
                                { 
                                    label: 'Comparativo', 
                                    text: `${matchScore}% de aderência para essa vaga.`, 
                                    pct: matchScore 
                                },
                                { 
                                    label: 'Média', 
                                    text: `Você possui ${matchScore}%, a média para essa vaga é 70%.`, 
                                    pct: matchScore 
                                },
                                { 
                                    label: 'Residentes', 
                                    text: candidateData.city && job.location?.includes(candidateData.city) 
                                        ? `Você reside em ${candidateData.city}, na mesma região da vaga.` 
                                        : `Você reside em ${candidateData.city || 'não informado'}. 80% dos candidatos são da região.`, 
                                    pct: candidateData.city && job.location?.includes(candidateData.city) ? 100 : (candidateData.city ? 40 : 0) 
                                },
                                { 
                                    label: 'Pretensão salarial', 
                                    text: candidateData.salary 
                                        ? `Sua pretensão é R$ ${candidateData.salary}. A média da vaga é R$ ${((job.salary_min || 0) + (job.salary_max || 0)) / 2}.`
                                        : 'Pretensão salarial não informada no perfil.', 
                                    pct: candidateData.salary && job.salary_max ? (candidateData.salary <= job.salary_max ? 90 : 30) : 0 
                                },
                                { 
                                    label: 'Experiência com cargo', 
                                    text: `Você tem ${candidateData.yearsExp || 0} anos de experiência. A média para essa vaga é 3 anos.`, 
                                    pct: candidateData.yearsExp ? Math.min((candidateData.yearsExp / 5) * 100, 100) : 0 
                                },
                                { 
                                    label: 'Trabalhando atualmente', 
                                    text: candidateData.yearsExp ? 'Perfil atualizado recentemente.' : 'Sem histórico profissional recente.', 
                                    pct: candidateData.yearsExp ? 100 : 0 
                                },
                                { 
                                    label: 'Experiência no segmento', 
                                    text: `Sua aderência ao segmento é de ${Math.round(matchScore * 0.9)}%.`, 
                                    pct: Math.round(matchScore * 0.9) 
                                },
                                { 
                                    label: 'Idioma', 
                                    text: (() => {
                                        const mainLang = candidateData.languages?.find(l => l.name.toLowerCase().includes('inglês')) || candidateData.languages?.[0];
                                        return mainLang 
                                            ? `${mainLang.name} (${mainLang.level}) detectado no perfil.` 
                                            : 'Nenhum idioma detectado no perfil.';
                                    })(),
                                    pct: (() => {
                                        const mainLang = candidateData.languages?.find(l => l.name.toLowerCase().includes('inglês')) || candidateData.languages?.[0];
                                        if (!mainLang) return 0;
                                        if (['Fluente', 'Nativo'].includes(mainLang.level)) return 100;
                                        if (mainLang.level === 'Avançado') return 85;
                                        if (mainLang.level === 'Intermediário') return 60;
                                        return 40;
                                    })()
                                },
                                { 
                                    label: 'Tempo médio empregos anteriores', 
                                    text: `Sua estabilidade média é de ${candidateData.yearsExp ? Math.round(candidateData.yearsExp / 2) : 0} anos por empresa.`, 
                                    pct: candidateData.yearsExp ? 75 : 0 
                                },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-sm">{item.label}</h4>
                                        <p className="text-[11px] text-gray-500 leading-tight">{item.text}</p>
                                    </div>
                                    <div className="w-48 h-2.5 bg-gray-100 rounded-full overflow-hidden relative">
                                        <div
                                            className="h-full bg-[#5AB7F7] rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${item.pct}%` }}
                                        />
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
                    onEdit={() => { setShowApplyWarning(false); navigate('/app/profile'); }}
                    onClose={() => setShowApplyWarning(false)}
                    canApply={isProfileComplete}
                />
            )}

            {showIncompleteProfile && (
                <IncompleteProfileModal
                    missingItems={missingRequirements}
                    onEdit={() => { setShowIncompleteProfile(false); navigate('/app/profile'); }}
                    onClose={() => setShowIncompleteProfile(false)}
                />
            )}
        </>
    );
};

export default JobDetailsPanel;
