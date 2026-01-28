import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessStep: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 text-center relative animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={40} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Perfil concluído</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
                Volte para página inicial e aplique para as vagas mais alinhadas ao seu perfil.
            </p>
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => navigate('/app/jobs')}
                    className="w-full py-3 bg-[#F04E23] hover:bg-[#d63f15] text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all"
                >
                    Ir para Vagas
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="w-full py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all"
                >
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default SuccessStep;
