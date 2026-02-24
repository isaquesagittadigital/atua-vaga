import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, MapPin, DollarSign, Clock, Building2, FileText, ArrowRight } from 'lucide-react';

const CompanyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [company, setCompany] = useState<any>(null);
    const [owner, setOwner] = useState<any>(null);
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { if (id) fetchData(); }, [id]);

    const fetchData = async () => {
        setLoading(true);

        // Fetch company
        const { data: companyData } = await supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .single();

        if (companyData) {
            setCompany(companyData);

            // Fetch owner profile
            if (companyData.owner_id) {
                const { data: ownerData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', companyData.owner_id)
                    .single();
                setOwner(ownerData);
            }

            // Fetch jobs
            const { data: jobsData } = await supabase
                .from('jobs')
                .select('*')
                .eq('company_id', companyData.id)
                .order('created_at', { ascending: false })
                .limit(6);
            setJobs(jobsData || []);
        }

        setLoading(false);
    };

    // Fallback mock data
    const displayCompany = company || {
        name: 'Talent Management',
        industry: 'Gerenciamento de Projetos',
        document: '93.332.603/0001-71',
        description: 'Somos uma empresa dinâmica e comprometida com a inovação e a excelência, focada em transformar desafios em oportunidades por meio de soluções criativas e sustentáveis.',
        logo_url: null,
        updated_at: '2025-01-01',
    };

    const displayOwner = owner || {
        full_name: 'José de Alencar',
        email: 'olivia@ittadigital.com.br',
        phone: '+55 11 99239192',
        cpf: '000.000.000-00',
    };

    const mockJobs = [
        { id: '1', title: 'Gerente de Projetos', type: 'remote', salary_min: null, contract_type: 'VR/VT', work_schedule: 'Período flexível', created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: '2', title: 'Analista de Marketing Digital', type: 'remote', salary_min: null, contract_type: 'VR/VT', work_schedule: 'Período flexível', created_at: new Date(Date.now() - 172800000).toISOString() },
        { id: '3', title: 'Pessoa Recrutadora', type: 'remote', salary_min: null, contract_type: 'VR/VT', work_schedule: 'Período flexível', created_at: new Date(Date.now() - 259200000).toISOString() },
    ];

    const displayJobs = jobs.length > 0 ? jobs : mockJobs;

    const locationLabels: Record<string, string> = { remote: 'Remoto', onsite: 'Presencial', hybrid: 'Híbrido' };

    const timeSince = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Hoje';
        if (days === 1) return '1 dia atrás';
        return `${days} dias atrás`;
    };

    if (loading) return <div className="p-12 text-center text-gray-400">Carregando...</div>;

    return (
        <div className="p-12 max-w-[1200px] mx-auto">
            {/* Back */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-8 hover:text-gray-900 transition-colors">
                <ChevronLeft size={18} /> Voltar
            </button>

            <div className="bg-white rounded-3xl border border-gray-100 p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black">
                            {displayCompany.name?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">{displayCompany.name}</h1>
                            <p className="text-sm text-gray-400 font-medium">{displayCompany.industry}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Último acesso: {displayCompany.updated_at ? new Date(displayCompany.updated_at).toLocaleString('pt-BR') : '—'}</p>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            • Plano: Comece
                        </span>
                    </div>
                </div>

                {/* Dados pessoais */}
                <section className="mb-12">
                    <h2 className="text-xl font-black text-gray-900 mb-2">Dados pessoais</h2>
                    <p className="text-sm text-gray-400 mb-6">Informações referentes ao responsável da empresa.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Nome do Responsável" value={displayOwner.full_name} />
                        <Field label="E-mail" value={displayOwner.email} />
                        <Field label="Telefone" value={displayOwner.phone} />
                        <Field label="CPF" value={displayOwner.cpf} />
                        <Field label="Senha" value="••••••••••" />
                    </div>
                </section>

                {/* Empresa */}
                <section className="mb-12">
                    <h2 className="text-xl font-black text-gray-900 mb-2">Empresa</h2>
                    <p className="text-sm text-gray-400 mb-6">Informações referentes à empresa.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Field label="Nome da empresa" value={displayCompany.name} />
                        <Field label="CNPJ" value={displayCompany.document} />
                        <Field label="Áreas de atuação" value={displayCompany.industry} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Quem somos</label>
                        <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed">
                            {displayCompany.description || 'Sem descrição.'}
                        </div>
                    </div>
                </section>

                {/* Fit cultural */}
                <section className="mb-12">
                    <h2 className="text-xl font-black text-gray-900 mb-2">Fit cultural</h2>
                    <p className="text-sm text-gray-400 mb-6">Informações referentes aos testes da empresa.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-[#FFF7ED] rounded-2xl border border-orange-100 hover:shadow-md transition-all cursor-pointer">
                                <div className="w-10 h-10 bg-[#F04E23] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <FileText size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">Teste fit cultural {i}</p>
                                    <p className="text-[10px] text-gray-400">PDF · 25 fev, 2023 · 212,5 KB</p>
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
                        {displayJobs.map((job: any) => (
                            <div key={job.id} className="p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Building2 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-blue-600">{job.title}</p>
                                        <p className="text-[10px] text-gray-400">{displayCompany.name}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-[11px] text-gray-500 mb-4">
                                    <div className="flex items-center gap-2"><MapPin size={12} /> {locationLabels[job.type] || job.type}</div>
                                    <div className="flex items-center gap-2"><DollarSign size={12} /> A combinar</div>
                                    <div className="flex items-center gap-2"><Clock size={12} /> {job.work_schedule || 'Período flexível'}</div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                    <span className="text-[#F04E23] text-xs font-bold cursor-pointer hover:underline">Ver mais</span>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <Clock size={10} /> {timeSince(job.created_at)}
                                    </span>
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

export default CompanyDetailPage;
