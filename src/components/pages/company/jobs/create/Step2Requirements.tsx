import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface StepProps {
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

const Step2Requirements: React.FC<StepProps> = ({ data, onUpdate, onNext, onBack }) => {
    const [experienceLevels, setExperienceLevels] = useState<any[]>([]);
    const [genders, setGenders] = useState<any[]>([]);
    const [educationLevels, setEducationLevels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequirementData = async () => {
            setLoading(true);
            try {
                const [expRes, genderRes, eduRes] = await Promise.all([
                    supabase.from('experience_levels').select('*').order('name'),
                    supabase.from('genders').select('*').order('name'),
                    supabase.from('education_levels').select('*').order('name')
                ]);

                if (expRes.data) setExperienceLevels(expRes.data);
                if (genderRes.data) setGenders(genderRes.data);
                if (eduRes.data) setEducationLevels(eduRes.data);
            } catch (error) {
                console.error('Error fetching requirement data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequirementData();
    }, []);

    const updateRequirement = (field: string, value: any) => {
        onUpdate({
            requirements: {
                ...data.requirements,
                [field]: value
            }
        });
    };

    const handleNumericChange = (field: string, value: string) => {
        const numericValue = value.replace(/\D/g, '');
        updateRequirement(field, numericValue);
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Requisitos da vaga</h3>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Tempo de experiência exigido</label>
                        <select 
                            value={data.requirements.experience || ''}
                            onChange={(e) => updateRequirement('experience', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white"
                        >
                            <option value="">Selecione o tempo</option>
                            {experienceLevels.map(lvl => (
                                <option key={lvl.id} value={lvl.name}>{lvl.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Sexo</label>
                        <select 
                            value={data.requirements.gender || ''}
                            onChange={(e) => updateRequirement('gender', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white"
                        >
                            <option value="">Selecione o sexo</option>
                            {genders.map(g => (
                                <option key={g.id} value={g.name}>{g.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Escolaridade</label>
                        <select 
                            value={data.requirements.education || ''}
                            onChange={(e) => updateRequirement('education', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white"
                        >
                            <option value="">Selecione o grau de escolaridade</option>
                            {educationLevels.map(lvl => (
                                <option key={lvl.id} value={lvl.name}>{lvl.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RadioGroup 
                        label="Disponibilidade para viajar?" 
                        name="travel" 
                        value={data.requirements.travel}
                        onChange={(val) => updateRequirement('travel', val)}
                    />
                    <RadioGroup 
                        label="Disponibilidade para dormir?" 
                        name="sleep" 
                        value={data.requirements.sleep}
                        onChange={(val) => updateRequirement('sleep', val)}
                    />
                    <RadioGroup 
                        label="Disponibilidade para se mudar?" 
                        name="move" 
                        value={data.requirements.move}
                        onChange={(val) => updateRequirement('move', val)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Idade mínima</label>
                        <input 
                            type="text" 
                            placeholder="Informe somente o nº" 
                            value={data.requirements.minAge || ''}
                            onChange={(e) => handleNumericChange('minAge', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Idade máxima</label>
                        <input 
                            type="text" 
                            placeholder="Informe somente o nº" 
                            value={data.requirements.maxAge || ''}
                            onChange={(e) => handleNumericChange('maxAge', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" 
                        />
                    </div>
                    <RadioGroup 
                        label="Requer experiência?" 
                        name="exp" 
                        value={data.requirements.requiresExp}
                        onChange={(val) => updateRequirement('requiresExp', val)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <RadioGroup 
                        label="Requer CNH?" 
                        name="cnh" 
                        value={data.requirements.requiresCnh}
                        onChange={(val) => updateRequirement('requiresCnh', val)}
                    />
                    <div className="col-span-1">
                        <label className="block text-xs text-gray-500 mb-1.5">Tipo de CNH?</label>
                        <div className="flex gap-3">
                            {['A', 'B', 'C', 'D', 'E'].map(type => (
                                <label key={type} className="flex items-center gap-1 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={data.requirements.cnhTypes?.includes(type)}
                                        onChange={(e) => {
                                            const current = data.requirements.cnhTypes || [];
                                            const updated = e.target.checked 
                                                ? [...current, type]
                                                : current.filter((t: string) => t !== type);
                                            updateRequirement('cnhTypes', updated);
                                        }}
                                        className="rounded text-[#F04E23] focus:ring-[#F04E23]" 
                                    />
                                    <span className="text-sm text-gray-600">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-xs text-gray-500 mb-1.5">Cursos preferênciais</label>
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                                {(data.requirements.courses || []).map((course: string, index: number) => (
                                    <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100">
                                        {course}
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const updated = data.requirements.courses.filter((_: any, i: number) => i !== index);
                                                updateRequirement('courses', updated);
                                            }}
                                            className="hover:text-blue-800"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input 
                                type="text" 
                                placeholder="Digite o curso e pressione Enter" 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ',') {
                                        e.preventDefault();
                                        const val = e.currentTarget.value.trim();
                                        if (val) {
                                            const current = data.requirements.courses || [];
                                            if (!current.includes(val)) {
                                                updateRequirement('courses', [...current, val]);
                                            }
                                            e.currentTarget.value = '';
                                        }
                                    }
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" 
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Número Limite de Candidatos</label>
                        <input 
                            type="text" 
                            placeholder="Informe a quantidade" 
                            value={data.requirements.limit || ''}
                            onChange={(e) => handleNumericChange('limit', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" 
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Quando atingir o número de inscrições acima a vaga é encerrada.</p>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Tempo médio emprego anterior</label>
                        <input 
                            type="text" 
                            placeholder="Informe a quantidade" 
                            value={data.requirements.avgTenure || ''}
                            onChange={(e) => handleNumericChange('avgTenure', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm" 
                        />
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 pt-4">Diferencial</h3>
                <div>
                    <label className="block text-xs text-gray-500 mb-3">Marque os benefícios que sua empresa oferece para esta vaga:</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['VR', 'VA', 'VT', 'Plano de saúde', 'Plano odontológico', 'Plano bem-estar', 'Auxílio escolar', 'Auxílio medicamento', 'Previdência privada', 'Participação de lucro', 'Comissão', 'Outro'].map(b => (
                            <label key={b} className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={data.requirements.benefits?.includes(b)}
                                    onChange={(e) => {
                                        const current = data.requirements.benefits || [];
                                        const updated = e.target.checked 
                                            ? [...current, b]
                                            : current.filter((item: string) => item !== b);
                                        updateRequirement('benefits', updated);
                                    }}
                                    className="rounded text-[#F04E23] focus:ring-[#F04E23]" 
                                />
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

const RadioGroup: React.FC<{ label: string, name: string, value: string, onChange: (val: string) => void }> = ({ label, name, value, onChange }) => (
    <div>
        <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
        <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="radio" 
                    name={name} 
                    checked={value === 'Sim'}
                    onChange={() => onChange('Sim')}
                    className="text-[#F04E23] focus:ring-[#F04E23]" 
                />
                <span className="text-sm text-gray-600">Sim</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
                <input 
                    type="radio" 
                    name={name} 
                    checked={value === 'Não'}
                    onChange={() => onChange('Não')}
                    className="text-[#F04E23] focus:ring-[#F04E23]" 
                />
                <span className="text-sm text-gray-600">Não</span>
            </label>
        </div>
    </div>
);

export default Step2Requirements;
