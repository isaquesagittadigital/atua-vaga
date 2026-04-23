import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, ChevronLeft, Loader2, MapPin, Mail, Phone, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// We'll need to create read-only versions or adapt the existing ones
// For now, let's build the layout and fetch the data
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

                setCandidateData({
                    ...profile,
                    education: education || [],
                    experience: experience || []
                });
            } catch (error) {
                console.error('Error fetching candidate profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidateProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
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
        <div className="font-sans flex flex-col flex-1 bg-gray-50 min-h-screen pb-20">
            <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 pt-8">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors mb-8 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 shadow-sm">
                        <ChevronLeft size={18} />
                    </div>
                    Voltar para lista
                </button>

                {/* Profile Header */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-10 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md bg-gray-50 shrink-0">
                            {candidateData.avatar_url ? (
                                <img src={candidateData.avatar_url} alt={candidateData.full_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500 text-4xl font-black">
                                    {candidateData.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-black text-gray-900 mb-4">{candidateData.full_name || 'Candidato'}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} className="text-blue-500" />
                                    {candidateData.city && candidateData.state ? `${candidateData.city}, ${candidateData.state}` : 'Brasil'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail size={18} className="text-blue-500" />
                                    {candidateData.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={18} className="text-blue-500" />
                                    {candidateData.phone || 'Não informado'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-blue-500" />
                                    {candidateData.birth_date ? new Date(candidateData.birth_date).toLocaleDateString('pt-BR') : '--'}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button className="px-8 py-4 bg-[#F04E23] text-white font-black rounded-2xl hover:bg-[#d63f15] transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                                Entrar em contato
                            </button>
                            <button className="px-8 py-4 bg-white text-gray-700 font-black rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all active:scale-95">
                                Baixar Currículo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Experience */}
                        <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-10">
                            <h2 className="text-2xl font-black text-gray-900 mb-8">Experiência Profissional</h2>
                            {candidateData.experience.length > 0 ? (
                                <div className="space-y-10">
                                    {candidateData.experience.map((exp: any, index: number) => (
                                        <div key={index} className="relative pl-8 border-l-2 border-blue-50 pb-2 last:pb-0">
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                                            <div className="mb-1 flex justify-between items-start">
                                                <h3 className="font-bold text-xl text-gray-900">{exp.role}</h3>
                                                <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                                    {exp.is_current ? 'Atual' : 'Anterior'}
                                                </span>
                                            </div>
                                            <p className="text-blue-600 font-bold mb-3">{exp.company_name}</p>
                                            <p className="text-gray-400 text-sm font-bold mb-4">
                                                {new Date(exp.start_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} - 
                                                {exp.is_current ? ' Atualmente' : ` ${new Date(exp.end_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`}
                                            </p>
                                            <p className="text-gray-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">Nenhuma experiência registrada.</p>
                            )}
                        </section>

                        {/* Education */}
                        <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-10">
                            <h2 className="text-2xl font-black text-gray-900 mb-8">Formação Acadêmica</h2>
                            {candidateData.education.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {candidateData.education.map((edu: any, index: number) => (
                                        <div key={index} className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                                            <h3 className="font-bold text-gray-900 mb-1">{edu.course}</h3>
                                            <p className="text-blue-600 font-bold text-sm mb-4">{edu.institution}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                                                <span>{edu.degree}</span>
                                                <span>{new Date(edu.start_date).getFullYear()} - {edu.is_current ? 'Cursando' : new Date(edu.end_date).getFullYear()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">Nenhuma formação registrada.</p>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Skills & Info */}
                    <div className="space-y-8">
                        {/* Objective */}
                        <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-gray-900 mb-6">Objetivo</h2>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                {candidateData.job_objective || 'Não informado'}
                            </p>
                            <div className="mt-6 pt-6 border-t border-gray-50">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Pretensão Salarial</p>
                                <p className="text-xl font-black text-gray-900">
                                    {candidateData.salary_objective ? `R$ ${candidateData.salary_objective}` : 'A combinar'}
                                </p>
                            </div>
                        </section>

                        {/* Skills */}
                        <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-gray-900 mb-6">Habilidades</h2>
                            <div className="flex flex-wrap gap-2">
                                {candidateData.skills && candidateData.skills.length > 0 ? (
                                    candidateData.skills.map((skill: string, index: number) => (
                                        <span key={index} className="px-4 py-2 bg-gray-50 text-gray-700 font-bold text-sm rounded-xl border border-gray-100">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic">Não informado.</p>
                                )}
                            </div>
                        </section>

                        {/* Bio */}
                        <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8">
                            <h2 className="text-xl font-black text-gray-900 mb-6">Sobre mim</h2>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                {candidateData.bio || 'O candidato não preencheu a biografia.'}
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateProfileView;
