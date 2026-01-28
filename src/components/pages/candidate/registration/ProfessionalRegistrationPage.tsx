import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PersonalDataForm from './PersonalDataForm';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import SkillsForm from './SkillsForm';
import SuccessStep from './SuccessStep';

const ProfessionalRegistrationPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4; // Excluding SuccessStep

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const { profile } = useAuth(); // Need profile access here

    useEffect(() => {
        // Heuristic: If profile has salary_objective, assume wizard is done.
        // User could be returning to edit.
        if (profile && profile.salary_objective) {
            setCurrentStep(99); // 99 = Single Page Edit Mode
        }
    }, [profile]);

    const renderStep = () => {
        if (currentStep === 99) {
            return (
                <div className="space-y-8">
                    <PersonalDataForm onNext={() => { }} />
                    <EducationForm onNext={() => { }} />
                    <ExperienceForm onNext={() => { }} />
                    <SkillsForm onNext={() => { }} />
                </div>
            );
        }

        if (currentStep === 5) {
            return (
                <div className="relative">
                    {/* Review Banner */}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-[#F04E23] font-bold">Deseja editar alguma informação?</span>
                            <p className="text-sm text-gray-500">Seu perfil já está salvo, mas você pode revisar e alterar se necessário.</p>
                        </div>
                        <button
                            onClick={() => setCurrentStep(99)} // Go to Single Page Edit instead of Step 1
                            className="px-4 py-2 bg-white text-[#F04E23] font-bold rounded-lg border border-orange-200 hover:bg-orange-50"
                        >
                            Editar perfil
                        </button>
                    </div>

                    <div className="space-y-8 opacity-50 pointer-events-none select-none grayscale-[0.5]">
                        <PersonalDataForm onNext={() => { }} readOnly={true} />
                        <EducationForm onNext={() => { }} readOnly={true} />
                        <ExperienceForm onNext={() => { }} readOnly={true} />
                        <SkillsForm onNext={() => { }} readOnly={true} />
                    </div>

                    {/* Success Modal Overlay */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                        <SuccessStep />
                    </div>
                </div>
            );
        }

        switch (currentStep) {
            case 1:
                return <PersonalDataForm onNext={nextStep} />;
            case 2:
                return <EducationForm onNext={nextStep} onBack={prevStep} />;
            case 3:
                return <ExperienceForm onNext={nextStep} />;
            case 4:
                return <SkillsForm onNext={nextStep} />;
            default:
                return <PersonalDataForm onNext={nextStep} />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-4xl mx-auto px-4 py-12">
                {/* Header only for non-success steps to clean up UI behind modal */}
                {currentStep <= totalSteps && (
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Cadastro profissional</h1>
                        <p className="text-gray-500 max-w-lg mx-auto">
                            Preencha as informações abaixo para concluir seu cadastro profissional.
                        </p>
                    </div>
                )}

                {/* Main Content Area */}
                {renderStep()}
            </main>
        </div>
    );
};

export default ProfessionalRegistrationPage;
