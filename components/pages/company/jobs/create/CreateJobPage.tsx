import React, { useState } from 'react';
import { Briefcase, Flag, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Step1BasicData from './Step1BasicData';
import Step2Requirements from './Step2Requirements';
import Step3Screening from './Step3Screening';

const CreateJobPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    return (
        <div className="max-w-[1200px] mx-auto w-full px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Nova vaga</h1>
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
                {step === 1 && <Step1BasicData onNext={() => setStep(2)} onCancel={() => navigate('/company/jobs')} />}
                {step === 2 && <Step2Requirements onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                {step === 3 && <Step3Screening onFinish={() => navigate('/company/jobs')} onBack={() => setStep(2)} />}
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
