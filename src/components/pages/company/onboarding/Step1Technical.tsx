import React from 'react';

interface Step1Props {
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onCancel?: () => void;
}

const Step1Technical: React.FC<Step1Props> = ({ data, onUpdate, onNext, onCancel }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onUpdate({ [e.target.name]: e.target.value });
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm bg-white";
    const labelClasses = "block text-sm font-bold text-gray-600 mb-2";

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold text-gray-700 mb-6 border-b border-gray-100 pb-2">Perguntas técnicas</h2>

            <div className="space-y-8">
                {/* 1. Tempo de fechamento */}
                <div>
                    <label className={labelClasses}>Em quantos dias você gostaria de fechar uma vaga anunciada na plataforma? *</label>
                    <select
                        name="daysToClose"
                        value={data.daysToClose || ''}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option value="">Selecione o prazo</option>
                        <option value="7">7 dias</option>
                        <option value="15">15 dias</option>
                        <option value="30">30 dias</option>
                        <option value="45">45 dias</option>
                        <option value="60">60 dias</option>
                        <option value="90">90 dias</option>
                        <option value="120">120 dias</option>
                    </select>
                </div>

                {/* 2. Rotatividade */}
                <div>
                    <label className={labelClasses}>Qual a rotatividade média atualmente na empresa? *</label>
                    <select
                        name="turnover"
                        value={data.turnover || ''}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option value="">Selecione a rotatividade</option>
                        <option value="Baixa (<5%)">Baixa (&lt;5%)</option>
                        <option value="Média (5-15%)">Média (5-15%)</option>
                        <option value="Alta (>15%)">Alta (&gt;15%)</option>
                        <option value="Não sei">Não sei</option>
                    </select>
                </div>

                {/* 3. Volume vs Qualidade (Radio) */}
                <div>
                    <label className={labelClasses}>Você prefere receber muitos currículos ou ter uma seleção mais adequada e alinhada de candidatos? *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                        {['Volume', 'Qualidade', 'Equilíbrio'].map((option) => (
                            <label key={option} className={`
                                flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all
                                ${data.quantityVsQuality === option 
                                    ? 'border-[#F04E23] bg-orange-50 text-[#F04E23] ring-1 ring-[#F04E23]' 
                                    : 'border-gray-100 hover:border-gray-200 text-gray-500'}
                            `}>
                                <input
                                    type="radio"
                                    name="quantityVsQuality"
                                    value={option}
                                    checked={data.quantityVsQuality === option}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 4. Colaboradores */}
                <div>
                    <label className={labelClasses}>Quantos colaboradores trabalham na empresa atualmente? *</label>
                    <select
                        name="employeeCount"
                        value={data.employeeCount || ''}
                        onChange={handleChange}
                        className={inputClasses}
                    >
                        <option value="">Selecione a quantidade</option>
                        <option value="1-9">1-9 colaboradores</option>
                        <option value="10-49">10-49 colaboradores</option>
                        <option value="50-99">50-99 colaboradores</option>
                        <option value="100-499">100-499 colaboradores</option>
                        <option value="500+">Mais de 500</option>
                    </select>
                </div>

                {/* 5. Velocidade vs Detalhamento (Radio) */}
                <div>
                    <label className={labelClasses}>Você prioriza contratações rápidas ou uma triagem mais detalhada? *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                        {['Rapidez', 'Detalhamento', 'Depende da urgência'].map((option) => (
                            <label key={option} className={`
                                flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all
                                ${data.speedVsDetail === option 
                                    ? 'border-[#F04E23] bg-orange-50 text-[#F04E23] ring-1 ring-[#F04E23]' 
                                    : 'border-gray-100 hover:border-gray-200 text-gray-500'}
                            `}>
                                <input
                                    type="radio"
                                    name="speedVsDetail"
                                    value={option}
                                    checked={data.speedVsDetail === option}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span className="text-sm font-medium">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-12 flex justify-between gap-4">
                <button
                    onClick={onCancel}
                    className="flex-1 sm:flex-none px-8 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                >
                    Cancelar
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 sm:flex-none px-12 py-4 bg-[#F04E23] text-white font-bold rounded-2xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default Step1Technical;
