import React from 'react';

interface Step1Props {
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
}

const Step1Technical: React.FC<Step1Props> = ({ data, onUpdate, onNext }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold text-gray-700 mb-6 border-b border-gray-100 pb-2">Perguntas técnicas</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Em quantos dias você gostaria de fechar uma vaga anunciada na plataforma? *</label>
                    <input
                        name="daysToClose"
                        value={data.daysToClose || ''}
                        onChange={handleChange}
                        type="text"
                        placeholder="Sua resposta"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Qual a rotatividade média atualmente na empresa? *</label>
                    <input
                        name="turnover"
                        value={data.turnover || ''}
                        onChange={handleChange}
                        type="text"
                        placeholder="Sua resposta"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Você prefere receber muitos currículos ou ter uma seleção mais adequada e alinhada de candidatos? *</label>
                    <input
                        name="quantityVsQuality"
                        value={data.quantityVsQuality || ''}
                        onChange={handleChange}
                        type="text"
                        placeholder="Sua resposta"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Quantos colaboradores trabalham na empresa atualmente? *</label>
                    <input
                        name="employeeCount"
                        value={data.employeeCount || ''}
                        onChange={handleChange}
                        type="text"
                        placeholder="Sua resposta"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Você prioriza contratações rápidas ou uma triagem mais detalhada? *</label>
                    <input
                        name="speedVsDetail"
                        value={data.speedVsDetail || ''}
                        onChange={handleChange}
                        type="text"
                        placeholder="Sua resposta"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm"
                    />
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default Step1Technical;
