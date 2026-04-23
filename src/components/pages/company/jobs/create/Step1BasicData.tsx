import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface StepProps {
    data: any;
    onUpdate: (data: any) => void;
    onNext: () => void;
    onCancel: () => void;
}

const Step1BasicData: React.FC<StepProps> = ({ data, onUpdate, onNext, onCancel }) => {
    const [areas, setAreas] = useState<any[]>([]);
    const [specializations, setSpecializations] = useState<any[]>([]);
    const [levels, setLevels] = useState<any[]>([]);
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [areasRes, levelsRes, schedulesRes] = await Promise.all([
                    supabase.from('professional_areas').select('*').order('name'),
                    supabase.from('seniority_levels').select('*').order('name'),
                    supabase.from('work_schedules').select('*').order('name')
                ]);

                if (areasRes.data) setAreas(areasRes.data);
                if (levelsRes.data) setLevels(levelsRes.data);
                if (schedulesRes.data) setSchedules(schedulesRes.data);

                // If an area is already selected (e.g., in edit mode), fetch specializations
                if (data.area) {
                    const areaObj = areasRes.data?.find(a => a.name === data.area);
                    if (areaObj) fetchSpecializations(areaObj.id);
                }

            } catch (error) {
                console.error('Error fetching form data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const fetchSpecializations = async (areaId: string) => {
        try {
            const { data: specData } = await supabase
                .from('specializations')
                .select('*')
                .eq('area_id', areaId)
                .order('name');
            setSpecializations(specData || []);
        } catch (error) {
            console.error('Error fetching specializations:', error);
        }
    };

    const handleAreaChange = (areaName: string) => {
        onUpdate({ area: areaName, specialization: '' });
        const selectedArea = areas.find(a => a.name === areaName);
        if (selectedArea) {
            fetchSpecializations(selectedArea.id);
        } else {
            setSpecializations([]);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Warning Alert */}
            <div className="bg-[#FEF5EA] border border-[#FAD7A0] rounded-lg p-4 mb-8 flex items-start gap-3">
                <div className="mt-0.5 text-[#E67E22]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <div className="text-sm text-[#9C640C]">
                    <span className="font-bold block mb-1">Lei que proibe a discriminação:</span>
                    Artigo 1º da Lei 9.029/95. | Artigo 7º, inciso XXX da Constituição Federal.
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800">Título da vaga</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Nome da empresa</label>
                        <input
                            type="text"
                            placeholder="Informe o nome da empresa"
                            value={data.companyName}
                            onChange={(e) => onUpdate({ companyName: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Nome da vaga</label>
                        <input
                            type="text"
                            placeholder="Informe o nome da vaga"
                            value={data.title}
                            onChange={(e) => onUpdate({ title: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Cargo</label>
                        <input
                            type="text"
                            placeholder="Informe o cargo da vaga"
                            value={data.role}
                            onChange={(e) => onUpdate({ role: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Complemento (Local)</label>
                        <input
                            type="text"
                            placeholder="Informe o local/complemento"
                            value={data.location}
                            onChange={(e) => onUpdate({ location: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Modelo de Vaga</label>
                            <select
                                value={data.workModel}
                                onChange={(e) => onUpdate({ workModel: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white"
                            >
                                <option value="">Selecione</option>
                                <option value="Remoto">Remoto</option>
                                <option value="Híbrido">Híbrido</option>
                                <option value="Presencial">Presencial</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1.5">Área Profissional</label>
                            <select 
                                value={data.area}
                                onChange={(e) => handleAreaChange(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white"
                            >
                                <option value="">Selecione a área</option>
                                {areas.map(area => (
                                    <option key={area.id} value={area.name}>{area.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Especialização</label>
                        <select 
                            value={data.specialization}
                            onChange={(e) => onUpdate({ specialization: e.target.value })}
                            disabled={!data.area}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        >
                            <option value="">Selecione a especialização</option>
                            {specializations.map(spec => (
                                <option key={spec.id} value={spec.name}>{spec.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Nível Hierárquico</label>
                        <select 
                            value={data.level}
                            onChange={(e) => onUpdate({ level: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white"
                        >
                            <option value="">Selecione o nível</option>
                            {levels.map(level => (
                                <option key={level.id} value={level.name}>{level.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 pt-4">Dados da vaga</h3>
                <div>
                    <label className="block text-xs text-gray-500 mb-1.5">Descrição da vaga</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        placeholder="Informe a descrição da vaga"
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm resize-none"
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Tipo de contrato</label>
                        <select
                            value={data.contractType}
                            onChange={(e) => onUpdate({ contractType: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white"
                        >
                            <option value="">Selecione o tipo</option>
                            <option value="CLT">CLT</option>
                            <option value="PJ">PJ</option>
                            <option value="Temporário">Temporário</option>
                            <option value="Estágio">Estágio</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Jornada de trabalho</label>
                        <select 
                            value={data.journey}
                            onChange={(e) => onUpdate({ journey: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm bg-white"
                        >
                            <option value="">Selecione a jornada</option>
                            {schedules.map(schedule => (
                                <option key={schedule.id} value={schedule.name}>{schedule.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Salário</label>
                        <input
                            type="text"
                            value={data.salary}
                            onChange={(e) => onUpdate({ salary: e.target.value })}
                            placeholder="Informe o salário desta vaga"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-12 flex justify-end gap-4 border-t border-gray-50 pt-6">
                <button onClick={onCancel} className="px-8 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                    Cancelar
                </button>
                <button onClick={onNext} className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20">
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default Step1BasicData;
