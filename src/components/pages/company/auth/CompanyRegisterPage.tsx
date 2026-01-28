
import React, { useState } from 'react';
import Step1Account from './Step1Account';
import Step2Responsible from './Step2Responsible';
import Step3Company from './Step3Company';
import PaymentMethodModal from '../../../modals/PaymentMethodModal';
import { useAuth } from '@/contexts/AuthContext';

const CompanyRegisterPage: React.FC = () => {
    const { signUp } = useAuth();
    const [step, setStep] = useState(1);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        responsibleName: '',
        responsiblePhone: '',
        companyName: '',
        document: '' // CNPJ
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
                cpf: formData.cpf || '00000000000' // Use collected CPF or placeholder
            });
            setShowPaymentModal(true);
        } catch (error) {
            console.error("Registration failed", error);
            alert("Erro ao registrar: " + error);
        }
    };

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[400px]">
                {/* Step Indicator (Top Right) */}
                {!showPaymentModal && (
                    <div className="flex justify-end mb-4">
                        <span className="text-xs font-bold text-gray-400">{stepText}</span>
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
