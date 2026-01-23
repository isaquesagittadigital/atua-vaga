import React from 'react';

interface StepProps {
    onNext: () => void;
    onBack: () => void;
}

const Step2Requirements: React.FC<StepProps> = ({ onNext, onBack }) => {
    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Requisitos da vaga</h3>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Tempo de experiência exigido</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white">
                            <option>Selecione o tempo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Sexo</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white">
                            <option>Selecione o sexo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Escolaridade</label>
                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white">
                            <option>Selecione o grau de escolaridade</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RadioGroup label="Disponibilidade para viajar?" name="travel" />
                    <RadioGroup label="Disponibilidade para dormir?" name="sleep" />
                    <RadioGroup label="Disponibilidade para se mudar?" name="move" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Idade mínima</label>
                        <input type="text" placeholder="Informe somente o nº" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Idade máxima</label>
                        <input type="text" placeholder="Informe somente o nº" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" />
                    </div>
                    <RadioGroup label="Requer experiência?" name="exp" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RadioGroup label="Requer CNH?" name="cnh" />
                    {/* Types of CNH (Checkbox group visually similar to radios in snippet) */}
                    <div className="col-span-1">
                        <label className="block text-xs text-gray-500 mb-1.5">Tipo de CNH?</label>
                        <div className="flex gap-3">
                            {['A', 'B', 'C', 'D', 'E'].map(type => (
                                <label key={type} className="flex items-center gap-1 cursor-pointer">
                                    <input type="checkbox" className="rounded text-[#F04E23] focus:ring-[#F04E23]" />
                                    <span className="text-sm text-gray-600">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Cursos preferênciais</label>
                        <input type="text" placeholder="Informe os cursos" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Número Limite de Candidatos</label>
                        <input type="text" placeholder="Informe a quantidade" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" />
                        <p className="text-[10px] text-gray-400 mt-1">Quando atingir o número de inscrições acima a vaga é encerrada.</p>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Tempo médio emprego anterior</label>
                        <input type="text" placeholder="Informe a quantidade" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" />
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 pt-4">Diferencial</h3>
                <div>
                    <label className="block text-xs text-gray-500 mb-3">Marque os benefícios que sua empresa oferece para esta vaga:</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['VR', 'VA', 'VT', 'Plano de saúde', 'Plano odontológico', 'Plano bem-estar', 'Auxílio escolar', 'Auxílio medicamento', 'Previdência privada', 'Participação de lucro', 'Comissão', 'Outro'].map(b => (
                            <label key={b} className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-[#F04E23] focus:ring-[#F04E23]" />
                                <span className="text-sm text-gray-600">{b}</span>
                            </label>
                        ))}
                    </div>
                </div>

            </div>

            <div className="mt-12 flex justify-end gap-4 border-t border-gray-50 pt-6">
                <button onClick={onBack} className="px-8 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                    Voltar
                </button>
                <button onClick={onNext} className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20">
                    Continuar
                </button>
            </div>
        </div>
    );
};

const RadioGroup: React.FC<{ label: string, name: string }> = ({ label, name }) => (
    <div>
        <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
        <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={name} className="text-[#F04E23] focus:ring-[#F04E23]" />
                <span className="text-sm text-gray-600">Sim</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={name} className="text-[#F04E23] focus:ring-[#F04E23]" />
                <span className="text-sm text-gray-600">Não</span>
            </label>
        </div>
    </div>
);

export default Step2Requirements;
