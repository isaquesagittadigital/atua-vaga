import React, { useState, useEffect } from 'react';
import { Briefcase, Flag, UserPlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Step1BasicData from './Step1BasicData';
import Step2Requirements from './Step2Requirements';
import Step3Screening from './Step3Screening';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const CreateJobPage: React.FC = () => {
    const { id } = useParams();
    const { user, session } = useAuth();
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);

    const [jobData, setJobData] = useState({
        title: '',
        companyName: '',
        role: '',
        location: '',
        workModel: '',
        area: '',
        specialization: '',
        level: '',
        description: '',
        contractType: '',
        journey: '',
        salary: '',
        requirements: {} as any,
        questions: [] as string[]
    });

    useEffect(() => {
        if (id) {
            fetchExistingJob();
        }
    }, [id]);

    const fetchExistingJob = async () => {
        setDataLoading(true);
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (data) {
                // Parse description if it contains our custom format
                let cleanDescription = data.description || '';
                const parts = cleanDescription.split('---');
                if (parts.length > 1) {
                    cleanDescription = parts[0].trim();
                }

                setJobData({
                    title: data.title || '',
                    companyName: '', // Usually fetched from the company profile
                    role: '', // We don't have this column yet, extracted from description if needed
                    location: data.location || '',
                    workModel: '',
                    area: '',
                    specialization: '',
                    level: '',
                    description: cleanDescription,
                    contractType: data.type || '',
                    journey: '',
                    salary: data.salary_range || '',
                    requirements: {},
                    questions: []
                });
            }
        } catch (error) {
            console.error('Error fetching job:', error);
            alert('Erro ao carregar dados da vaga.');
        } finally {
            setDataLoading(false);
        }
    };

    const updateJobData = (data: Partial<typeof jobData>) => {
        setJobData(prev => ({ ...prev, ...data }));
    };

    const handleSubmit = async () => {
        if (!user || !session) {
            alert("Você precisa estar logado para publicar uma vaga.");
            return;
        }

        try {
            setLoading(true);

            const fullDescription = `
${jobData.description}

---
**Detalhes da Vaga:**
- Cargo: ${jobData.role}
- Modelo: ${jobData.workModel}
- Área: ${jobData.area}
- Nível: ${jobData.level}
- Jornada: ${jobData.journey}
            `.trim();

            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const method = id ? 'PATCH' : 'POST';
            const url = id ? `${apiUrl}/jobs/${id}` : `${apiUrl}/jobs`;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    title: jobData.title,
                    description: fullDescription,
                    location: jobData.location,
                    type: jobData.contractType,
                    salary_range: jobData.salary,
                    status: 'active'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Falha ao ${id ? 'atualizar' : 'criar'} vaga`);
            }

            alert(`Vaga ${id ? 'atualizada' : 'publicada'} com sucesso!`);
            navigate('/company/dashboard');
        } catch (error: any) {
            console.error(error);
            alert(`Erro ao ${id ? 'atualizar' : 'publicar'} vaga: ` + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (dataLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#F04E23] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto w-full px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">{id ? 'Editar vaga' : 'Nova vaga'}</h1>
                <p className="text-gray-500">Baseado no seu perfil, preferências e requisitos da vaga.</p>
            </div>

            {/* Stepper Header */}
            <div className="bg-gray-100 rounded-t-2xl flex border-b border-gray-200 overflow-hidden mb-8">
                <StepHeaderItem
                    step={1}
                    current={step}
                    label="Dados básicos"
                    sub="Informações essenciais da vaga"
                    icon={<Briefcase size={20} />}
                />
                <StepHeaderItem
                    step={2}
                    current={step}
                    label="Dados adicionais"
                    sub="Destaque os diferenciais da vaga"
                    icon={<Flag size={20} />}
                />
                <StepHeaderItem
                    step={3}
                    current={step}
                    label="Perguntas de triagem"
                    sub="Identifique o candidato perfeito"
                    icon={<UserPlus size={20} />}
                />
            </div>

            <div className="bg-white border p-8 rounded-b-2xl shadow-sm min-h-[600px]">
                {step === 1 && (
                    <Step1BasicData
                        data={jobData}
                        onUpdate={updateJobData}
                        onNext={() => setStep(2)}
                        onCancel={() => navigate('/company/dashboard')}
                    />
                )}
                {step === 2 && (
                    <Step2Requirements
                        data={jobData}
                        onUpdate={updateJobData}
                        onNext={() => setStep(3)}
                        onBack={() => setStep(1)}
                    />
                )}
                {step === 3 && (
                    <Step3Screening
                        data={jobData}
                        onUpdate={updateJobData}
                        onFinish={handleSubmit}
                        onBack={() => setStep(2)}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
};

const StepHeaderItem: React.FC<{ step: number, current: number, label: string, sub: string, icon: React.ReactNode }> = ({ step, current, label, sub, icon }) => {
    const isActive = current === step;
    const isCompleted = current > step;

    return (
        <div className={`flex-1 p-6 flex items-center gap-4 transition-colors relative border-r border-gray-200 last:border-0 ${isActive ? 'bg-[#1D4ED8] text-white' : 'bg-[#F3F4F6] text-gray-500'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isActive ? 'border-blue-400 bg-blue-600' : 'border-gray-300 bg-white'}`}>
                {icon}
            </div>
            <div>
                <h4 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>{label}</h4>
                <p className={`text-xs ${isActive ? 'text-blue-200' : 'text-gray-500'}`}>{sub}</p>
            </div>
        </div>
    );
}

export default CreateJobPage;
