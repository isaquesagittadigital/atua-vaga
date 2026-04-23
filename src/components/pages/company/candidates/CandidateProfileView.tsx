import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft, Loader2, MapPin, Mail, Phone, Calendar, Briefcase, GraduationCap, Trophy, Globe, Linkedin, FileText, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDateToLocale } from '@/utils/validators';

const CandidateProfileView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [candidateData, setCandidateData] = useState<any>(null);

    useEffect(() => {
        const fetchCandidateProfile = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch full profile
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (profileError) throw profileError;

                // Fetch academic education
                const { data: education } = await supabase
                    .from('academic_education')
                    .select('*')
                    .eq('user_id', id)
                    .order('start_date', { ascending: false });

                // Fetch professional experience
                const { data: experience } = await supabase
                    .from('professional_experience')
                    .select('*')
                    .eq('user_id', id)
                    .order('start_date', { ascending: false });

                // Fetch test results
                const { data: testResults } = await supabase
                    .from('candidate_test_results')
                    .select(`
                        *,
                        behavioral_tests (*)
                    `)
                    .eq('user_id', id)
                    .order('completed_at', { ascending: false });

                setCandidateData({
                    ...profile,
                    education: education || [],
                    experience: experience || [],
                    testResults: testResults || []
                });
            } catch (error) {
                console.error('Error fetching candidate profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidateProfile();
    }, [id]);

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return '--';
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} anos`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="animate-spin text-[#F04E23]" size={40} />
            </div>
        );
    }

    if (!candidateData) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Candidato não encontrado</h2>
                <button onClick={() => navigate(-1)} className="mt-4 text-[#F04E23] font-bold underline flex items-center gap-2 mx-auto">
                    <ChevronLeft size={20} /> Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            {/* ── Top Navigation / Header ────────────────────────────── */}
            <header className="max-w-[1000px] mx-auto px-6 pt-10">
                <div className="flex flex-col md:flex-row items-center gap-6 justify-between mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm">
                            {candidateData.avatar_url ? (
                                <img src={candidateData.avatar_url} alt={candidateData.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-3xl font-black text-gray-300">
                                    {candidateData.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{candidateData.full_name || 'Candidato'}</h1>
                            <p className="text-gray-500 font-medium">{candidateData.job_objective || 'Engenheiro'}</p>
                            <div className="flex gap-4 mt-2">
                                <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                    90% de aderência à empresa
                                </span>
                                <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                    90% de aderência à vaga
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2.5 rounded-xl border-2 border-[#F04E23] text-[#F04E23] font-bold text-sm hover:bg-orange-50 transition-all">
                            Contatar candidato
                        </button>
                        <button className="px-6 py-2.5 rounded-xl bg-[#F04E23] text-white font-bold text-sm hover:bg-[#d63f15] transition-all shadow-lg shadow-orange-500/20">
                            Recrutar candidato
                        </button>
                    </div>
                </div>

                {/* ── Section: Quem sou eu ─────────────────────────────── */}
                <div className="mb-12">
                    <label className="block text-sm font-bold text-gray-600 mb-3">Quem sou eu</label>
                    <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/30 text-gray-500 leading-relaxed text-sm">
                        {candidateData.bio || 'O candidato ainda não preencheu esta seção.'}
                    </div>
                </div>

                {/* ── Section: Dados Pessoais ────────────────────────────── */}
                <section className="mb-16">
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Dados pessoais</h2>
                    <p className="text-sm text-gray-400 mb-8 font-medium">Preencha o restante dos seus dados.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ReadOnlyField label="Nome" value={candidateData.full_name} />
                        <ReadOnlyField label="CPF ou CNPJ" value={candidateData.cpf || '—'} />
                        <ReadOnlyField label="E-mail" value={candidateData.email} />
                        <ReadOnlyField label="Telefone" value={candidateData.phone || '—'} />
                        <ReadOnlyField label="Data de nascimento" value={candidateData.birth_date ? new Date(candidateData.birth_date).toLocaleDateString('pt-BR') : '—'} />
                        <ReadOnlyField label="Idade" value={calculateAge(candidateData.birth_date)} />
                        <ReadOnlyField label="Estado civil" value={candidateData.civil_status || '—'} />
                        <div className="md:col-span-1">
                            <ReadOnlyField label="Endereço completo" value={`${candidateData.city || ''}, ${candidateData.state || ''} ${candidateData.street ? `- ${candidateData.street}` : ''}`} />
                        </div>
                        <div className="flex items-center gap-4 py-3">
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-2">Possui CNH?</span>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                    <input type="checkbox" checked={candidateData.cnh} readOnly className="rounded text-[#F04E23]" /> Sim
                                </label>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-400">
                                    <input type="checkbox" checked={!candidateData.cnh} readOnly className="rounded text-gray-300" /> Não
                                </label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Section: Formação Acadêmica ────────────────────────── */}
                <section className="mb-16">
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Formação Acadêmica</h2>
                    <p className="text-sm text-gray-400 mb-8 font-medium">Mostre aos recrutadores seu nível educacional adicionando sua escolaridade.</p>
                    <div className="space-y-6">
                        {candidateData.education.map((edu: any, index: number) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ReadOnlyField label="Tipo de formação" value={edu.level} />
                                <ReadOnlyField label="Instituição" value={edu.institution} />
                                <div className="grid grid-cols-2 gap-4">
                                    <ReadOnlyField label="Data de início" value={formatDateToLocale(edu.start_date)} />
                                    <ReadOnlyField label="Data de conclusão" value={edu.is_current ? 'Cursando' : formatDateToLocale(edu.end_date)} />
                                </div>
                            </div>
                        ))}
                        {candidateData.education.length === 0 && <p className="text-gray-400 italic">Nenhuma formação registrada.</p>}
                    </div>
                </section>

                {/* ── Section: Experiências Profissionais ────────────────── */}
                <section className="mb-16">
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Experiências profissionais</h2>
                    <p className="text-sm text-gray-400 mb-8 font-medium">Mostre aos recrutadores seu nível profissional adicionando suas experiências.</p>
                    <div className="space-y-10">
                        {candidateData.experience.map((exp: any, index: number) => (
                            <div key={index} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <ReadOnlyField label="Nome da empresa" value={exp.company_name} />
                                    <ReadOnlyField label="Cargo" value={exp.role} />
                                    <ReadOnlyField label="Atividades realizadas" value={exp.description} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <ReadOnlyField label="Valor da remuneração" value={exp.salary ? `R$ ${exp.salary}` : '—'} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <ReadOnlyField label="Data de início" value={formatDateToLocale(exp.start_date)} />
                                        <ReadOnlyField label="Data de saída" value={exp.is_current ? 'Atualmente' : formatDateToLocale(exp.end_date)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {candidateData.experience.length === 0 && <p className="text-gray-400 italic">Nenhuma experiência registrada.</p>}
                    </div>
                </section>

                {/* ── Section: Habilidades ────────────────────────────────── */}
                <section className="mb-16">
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Habilidades</h2>
                    <p className="text-sm text-gray-400 mb-8 font-medium">Mostre aos recrutadores seu nível profissional adicionando suas habilidades.</p>
                    
                    <div className="mb-8">
                        <label className="block text-[11px] font-black text-gray-400 mb-3 uppercase tracking-wider">Habilidades</label>
                        <div className="flex flex-wrap gap-2">
                            {candidateData.skills?.map((skill: string, i: number) => (
                                <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600">
                                    {skill}
                                </span>
                            )) || <span className="text-gray-400 italic">Não informado</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ReadOnlyField label="Redes sociais" value={candidateData.linkedin_url || '—'} icon={<Linkedin size={14} className="text-blue-600" />} />
                        <ReadOnlyField label="Objetivo profissional" value={candidateData.job_objective || '—'} />
                        <ReadOnlyField label="Diversidade" value={candidateData.diversity_info || '—'} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                        <AvailabilityToggle label="Disponibilidade para viajar?" checked={candidateData.travel_availability} />
                        <AvailabilityToggle label="Disponibilidade para dormir?" checked={candidateData.sleep_availability} />
                        <AvailabilityToggle label="Disponibilidade para se mudar?" checked={candidateData.move_availability} />
                    </div>
                </section>

                {/* ── Section: Resultado Comportamental ───────────────────── */}
                <section>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Resultado comportamental</h2>
                    <p className="text-sm text-gray-400 mb-8 font-medium">Mostre aos recrutadores seu nível profissional respondendo os testes.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl group cursor-pointer hover:bg-blue-100 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-500 shadow-sm">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Teste comportamental {i}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">PDF • 25 fev, 2023 • 212.5 KB</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />
                            </div>
                        ))}
                    </div>
                </section>
            </header>
        </div>
    );
};

const ReadOnlyField = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
    <div>
        <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-wider">{label}</label>
        <div className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium text-sm flex items-center gap-2">
            {icon}
            <span className="truncate">{value || '—'}</span>
        </div>
    </div>
);

const AvailabilityToggle = ({ label, checked }: { label: string; checked: boolean }) => (
    <div>
        <label className="block text-[11px] font-black text-gray-400 mb-3 uppercase tracking-wider">{label}</label>
        <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                <input type="checkbox" checked={checked} readOnly className="rounded text-[#F04E23]" /> Sim
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-400">
                <input type="checkbox" checked={!checked} readOnly className="rounded text-gray-300" /> Não
            </label>
        </div>
    </div>
);

export default CandidateProfileView;
