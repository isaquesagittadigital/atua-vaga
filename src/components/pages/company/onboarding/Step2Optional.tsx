import React from 'react';

interface Step2Props {
    data: any;
    onUpdate: (data: any) => void;
    onBack: () => void;
    onFinish: () => void;
    loading?: boolean;
}

const Step2Optional: React.FC<Step2Props> = ({ data, onUpdate, onBack, onFinish, loading }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        onUpdate({ [e.target.name]: e.target.value });
    };

    const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-sm bg-white";
    const labelClasses = "block text-sm font-bold text-gray-600 mb-2";

    const sectorOptions = ['Tecnologia', 'Varejo / Comércio', 'Indústria', 'Serviços', 'Saúde', 'Educação', 'Construção Civil', 'Logística', 'Agronegócio', 'Outros'];
    const notificationOptions = ['Tempo real', 'Diário', 'Semanal', 'Nunca'];
    const stagesOptions = ['1 a 2', '3 a 4', '5 ou mais'];
    const challengeOptions = ['Atração de talentos', 'Triagem de currículos', 'Retenção / Turnover', 'Custo de contratação', 'Alinhamento cultural', 'Falta de tempo no RH', 'Outros'];
    const departmentOptions = ['Comercial / Vendas', 'Operacional', 'Administrativo', 'Tecnologia / TI', 'Atendimento', 'Logística', 'Marketing', 'RH'];
    const cvPreferenceOptions = ['<10', '10-30', '31-50', '>50'];
    const mainReasonOptions = ['Centralizar processos', 'Triagem mais inteligente', 'Reduzir tempo de contratação', 'Criar banco de talentos', 'Outros'];
    const openTimeOptions = ['<15 dias', '15-30 dias', '31-60 dias', '>60 dias'];

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold text-gray-700 mb-6 border-b border-gray-100 pb-2">Perguntas opcionais</h2>

            <div className="space-y-8">
                {/* Setor */}
                <div>
                    <label className={labelClasses}>Em qual setor sua empresa atua?</label>
                    <select name="sector" value={data.sector || ''} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecione o setor</option>
                        {sectorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* RH Department (Radio) */}
                <div>
                    <label className={labelClasses}>Sua empresa possui um departamento específico de Recursos Humanos, é terceirizado ou não possui?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                        {['Interno', 'Terceirizado', 'Não possui'].map((option) => (
                            <label key={option} className={`
                                flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all
                                ${data.hrDepartment === option 
                                    ? 'border-[#F04E23] bg-orange-50 text-[#F04E23] ring-1 ring-[#F04E23]' 
                                    : 'border-gray-100 hover:border-gray-200 text-gray-500'}
                            `}>
                                <input type="radio" name="hrDepartment" value={option} checked={data.hrDepartment === option} onChange={handleChange} className="hidden" />
                                <span className="text-sm font-medium">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Notificações */}
                <div>
                    <label className={labelClasses}>Com que frequência você prefere ser notificado sobre novos candidatos ou mudanças no status das vagas?</label>
                    <select name="notificationFrequency" value={data.notificationFrequency || ''} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecione a frequência</option>
                        {notificationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Média de Etapas */}
                <div>
                    <label className={labelClasses}>Qual é a média de etapas no processo seletivo de sua empresa?</label>
                    <select name="averageStages" value={data.averageStages || ''} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecione a quantidade</option>
                        {stagesOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Maior Desafio */}
                <div>
                    <label className={labelClasses}>Qual é o maior desafio enfrentado atualmente no recrutamento de talentos?</label>
                    <select name="biggestChallenge" value={data.biggestChallenge || ''} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecione o desafio</option>
                        {challengeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Área com maior turnover */}
                <div>
                    <label className={labelClasses}>Qual área tem maior a rotatividade?</label>
                    <select name="highestTurnoverArea" value={data.highestTurnoverArea || ''} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecione o departamento</option>
                        {departmentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Currículos por vaga */}
                <div>
                    <label className={labelClasses}>Quantos currículos de candidatos você gostaria de receber por vaga?</label>
                    <select name="cvCountPreference" value={data.cvCountPreference || ''} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecione a quantidade</option>
                        {cvPreferenceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Motivo Principal */}
                <div>
                    <label className={labelClasses}>Qual é o principal motivo para sua empresa utilizar uma plataforma de recrutamento?</label>
                    <select name="mainReason" value={data.mainReason || ''} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecione o motivo</option>
                        {mainReasonOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Tempo Médio Aberta */}
                <div>
                    <label className={labelClasses}>Qual é o tempo médio que uma vaga fica aberta em sua empresa?</label>
                    <select name="averageOpenTime" value={data.averageOpenTime || ''} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecione o tempo</option>
                        {openTimeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* Contribuição da Plataforma (Textarea) */}
                <div>
                    <label className={labelClasses}>Como você imagina que a plataforma pode contribuir para os seus objetivos?</label>
                    <textarea 
                        name="platformContribution" 
                        value={data.platformContribution || ''} 
                        onChange={handleChange} 
                        rows={4}
                        placeholder="Descreva brevemente como podemos ajudar..." 
                        className={`${inputClasses} resize-none min-h-[120px]`} 
                    />
                </div>

            </div>

            <div className="mt-12 flex justify-between gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 sm:flex-none px-8 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                >
                    Voltar
                </button>
                <button
                    onClick={onFinish}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-12 py-4 bg-[#F04E23] text-white font-bold rounded-2xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 text-sm"
                >
                    {loading ? 'Salvando...' : 'Finalizar Onboarding'}
                </button>
            </div>
        </div>
    );
};

export default Step2Optional;
