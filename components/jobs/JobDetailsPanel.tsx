import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Briefcase, Calendar, CheckCircle2, Share2, Bookmark, Flag, HelpCircle } from 'lucide-react';
import { ReportFormModal, ReportSuccessModal, LowMatchModal, BehavioralTestModal } from './JobModals';

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
}

const JobDetailsPanel: React.FC<JobDetailsPanelProps> = ({ job, onClose }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'competition'>('details');

    // Modal States
    const [showReportForm, setShowReportForm] = useState(false);
    const [showReportSuccess, setShowReportSuccess] = useState(false);
    const [showApplyWarning, setShowApplyWarning] = useState(false); // Can swap this with BehavioralTestModal for testing

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

    const handleReportSubmit = () => {
        setShowReportForm(false);
        setShowReportSuccess(true);
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
            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-lg h-full flex flex-col relative z-0">
                <div className="p-8 pb-4 border-b border-gray-50 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-[#1E3A8A] mb-1">{job.title}</h2>
                            <p className="text-gray-500 font-medium">{job.company_name || 'Empresa Confidencial'}</p>
                        </div>

                        {/* Visual Match Indicator with Tooltip */}
                        <div className="hidden lg:block relative group">
                            <div className="w-32 h-24 bg-blue-50 rounded-xl p-2 cursor-help transition-colors hover:bg-blue-100">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-end justify-center space-x-1">
                                    <div className="w-4 h-6 bg-orange-400 rounded-full opacity-60"></div>
                                    <div className="w-6 h-10 bg-orange-500 rounded-full shadow-lg shadow-orange-200"></div>
                                    <div className="w-4 h-6 bg-blue-400 rounded-full opacity-60"></div>
                                </div>
                            </div>

                            {/* Tooltip Content (Image 1 Style) */}
                            <div className="absolute top-full right-0 mt-2 w-64 bg-[#0F172A] text-white text-sm font-medium rounded-2xl p-4 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                <div className="space-y-3">
                                    <p className="flex justify-between">90% de aderência à vaga</p>
                                    <p className="flex justify-between">90% de aderência técnica</p>
                                    <p className="flex justify-between border-t border-gray-700 pt-2">
                                        90% de aderência com a empresa
                                    </p>
                                </div>
                                {/* Tooltip Arrow */}
                                <div className="absolute -top-2 right-8 w-4 h-4 bg-[#0F172A] rotate-45"></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[14px] text-gray-600 mb-8">
                        <div className="flex items-center gap-2">
                            <Briefcase size={18} className="text-[#5AB7F7]" />
                            <span className="capitalize">{job.type === 'onsite' ? 'Presencial' : job.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign size={18} className="text-[#5AB7F7]" />
                            <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-[#5AB7F7]" />
                            <span>Período flexível</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-[#5AB7F7]" />
                            <span>{job.location}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={handleApply}
                            className="flex-1 bg-[#F04E23] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-100 hover:bg-[#E03E13] transition-all transform hover:-translate-y-0.5"
                        >
                            Candidatar-se
                        </button>
                        <button className="flex items-center gap-2 px-4 py-3.5 border border-gray-200 rounded-xl text-[#F04E23] font-bold hover:bg-gray-50 group">
                            <Bookmark size={18} className="group-hover:fill-[#F04E23]" />
                            <span className="hidden sm:inline">Salvar vaga</span>
                        </button>
                        <button
                            onClick={handleReport}
                            className="px-4 py-3.5 text-red-400 hover:text-red-500 font-bold text-sm"
                        >
                            Denunciar vaga
                        </button>
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

                        {job.requirements && job.requirements.length > 0 && (
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
