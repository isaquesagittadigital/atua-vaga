import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingSuccess: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-500 text-green-600">
                    <Check size={28} strokeWidth={3} />
                </div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-4">Formulário enviado!</h2>
            <p className="text-gray-500 font-medium text-lg text-center max-w-md mb-10">
                Obrigado por reservar um tempo para responder as perguntas.
            </p>

            <button
                onClick={() => navigate('/company/dashboard')}
                className="px-10 py-4 bg-[#F04E23] text-white font-black rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 text-lg"
            >
                Ir para tela inicial
            </button>
        </div>
    );
};

export default OnboardingSuccess;
