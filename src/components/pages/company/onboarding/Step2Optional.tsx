import React from 'react';

interface Step2Props {
    data: any;
    onUpdate: (data: any) => void;
    onBack: () => void;
    onFinish: () => void;
    loading?: boolean;
}

const Step2Optional: React.FC<Step2Props> = ({ data, onUpdate, onBack, onFinish, loading }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ [e.target.name]: e.target.value });
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold text-gray-700 mb-6 border-b border-gray-100 pb-2">Perguntas opcionais</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Em qual setor sua empresa atua?</label>
                    <input name="sector" value={data.sector || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Sua empresa possui um departamento específico de Recursos Humanos, é terceirizado ou não possui?</label>
                    <input name="hrDepartment" value={data.hrDepartment || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Com que frequência você prefere ser notificado sobre novos candidatos ou mudanças no status das vagas?</label>
                    <input name="notificationFrequency" value={data.notificationFrequency || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Qual é a média de etapas no processo seletivo de sua empresa?</label>
                    <input name="averageStages" value={data.averageStages || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Qual é o maior desafio enfrentado atualmente no recrutamento de talentos?</label>
                    <input name="biggestChallenge" value={data.biggestChallenge || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Qual área tem maior a rotatividade?</label>
                    <input name="highestTurnoverArea" value={data.highestTurnoverArea || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Quantos currículos de candidatos você gostaria de receber por vaga?</label>
                    <input name="cvCountPreference" value={data.cvCountPreference || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Qual é o principal motivo para sua empresa utilizar uma plataforma de recrutamento?</label>
                    <input name="mainReason" value={data.mainReason || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Qual é o tempo médio que uma vaga fica aberta em sua empresa?</label>
                    <input name="averageOpenTime" value={data.averageOpenTime || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Como você imagina que a plataforma pode contribuir para os seus objetivos?</label>
                    <input name="platformContribution" value={data.platformContribution || ''} onChange={handleChange} type="text" placeholder="Sua resposta" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm" />
                </div>

            </div>

            <div className="mt-8 flex justify-between">
                <button
                    onClick={onBack}
                    className="px-8 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                    Voltar
                </button>
                <button
                    onClick={onFinish}
                    disabled={loading}
                    className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                    {loading ? 'Salvando...' : 'Finalizar'}
                </button>
            </div>
        </div>
    );
};

export default Step2Optional;
