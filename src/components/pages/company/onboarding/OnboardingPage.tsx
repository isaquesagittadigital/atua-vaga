import React, { useState } from 'react';
import Step1Technical from './Step1Technical';
import Step2Optional from './Step2Optional';
import OnboardingSuccess from './OnboardingSuccess';
import { Logo } from '../../../ui/Icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const { session, company, signOut, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // State to hold all onboarding data
    const [formData, setFormData] = useState<any>({
        technical: {},
        optional: {}
    });

    // Fetch existing onboarding data when company becomes available
    React.useEffect(() => {
        // Wait for auth context to finish loading
        if (authLoading) return;

        // Auth is done - if no company exists for this user, just show form empty
        if (!company?.id) {
            setDataLoading(false);
            return;
        }

        const fetchOnboardingData = async () => {
            setDataLoading(true);
            try {
                const { data, error } = await supabase
                    .from('companies')
                    .select('onboarding_data')
                    .eq('id', company.id)
                    .single();
                    
                if (error) {
                    console.error('Error fetching onboarding data:', error);
                } else if (data?.onboarding_data && Object.keys(data.onboarding_data).length > 0) {
                    setFormData({
                        technical: data.onboarding_data.technical || {},
                        optional: data.onboarding_data.optional || {}
                    });
                }
            } catch (err) {
                console.error('Error fetching existing onboarding data', err);
            } finally {
                setDataLoading(false);
            }
        };

        fetchOnboardingData();
    }, [authLoading, company?.id]);

    const updateFormData = (section: 'technical' | 'optional', data: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], ...data }
        }));
    };

    const handleCancel = async () => {
        try {
            if (signOut) {
                await signOut();
            }
            navigate('/auth/login');
        } catch (error) {
            console.error('Error logging out on cancel:', error);
            navigate('/auth/login');
        }
    };

    const handleFinish = async () => {
        if (!session) return;
        setLoading(true);

        try {
            // Se o usuário possuir a empresa vinculada no Contexto, envia para o banco
            if (company) {
                const updates: any = {};
                if (formData.technical.employeeCount) updates.company_size = formData.technical.employeeCount;
                if (formData.optional.sector) updates.industry = formData.optional.sector;
                
                // Grava o JSON estruturado diretamente na coluna certa e também acusa término globalmente
                updates.onboarding_data = formData;
                updates.onboarding_completed = true;

                const { error } = await supabase
                    .from('companies')
                    .update(updates)
                    .eq('id', company.id);

                if (error) {
                    console.error('Erro ao atualizar dados da empresa no Supabase:', error);
                }
            }

            // Mark onboarding as completed for this user in local storage
            if (session.user) {
                localStorage.setItem(`onboarding_completed_${session.user.id}`, 'true');
            }

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

    if (dataLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#F04E23] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Carregando seus dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">


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
                            onCancel={handleCancel}
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
