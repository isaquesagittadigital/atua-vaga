
import React, { useState, useEffect } from 'react';
import Step1Technical from '../pages/company/onboarding/Step1Technical';
import Step2Optional from '../pages/company/onboarding/Step2Optional';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface CompanyOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: () => void;
}

const CompanyOnboardingModal: React.FC<CompanyOnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const { session, company } = useAuth();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // State to hold all onboarding data
    const [formData, setFormData] = useState<any>({
        technical: {},
        optional: {}
    });

    useEffect(() => {
        if (!isOpen || !company?.id) {
            if (!isOpen) setStep(1);
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
    }, [isOpen, company?.id]);

    const updateFormData = (section: 'technical' | 'optional', data: any) => {
        setFormData(prev => ({
            ...prev,
            [section]: { ...prev[section], ...data }
        }));
    };

    const handleFinish = async () => {
        if (!session || !company) return;
        setLoading(true);

        try {
            const updates: any = {};
            if (formData.technical.employeeCount) updates.company_size = formData.technical.employeeCount;
            if (formData.optional.sector) updates.industry = formData.optional.sector;
            
            updates.onboarding_data = formData;
            updates.onboarding_completed = true;

            const { error } = await supabase
                .from('companies')
                .update(updates)
                .eq('id', company.id);

            if (error) throw error;

            if (onComplete) onComplete();
            onClose();
        } catch (error) {
            console.error('Error saving onboarding:', error);
            alert('Erro ao salvar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Onboarding da Empresa</h2>
                        <p className="text-sm text-gray-500">Configure seu perfil para melhores resultados</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-400" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-8 pt-8 pb-4 shrink-0">
                    <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="absolute top-0 left-0 h-full bg-[#F04E23] transition-all duration-500 rounded-full"
                            style={{ width: step === 1 ? '50%' : '100%' }}
                        />
                    </div>
                    <div className="flex justify-between mt-3 px-1">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${step === 1 ? 'text-[#F04E23]' : 'text-gray-400'}`}>
                            1. Perguntas Técnicas
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${step === 2 ? 'text-[#F04E23]' : 'text-gray-400'}`}>
                            2. Perguntas Opcionais
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {dataLoading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <div className="w-8 h-8 border-3 border-[#F04E23] border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-gray-500 font-medium">Carregando dados...</p>
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <Step1Technical
                                    data={formData.technical}
                                    onUpdate={(data) => updateFormData('technical', data)}
                                    onNext={() => setStep(2)}
                                    onCancel={onClose}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyOnboardingModal;
