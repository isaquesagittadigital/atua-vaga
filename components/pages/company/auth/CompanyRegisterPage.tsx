import React, { useState } from 'react';
import Step1Account from './Step1Account';
import Step2Responsible from './Step2Responsible';
import Step3Company from './Step3Company';
import PaymentMethodModal from '../../../modals/PaymentMethodModal';

const CompanyRegisterPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Calculate step progress for "Etapa X de 3"
    const stepText = `Etapa ${step} de 3`;

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);
    const handleComplete = () => setShowPaymentModal(true);

    return (
        <div className="w-full flex justify-center">
            <div className="w-full max-w-[400px]">
                {/* Step Indicator (Top Right) */}
                {!showPaymentModal && (
                    <div className="flex justify-end mb-4">
                        <span className="text-xs font-bold text-gray-400">{stepText}</span>
                    </div>
                )}

                {step === 1 && <Step1Account onNext={handleNext} onGoogleLogin={() => { }} />}
                {step === 2 && <Step2Responsible onNext={handleNext} onBack={handleBack} />}
                {step === 3 && <Step3Company onComplete={handleComplete} onBack={handleBack} />}
            </div>

            {showPaymentModal && (
                <PaymentMethodModal onClose={() => setShowPaymentModal(false)} />
            )}
        </div>
    );
};

export default CompanyRegisterPage;
