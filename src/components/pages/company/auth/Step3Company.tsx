import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface Step3Props {
    onComplete: () => void;
    onBack: () => void;
    data: any;
    updateData: (data: any) => void;
}

const Step3Company: React.FC<Step3Props> = ({ onComplete, onBack, data, updateData }) => {
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
                <h2 className="text-3xl font-black text-gray-900 mb-2">Dados Empresa</h2>
                <p className="text-gray-500 font-bold text-[13px] leading-relaxed">Quase lá! Agora insira os dados oficiais da sua empresa.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className={labelClasses}>Nome da Empresa / Razão Social</label>
                    <input
                        type="text"
                        value={data.companyName}
                        onChange={(e) => updateData({ companyName: e.target.value })}
                        placeholder="Ex: Minha Empresa LTDA"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label className={labelClasses}>CNPJ</label>
                    <input
                        type="text"
                        value={data.document}
                        onChange={(e) => updateData({ document: e.target.value })}
                        placeholder="00.000.000/0001-00"
                        className={inputClasses}
                    />
                </div>

                <button
                    onClick={onComplete}
                    className="w-full py-4 bg-[#1E293B] hover:bg-[#0F172A] text-white font-black rounded-2xl transition-all shadow-lg shadow-slate-100 text-[16px] transform hover:-translate-y-1 active:translate-y-0 mt-4"
                >
                    Finalizar Cadastro
                </button>

                <div className="text-center mt-6">
                    <p className="text-[13px] text-gray-500 font-medium">
                        Ao finalizar, você concorda com nossos <a href="/termos" target="_blank" className="text-gray-900 font-bold hover:underline">Termos</a> e <a href="/privacidade" target="_blank" className="text-gray-900 font-bold hover:underline">Privacidade</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Step3Company;
