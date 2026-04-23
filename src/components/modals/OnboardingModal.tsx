import React from 'react';
import { Sparkles, ArrowRight, UserCircle, ClipboardCheck, CheckCircle2, Circle } from 'lucide-react';
import { Logo } from '../ui/Icons';

interface OnboardingModalProps {
    onStart: () => void;
    professionalComplete?: boolean;
    behavioralComplete?: boolean;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
    onStart, 
    professionalComplete = false, 
    behavioralComplete = false 
}) => {
    const isFullyComplete = professionalComplete && behavioralComplete;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-500 relative">
                
                {/* Header Section */}
                <div className="pt-12 pb-8 px-10 text-center">
                    <div className="flex flex-col items-center gap-6 mb-8">
                        <div className="p-3 bg-orange-50 rounded-2xl">
                            <Logo className="scale-110" />
                        </div>
                        
                        <span className="px-4 py-1.5 bg-orange-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-200">
                            {isFullyComplete ? 'Perfil Concluído' : 'Primeiro acesso'}
                        </span>
                    </div>

                    <h2 className="text-4xl font-black text-gray-900 mb-4 leading-tight tracking-tight">
                        {isFullyComplete 
                            ? 'Tudo pronto para sua jornada! 🚀'
                            : 'Ficamos felizes em \n ter você aqui! 🚀'}
                    </h2>
                    
                    <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-md mx-auto">
                        {isFullyComplete 
                            ? 'Você completou seu cadastro. Agora vamos encontrar a vaga ideal para o seu perfil.'
                            : <>O <span className="text-[#F04E23] font-bold">Atua Vaga</span> utiliza inteligência comportamental para te conectar com a empresa ideal.</>}
                    </p>
                </div>

                {/* Steps Section */}
                <div className="px-10 pb-12">
                    <div className="grid grid-cols-1 gap-4 mb-10">
                        {/* Step 1 */}
                        <div className={`flex items-center gap-5 p-5 rounded-[24px] transition-all border ${
                            professionalComplete 
                            ? 'bg-blue-50/50 border-blue-100' 
                            : 'bg-[#F8FAFC] border-gray-100 group hover:border-blue-200'
                        }`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform ${
                                professionalComplete 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-blue-100 text-blue-600 group-hover:scale-110'
                            }`}>
                                <UserCircle size={28} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-gray-900 text-base">1. Cadastro Profissional</h4>
                                    {professionalComplete ? (
                                        <CheckCircle2 size={20} className="text-blue-600" />
                                    ) : (
                                        <Circle size={20} className="text-gray-200" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 font-medium mt-0.5">Habilidades que te fazem único para as empresas.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className={`flex items-center gap-5 p-5 rounded-[24px] transition-all border ${
                            behavioralComplete 
                            ? 'bg-orange-50/50 border-orange-100' 
                            : 'bg-[#F8FAFC] border-gray-100 group hover:border-orange-200'
                        }`}>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform ${
                                behavioralComplete 
                                ? 'bg-[#F04E23] text-white' 
                                : 'bg-orange-100 text-[#F04E23] group-hover:scale-110'
                            }`}>
                                <ClipboardCheck size={28} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-gray-900 text-base">2. Avaliação Comportamental</h4>
                                    {behavioralComplete ? (
                                        <CheckCircle2 size={20} className="text-[#F04E23]" />
                                    ) : (
                                        <Circle size={20} className="text-gray-200" />
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 font-medium mt-0.5">Descubra seu perfil ideal em poucos minutos.</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onStart}
                        className="w-full py-5 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/20 text-lg flex items-center justify-center gap-3 transform hover:-translate-y-1 active:translate-y-0"
                    >
                        {isFullyComplete 
                            ? 'Acessar meu painel' 
                            : professionalComplete 
                                ? 'Continuar para o teste'
                                : 'Começar jornada agora'}
                        <ArrowRight size={22} strokeWidth={3} />
                    </button>

                    <p className="text-center text-xs text-gray-400 font-bold mt-6 flex items-center justify-center gap-2">
                        {isFullyComplete ? (
                            <><CheckCircle2 size={14} className="text-blue-500" /> Seu perfil está pronto para o mercado!</>
                        ) : (
                            <><Sparkles size={14} className="text-orange-400" /> Leva menos de 5 minutos para completar seu perfil inicial</>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OnboardingModal;
