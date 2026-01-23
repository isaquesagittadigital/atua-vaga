import React, { useState } from 'react';
import Step1Technical from './Step1Technical';
import Step2Optional from './Step2Optional';
import OnboardingSuccess from './OnboardingSuccess';
import { Logo } from '../../../ui/Icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../src/contexts/AuthContext';

const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);

    // State to hold all onboarding data
    const [formData, setFormData] = useState({
        technical: {},
        optional: {}
    });

    const updateFormData = (section: 'technical' | 'optional', data: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], ...data }
        }));
    };

    const handleFinish = async () => {
        if (!session) return;
        setLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${apiUrl}/company/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save onboarding data');

            setStep(3); // Show success screen
        } catch (error) {
            console.error('Error saving onboarding:', error);
            alert('Erro ao salvar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <OnboardingSuccess />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="w-full h-20 border-b border-gray-100 flex items-center justify-between px-8 md:px-16 container mx-auto">
                <div className="flex items-center gap-2">
                    <Logo className="scale-75 origin-left" />
                </div>

                {/* Simple Menu for Context */}
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
                    <span className="text-gray-900">Indicadores</span>
                    <span>Minhas vagas</span>
                    <span>Candidatos</span>
                    <span>Seleção</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Profile Avatar Mock */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" alt="Profile" className="w-full h-full object-cover grayscale" />
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-6 py-12 max-w-4xl">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Onboarding</h1>
                <p className="text-gray-500 mb-10">Responda as perguntas abaixo para conhecermos melhor o perfil da sua empresa.</p>

                <div className="bg-white border border-gray-100 rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">

                    {/* Progress Bar */}
                    <div className="mb-12 relative px-4">
                        <div className="h-1 bg-gray-100 w-full absolute top-[11px] left-0 z-0"></div>
                        <div
                            className="h-1 bg-[#1D4ED8] absolute top-[11px] left-0 z-0 transition-all duration-500"
                            style={{ width: step === 1 ? '30%' : step === 2 ? '70%' : '100%' }}
                        ></div>

                        <div className="flex justify-between relative z-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center ${step >= 1 ? 'border-[#1D4ED8] bg-white' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-[#1D4ED8]' : 'bg-transparent'}`}></div>
                                </div>
                                <div className="text-center">
                                    <span className={`block text-xs font-black ${step === 1 ? 'text-[#1D4ED8]' : 'text-gray-400'}`}>Perguntas técnicas</span>
                                    {step === 1 && <span className="text-[10px] text-[#1D4ED8] max-w-[150px] block leading-tight mt-1">Responda as perguntas abaixo para melhorar a busca por perfis compatíveis com o da sua empresa.</span>}
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-6 h-6 rounded-full border-[3px] flex items-center justify-center ${step >= 2 ? 'border-[#1D4ED8] bg-white' : 'border-gray-200 bg-white'}`}>
                                    <div className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-[#1D4ED8]' : 'bg-transparent'}`}></div>
                                </div>
                                <div className="text-center">
                                    <span className={`block text-xs font-black ${step === 2 ? 'text-[#1D4ED8]' : 'text-gray-400'}`}>Perguntas opcionais</span>
                                    {step === 2 && <span className="text-[10px] text-[#1D4ED8] max-w-[150px] block leading-tight mt-1">Daqui em diante não é necessário responder agora, mas faça assim que conseguir pois será importante para nos ajudá-lo na sua jornada.</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {step === 1 && (
                        <Step1Technical
                            data={formData.technical}
                            onUpdate={(data) => updateFormData('technical', data)}
                            onNext={() => setStep(2)}
                        />
                    )}
                    {step === 2 && (
                        <Step2Optional
                            data={formData.optional}
                            onUpdate={(data) => updateFormData('optional', data)}
                            onBack={() => setStep(1)}
                            onFinish={handleFinish}
                            loading={loading}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default OnboardingPage;
