
import React from 'react';
import { Sparkles, ArrowRight, UserCircle, ClipboardCheck } from 'lucide-react';

interface OnboardingModalProps {
    onStart: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onStart }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Header Decoration */}
                <div className="h-32 bg-gradient-to-br from-[#F04E23] to-[#FF8A65] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                        <Sparkles size={120} className="text-white" />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-8">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/30">
                                Primeiro acesso
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-10 pt-8">
                    <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                        Ficamos felizes em ter você aqui! 🚀
                    </h2>
                    <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                        O **Atua Vaga** utiliza inteligência comportamental para te conectar com a empresa ideal. Para começar sua jornada, precisamos de dois passos simples:
                    </p>

                    <div className="space-y-6 mb-10">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <UserCircle size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 text-sm">1. Cadastro Profissional</h4>
                                <p className="text-xs text-gray-400 font-medium mt-1">Preencha suas experiências e habilidades para ser encontrado pelas empresas.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F04E23] flex items-center justify-center shrink-0">
                                <ClipboardCheck size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 text-sm">2. Avaliação Comportamental</h4>
                                <p className="text-xs text-gray-400 font-medium mt-1">Realize nosso teste de mapeamento para descobrir seu perfil ideal.</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onStart}
                        className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-100 text-base flex items-center justify-center gap-2 transform hover:-translate-y-1 active:translate-y-0"
                    >
                        Começar agora
                        <ArrowRight size={20} strokeWidth={3} />
                    </button>

                    <p className="text-center text-[11px] text-gray-400 font-medium mt-6">
                        Leva menos de 5 minutos para completar seu perfil inicial.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
