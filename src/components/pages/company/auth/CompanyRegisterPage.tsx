
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1Account from './Step1Account';
import Step2Responsible from './Step2Responsible';
import Step3Company from './Step3Company';
import PaymentMethodModal from '../../../modals/PaymentMethodModal';
import { useAuth } from '@/contexts/AuthContext';

const CompanyRegisterPage: React.FC = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        responsibleName: '',
        responsiblePhone: '',
        companyName: '',
        document: '', // CNPJ
        cpf: ''
    });

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    // Calculate step progress for "Etapa X de 3"
    const stepText = `Etapa ${step} de 3`;

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    // Called when Step 3 finishes (or Payment finishes?)
    // For now let's assume registration happens BEFORE payment modal or triggering payment modal DOES registration?
    // Let's Register first, then show modal.
    const handleComplete = async () => {
        try {
            await signUp(formData.email, formData.password, {
                role: 'company_admin',
                name: formData.responsibleName,
                phone: formData.responsiblePhone,
                companyName: formData.companyName,
                document: formData.document,
                cpf: formData.cpf
            });
            
            // Redirect to plans page instead of showing modal directly
            navigate('/auth/company/plans');
        } catch (error) {
            console.error("Registration failed", error);
            alert("Erro ao registrar: " + error);
        }
    };

    return (
        <div className="w-full max-w-[450px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white px-10 py-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 relative">
                {/* Step Indicator (Refined) */}
                {!showPaymentModal && (
                    <div className="absolute top-8 right-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#F04E23] bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                            {stepText}
                        </span>
                    </div>
                )}

                {step === 1 && (
                    <Step1Account
                        onNext={handleNext}
                        onGoogleLogin={() => { }}
                        data={formData}
                        updateData={updateFormData}
                    />
                )}
                {step === 2 && (
                    <Step2Responsible
                        onNext={handleNext}
                        onBack={handleBack}
                        data={formData}
                        updateData={updateFormData}
                    />
                )}
                {step === 3 && (
                    <Step3Company
                        onComplete={handleComplete}
                        onBack={handleBack}
                        data={formData}
                        updateData={updateFormData}
                    />
                )}
            </div>

            {showPaymentModal && (
                <PaymentMethodModal onClose={() => setShowPaymentModal(false)} />
            )}
        </div>
    );
};

export default CompanyRegisterPage;
