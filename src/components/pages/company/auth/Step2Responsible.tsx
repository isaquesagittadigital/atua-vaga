import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface Step2Props {
    onNext: () => void;
    onBack: () => void;
    data: any;
    updateData: (data: any) => void;
}

const Step2Responsible: React.FC<Step2Props> = ({ onNext, onBack, data, updateData }) => {
    const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all font-medium text-[15px]";
    const labelClasses = "block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider";

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-800 font-black mb-8 hover:text-[#F04E23] transition-colors text-xs"
            >
                <ChevronLeft size={18} strokeWidth={3} /> Voltar
            </button>

            <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Responsável</h2>
                <p className="text-gray-500 font-bold text-[13px] leading-relaxed">Precisamos saber quem será o ponto de contato principal da empresa.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className={labelClasses}>Nome completo</label>
                    <input
                        type="text"
                        value={data.responsibleName}
                        onChange={(e) => updateData({ responsibleName: e.target.value })}
                        placeholder="Ex: José da Silva"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label className={labelClasses}>CPF do responsável</label>
                    <input
                        type="text"
                        value={data.cpf}
                        onChange={(e) => updateData({ cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label className={labelClasses}>Telefone de contato</label>
                    <input
                        type="tel"
                        value={data.responsiblePhone}
                        onChange={(e) => updateData({ responsiblePhone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className={inputClasses}
                    />
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-100 text-[16px] transform hover:-translate-y-1 active:translate-y-0 mt-4"
                >
                    Continuar
                </button>

                <div className="text-center mt-6">
                    <p className="text-[13px] text-gray-500 font-medium">
                        Já tem uma conta? <a href="/auth/company/login" className="text-gray-900 font-black hover:underline underline-offset-4 transition-all">Entre agora!</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step2Responsible;
