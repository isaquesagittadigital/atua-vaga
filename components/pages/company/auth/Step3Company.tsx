import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface Step3Props {
    onComplete: () => void;
    onBack: () => void;
}

const Step3Company: React.FC<Step3Props> = ({ onComplete, onBack }) => {
    return (
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-8 duration-500">
            <button
                onClick={onBack}
                className="flex items-center gap-1 text-gray-500 font-bold text-sm mb-8 hover:text-[#F04E23] transition-colors"
            >
                <ChevronLeft size={18} /> Voltar
            </button>

            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Cadastrar</h2>
                <p className="text-gray-500 font-medium text-sm">Insira suas informações para realizar o cadastro.<br />Levará menos de 1 minuto!</p>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Nome da empresa</label>
                    <input
                        type="text"
                        defaultValue="Talent Management"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all font-medium"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">CNPJ</label>
                    <input
                        type="text"
                        defaultValue="93.332.603/0001-71"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all font-medium"
                    />
                </div>

                <button
                    onClick={onComplete}
                    className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-xl transition-all shadow-lg shadow-orange-500/20 text-[15px] mt-4"
                >
                    Finalizar cadastro
                </button>

                <div className="text-center mt-2">
                    <p className="text-sm font-bold text-gray-500">
                        Já tem uma conta? <a href="/auth/login" className="text-gray-900 hover:text-[#F04E23] transition-colors">Entre agora!</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step3Company;
