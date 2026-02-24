import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, MapPin, DollarSign, Clock, Building2, FileText, ArrowRight } from 'lucide-react';

const CandidateDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [education, setEducation] = useState<any[]>([]);
    const [experience, setExperience] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [testResults, setTestResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (id) fetchData(); }, [id]);

    const fetchData = async () => {
        setLoading(true);
        const [profileRes, eduRes, expRes, skillsRes, testsRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('id', id).single(),
            supabase.from('academic_education').select('*').eq('user_id', id),
            supabase.from('professional_experience').select('*').eq('user_id', id),
            supabase.from('candidate_skills').select('*').eq('user_id', id),
            supabase.from('candidate_test_results').select('*').eq('user_id', id),
        ]);
        setProfile(profileRes.data);
        setEducation(eduRes.data || []);
        setExperience(expRes.data || []);
        setSkills(skillsRes.data || []);
        setTestResults(testsRes.data || []);
        setLoading(false);
    };

    // Fallback mock
    const p = profile || {
        full_name: 'Joaquim Vinícius',
        job_objective: 'Engenheiro',
        bio: 'Sou um profissional resiliente e motivado, com 32 anos, natural de São Paulo, que, apesar de não ter concluído o ensino médio, construiu uma trajetória sólida como gerente de projetos da Sagitta.',
        email: 'sample@ittadigital.com.br',
        cpf: '906.781.045-56',
        phone: '+55 11 90233102',
        birth_date: '01/01/2000',
        civil_status: 'Solteiro',
        street: 'Rua Lins, 123, São Paulo - SP',
        cep: '',
        cnh: true,
        social_links: { linkedin: '#' },
        salary_objective: null,
        job_objective_text: '',
        diversity_info: '',
        availability_travel: true,
        availability_sleep: true,
        availability_move: false,
        trainings: '',
        updated_at: '2025-01-01',
    };

    const socials = (p.social_links as any) || {};

    const mockEducation = [{ level: 'Ensino médio', institution: 'Escola Municipal Souza', start_date: '2002-01-01', end_date: null, status: 'Cursando' }];
    const mockExperience = [{ company_name: 'Sagitta', role: 'Gerente de projetos', description: 'Gerenciava projetos', salary: 10000, start_date: '2024-01-01', end_date: null, is_current: true, is_variable_salary: true, variable_salary_amount: 500 }];
    const mockSkills = [{ name: 'Comunicação' }, { name: 'Vendas' }, { name: 'Organização' }, { name: 'Gerenciamento' }, { name: 'Trabalho em equipe' }, { name: 'Informática' }];

    const displayEdu = education.length > 0 ? education : mockEducation;
    const displayExp = experience.length > 0 ? experience : mockExperience;
    const displaySkills = skills.length > 0 ? skills : mockSkills;

    const age = p.birth_date ? Math.floor((Date.now() - new Date(p.birth_date).getTime()) / 31557600000) + ' anos' : '—';

    if (loading) return <div className="p-12 text-center text-gray-400">Carregando...</div>;

    return (
        <div className="p-12 max-w-[1200px] mx-auto">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-8 hover:text-gray-900 transition-colors">
                <ChevronLeft size={18} /> Voltar
            </button>

            <div className="bg-white rounded-3xl border border-gray-100 p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-black text-2xl overflow-hidden">
                            {p.full_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">{p.full_name || '—'}</h1>
                            <p className="text-sm text-gray-400 font-medium">{p.job_objective || '—'}</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">Último acesso: {p.updated_at ? new Date(p.updated_at).toLocaleString('pt-BR') : '—'}</p>
                </div>

                {/* Bio */}
                {p.bio && (
                    <section className="mb-10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Quem sou eu</h3>
                        <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">{p.bio}</div>
                    </section>
                )}

                {/* Dados pessoais */}
                <section className="mb-10">
                    <h2 className="text-xl font-black text-gray-900 mb-2">Dados pessoais</h2>
                    <p className="text-sm text-gray-400 mb-6">Preencha o restante dos seus dados.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Nome" value={p.full_name} />
                        <Field label="CPF ou CNPJ" value={p.cpf} />
                        <Field label="E-mail" value={p.email} />
                        <Field label="Telefone" value={p.phone} />
                        <Field label="Data de nascimento" value={p.birth_date ? new Date(p.birth_date).toLocaleDateString('pt-BR') : '—'} />
                        <Field label="Idade" value={age} />
                        <Field label="Estado civil" value={p.civil_status || '—'} />
                        <Field label="Endereço completo" value={p.street || p.address || '—'} />
                        <Field label="Possui CNH" value={p.cnh ? 'Sim' : 'Não'} />
                    </div>
                </section>

                {/* Formação */}
                <section className="mb-10">
                    <h2 className="text-xl font-black text-gray-900 mb-2">Formação Acadêmica</h2>
                    <p className="text-sm text-gray-400 mb-6">Mostre aos recrutadores seu nível educacional adicionando suas escolaridades.</p>
                    {displayEdu.map((edu: any, i: number) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-xl mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Tipo de formação" value={edu.level} />
                                <Field label="Instituição" value={edu.institution} />
                                <Field label="Data de início" value={edu.start_date ? new Date(edu.start_date).toLocaleDateString('pt-BR') : '—'} />
                            </div>
                            <div className="mt-3 flex gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${edu.status === 'Concluído' ? 'bg-emerald-50 text-emerald-600' : edu.status === 'Cursando' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {edu.status || '—'}
                                </span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Experiências */}
                <section className="mb-10">
                    <h2 className="text-xl font-black text-gray-900 mb-2">Experiências profissionais</h2>
                    <p className="text-sm text-gray-400 mb-6">Mostre aos recrutadores seu nível profissional adicionando suas experiências.</p>
                    {displayExp.map((exp: any, i: number) => (
                        <div key={i} className="p-4 bg-gray-50 rounded-xl mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field label="Nome da empresa" value={exp.company_name} />
                                <Field label="Cargo" value={exp.role} />
                                <Field label="Atividades realizadas" value={exp.description || '—'} />
                                <Field label="Valor da remuneração" value={exp.salary ? `R$${Number(exp.salary).toLocaleString('pt-BR')}` : '—'} />
                                <Field label="Data de início" value={exp.start_date ? new Date(exp.start_date).toLocaleDateString('pt-BR') : '—'} />
                                <Field label="Data de saída" value={exp.is_current ? 'Atualmente trabalho aqui' : (exp.end_date ? new Date(exp.end_date).toLocaleDateString('pt-BR') : '—')} />
                            </div>
                            {exp.is_variable_salary && (
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Field label="Remuneração variável" value={exp.variable_salary_amount ? `R$${Number(exp.variable_salary_amount).toLocaleString('pt-BR')}` : '—'} />
                                </div>
                            )}
                        </div>
                    ))}
                </section>

                {/* Habilidades */}
                <section className="mb-10">
                    <h2 className="text-xl font-black text-gray-900 mb-2">Habilidades</h2>
                    <p className="text-sm text-gray-400 mb-6">Mostre aos recrutadores seu nível profissional adicionando suas habilidades.</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {displaySkills.map((s: any, i: number) => (
                            <span key={i} className="px-4 py-2 bg-orange-50 text-[#F04E23] rounded-full text-xs font-bold border border-orange-100">
                                {s.name}
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Field label="Redes sociais" value={socials.linkedin || '—'} />
                        <Field label="Objetivo profissional" value={p.job_objective || '—'} />
                        <Field label="Diversidade" value={p.diversity_info || '—'} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Disp. para viajar?</label>
                            <div className="flex gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.availability_travel ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {p.availability_travel ? 'Sim' : 'Não'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Disp. para dormir?</label>
                            <div className="flex gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.availability_sleep ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {p.availability_sleep ? 'Sim' : 'Não'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Disp. para se mudar?</label>
                            <div className="flex gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.availability_move ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {p.availability_move ? 'Sim' : 'Não'}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Resultado comportamental */}
                <section className="mb-10">
                    <h2 className="text-xl font-black text-gray-900 mb-2">Resultado comportamental</h2>
                    <p className="text-sm text-gray-400 mb-6">Mostra ao recrutadores seu nível profissional mapeando os traços.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(testResults.length > 0 ? testResults : [1, 2, 3]).map((test: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-[#FFF7ED] rounded-2xl border border-orange-100 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-10 h-10 bg-[#F04E23] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <FileText size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">Teste comportamental {i + 1}</p>
                                    <p className="text-[10px] text-gray-400">PDF · 25 fev, 2023 · 213,5 KB</p>
                                </div>
                                <ArrowRight size={16} className="text-gray-400 flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Vagas */}
                <section>
                    <h2 className="text-xl font-black text-gray-900 mb-2">Vagas</h2>
                    <p className="text-sm text-gray-400 mb-6">Informações referentes às vagas cadastradas pela empresa.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { title: 'Analista de Marketing Digital', company: 'Digital Marketing Experts S/A', type: 'Remoto', salary: 'A combinar', period: 'Período flexível', match: 90 },
                            { title: 'Especialista em Recursos Hum...', company: 'Talent Management', type: 'Presencial', salary: 'R$ 5.000,00', period: 'Período flexível', match: 70 },
                            { title: 'Engenheiro', company: 'Data Innovation', type: 'Presencial', salary: 'R$ 10.000,00', period: 'Peri. Parcial', match: 20 },
                        ].map((job, i) => (
                            <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Building2 size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-blue-600 truncate">{job.title}</p>
                                        <p className="text-[10px] text-gray-400">{job.company}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-[11px] text-gray-500 mb-4">
                                    <div className="flex items-center gap-2"><MapPin size={12} /> {job.type}</div>
                                    <div className="flex items-center gap-2"><DollarSign size={12} /> {job.salary}</div>
                                    <div className="flex items-center gap-2"><Clock size={12} /> {job.period}</div>
                                </div>
                                <div className="mb-3">
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all"
                                            style={{
                                                width: `${job.match}%`,
                                                backgroundColor: job.match >= 70 ? '#10B981' : job.match >= 40 ? '#F59E0B' : '#EF4444'
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-right mt-1 font-bold" style={{ color: job.match >= 70 ? '#10B981' : job.match >= 40 ? '#F59E0B' : '#EF4444' }}>
                                        {job.match}% de aderência
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <span className="text-[#F04E23] text-xs font-bold cursor-pointer hover:underline">Ver mais</span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={10} /> 1 dia atrás</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

const Field: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">{label}</label>
        <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 font-medium border border-gray-100">
            {value || '—'}
        </div>
    </div>
);

export default CandidateDetailPage;
