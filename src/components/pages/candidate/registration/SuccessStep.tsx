import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessStep: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 text-center relative animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Perfil concluído!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                Seu cadastro profissional foi salvo com sucesso. Agora, o próximo passo essencial é realizar sua **avaliação comportamental** para que as empresas conheçam seu perfil!
            </p>
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => navigate('/app/behavioral-test')}
                    className="w-full py-4 bg-[#F04E23] hover:bg-[#d63f15] text-white font-black rounded-2xl shadow-xl shadow-orange-100 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
                >
                    Realizar avaliação
                    <ArrowRight size={18} strokeWidth={3} />
                </button>
                <button
                    onClick={() => navigate('/app/dashboard')}
                    className="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-all text-sm"
                >
                    Ir para o Dashboard
                </button>
            </div>
        </div>
    );
};

export default SuccessStep;
