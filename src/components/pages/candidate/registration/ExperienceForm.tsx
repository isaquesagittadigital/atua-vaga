import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import { formatDate, parseDateToISO, formatDateToLocale, formatCurrency, parseCurrencyToNumber } from '@/utils/validators';

interface ExperienceFormProps {
    onNext: () => void;
    readOnly?: boolean;
    canEdit?: boolean;
    hideSkip?: boolean;
}

interface Experience {
    id?: string;
    company_name: string;
    role: string;
    description: string;
    salary: string;
    is_variable_salary: boolean;
    variable_salary_amount: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
}

const EMPTY_EXP: Experience = {
    company_name: '', role: '', description: '', salary: '',
    is_variable_salary: false, variable_salary_amount: '',
    start_date: '', end_date: '', is_current: false
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({ onNext, readOnly = false, canEdit = false, hideSkip = false }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isEditing, setIsEditing] = useState(!canEdit);
    const [isAdding, setIsAdding] = useState(false);
    const [currentExp, setCurrentExp] = useState<Experience>(EMPTY_EXP);

    const fetchExperience = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('professional_experience')
                .select('*')
                .eq('user_id', user.id)
                .order('start_date', { ascending: false });

            if (error) throw error;

            if (data) {
                setExperiences((data as any[]).map(exp => ({
                    ...exp,
                    salary: formatCurrency(exp.salary),
                    variable_salary_amount: formatCurrency(exp.variable_salary_amount),
                    start_date: formatDateToLocale(exp.start_date || ''),
                    end_date: formatDateToLocale(exp.end_date || '')
                })));
            }
        } catch (err) {
            console.error('Erro ao buscar experiências:', err);
            // Opcional: mostrar um aviso amigável na UI se falhar o fetch
        }
    };

    useEffect(() => { fetchExperience(); }, [user]);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta experiência?')) return;
        const { error } = await supabase.from('professional_experience').delete().eq('id', id);
        if (!error) fetchExperience();
    };

    const handleEdit = (exp: Experience) => {
        setCurrentExp({
            ...exp,
            // Certificamos que as datas estão formatadas para o input
            start_date: exp.start_date,
            end_date: exp.is_current ? '' : exp.end_date
        });
        setIsAdding(true);
        if (canEdit) setIsEditing(true);
    };

    const handleSaveCurrent = async () => {
        if (!user) return;
        if (!currentExp.company_name || !currentExp.role) {
            alert('Preencha os campos obrigatórios.');
            return;
        }
        setLoading(true);
        try {
            const dataToSave = {
                user_id: user.id,
                company_name: currentExp.company_name,
                role: currentExp.role,
                description: currentExp.description,
                salary: parseCurrencyToNumber(currentExp.salary),
                is_variable_salary: currentExp.is_variable_salary,
                variable_salary_amount: parseCurrencyToNumber(currentExp.variable_salary_amount),
                start_date: parseDateToISO(currentExp.start_date),
                end_date: currentExp.is_current ? null : parseDateToISO(currentExp.end_date),
                is_current: currentExp.is_current
            };

            let error;
            if (currentExp.id) {
                // UPDATE
                const { error: updateError } = await supabase
                    .from('professional_experience')
                    .update(dataToSave)
                    .eq('id', currentExp.id);
                error = updateError;
            } else {
                // INSERT
                const { error: insertError } = await supabase
                    .from('professional_experience')
                    .insert(dataToSave);
                error = insertError;
            }

            if (error) throw error;
            setIsAdding(false);
            setCurrentExp(EMPTY_EXP);
            fetchExperience();
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar experiência.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="bg-white">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Experiências profissionais</h2>
                    <p className="text-gray-400 font-bold mt-1 text-sm">
                        Mostre aos recrutadores seu nível profissional adicionando suas experiências.
                    </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    {canEdit && !isEditing && !readOnly && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="text-[#F04E23] flex gap-2 items-center font-black hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                            <Pencil size={16} /> Editar
                        </button>
                    )}
                    {!readOnly && (
                        <button
                            onClick={() => {
                                if (canEdit) setIsEditing(true);
                                setIsAdding(true);
                                setCurrentExp(EMPTY_EXP);
                            }}
                            className="flex items-center gap-2 text-[#1D4ED8] font-bold text-sm hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <PlusCircle size={18} /> Adicionar experiência
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4 mt-8">
                {/* ── List of all experience entries ───────────────────── */}
                {experiences.length > 0 && (
                    <div className="space-y-3">
                        {experiences.map(exp => (
                            <div
                                key={exp.id}
                                className="relative group grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl border border-gray-300 bg-gray-50/40 hover:border-gray-200 transition-all animate-in fade-in duration-300"
                            >
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 mb-1.5">Nome da empresa</label>
                                    <div className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium text-sm">{exp.company_name}</div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 mb-1.5">Cargo</label>
                                    <div className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium text-sm">{exp.role}</div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 mb-1.5">Atividades realizadas</label>
                                    <div className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium text-sm truncate">{exp.description || '—'}</div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 mb-1.5">Remuneração</label>
                                    <div className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium text-sm">{exp.salary}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 mb-1.5">Início</label>
                                        <div className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium text-sm">{exp.start_date || '—'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 mb-1.5">Saída</label>
                                        <div className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium text-sm">
                                            {exp.is_current ? 'Atualmente' : exp.end_date || '—'}
                                        </div>
                                    </div>
                                </div>
                                {exp.is_variable_salary && (
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 mb-1.5">Remuneração variável</label>
                                        <div className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium text-sm">{exp.variable_salary_amount}</div>
                                    </div>
                                )}

                                {/* Actions */}
                                {!readOnly && isEditing && exp.id && (
                                    <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => handleEdit(exp)}
                                            className="flex items-center gap-1.5 text-blue-500 font-bold text-xs hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all"
                                        >
                                            <Pencil size={14} /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id!)}
                                            className="flex items-center gap-1.5 text-red-400 font-bold text-xs hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all"
                                        >
                                            <Trash2 size={14} /> Excluir
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Empty state ───────────────────────────────────────── */}
                {experiences.length === 0 && !isAdding && (
                    <div className="text-center py-10 text-gray-400 font-bold text-sm border-2 border-dashed border-gray-100 rounded-2xl">
                        Nenhuma experiência cadastrada ainda.
                    </div>
                )}

                {/* ── Add Form ──────────────────────────────────────────── */}
                {isAdding && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl border-2 border-dashed border-blue-100 bg-blue-50/20 animate-in slide-in-from-top-4 duration-300">
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Nome da empresa</label>
                            <input type="text" value={currentExp.company_name}
                                onChange={(e) => setCurrentExp({ ...currentExp, company_name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="Ex: Google Inc." />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Cargo</label>
                            <input type="text" value={currentExp.role}
                                onChange={(e) => setCurrentExp({ ...currentExp, role: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="Ex: Desenvolvedor sênior" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Atividades realizadas</label>
                            <input type="text" value={currentExp.description}
                                onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="Descreva brevemente suas atividades" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Valor da remuneração</label>
                                <input type="text" value={currentExp.salary}
                                    onChange={(e) => setCurrentExp({ ...currentExp, salary: formatCurrency(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                    placeholder="R$ 0,00" />
                            </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 mb-2">Data de início</label>
                                <input type="text" value={currentExp.start_date}
                                    onChange={(e) => setCurrentExp({ ...currentExp, start_date: formatDate(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                    placeholder="DD/MM/AAAA" />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 mb-2">Data de saída</label>
                                <input type="text" value={currentExp.end_date}
                                    disabled={currentExp.is_current}
                                    onChange={(e) => setCurrentExp({ ...currentExp, end_date: formatDate(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium disabled:bg-gray-50 disabled:text-gray-300"
                                    placeholder="DD/MM/AAAA" />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={currentExp.is_variable_salary}
                                    onChange={(e) => setCurrentExp({ ...currentExp, is_variable_salary: e.target.checked })}
                                    className="w-4 h-4 text-[#F04E23] border-gray-300 rounded focus:ring-[#F04E23]" />
                                <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900">Remuneração variável</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={currentExp.is_current}
                                    onChange={(e) => setCurrentExp({ ...currentExp, is_current: e.target.checked, end_date: '' })}
                                    className="w-4 h-4 text-[#F04E23] border-gray-300 rounded focus:ring-[#F04E23]" />
                                <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900">Atualmente trabalho aqui</span>
                            </label>
                        </div>

                        {currentExp.is_variable_salary && (
                            <div className="md:col-span-1 animate-in fade-in duration-300">
                                <label className="block text-[11px] font-black text-gray-400 mb-2">Valor variável</label>
                                <div className="relative">
                                    <input type="text" value={currentExp.variable_salary_amount}
                                        onChange={(e) => setCurrentExp({ ...currentExp, variable_salary_amount: formatCurrency(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                        placeholder="R$ 0,00" />
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-3 flex justify-end gap-4 pt-2 border-t border-blue-100">
                            <button onClick={() => setIsAdding(false)}
                                className="px-6 py-2 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors">
                                Cancelar
                            </button>
                            <button onClick={handleSaveCurrent} disabled={loading}
                                className="px-8 py-3 bg-[#F04E23] text-white rounded-xl font-black text-sm hover:bg-[#d63e19] transition-colors disabled:opacity-50 shadow-lg shadow-orange-100">
                                {loading ? 'Salvando...' : currentExp.id ? 'Salvar alterações' : 'Gravar experiência'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Finish editing button ────────────────────────────────── */}
            {!isAdding && !readOnly && isEditing && canEdit && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="font-black py-4 px-12 rounded-2xl bg-[#F04E23] text-white shadow-xl shadow-orange-100 hover:-translate-y-1 transition-all"
                    >
                        Concluir edição
                    </button>
                </div>
            )}

            {/* ── Wizard next button ───────────────────────────────────── */}
            {!readOnly && !canEdit && !isAdding && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={onNext}
                        className="font-black py-4 px-12 rounded-2xl bg-[#F04E23] text-white shadow-xl shadow-orange-100 hover:-translate-y-1 transition-all"
                    >
                        Continuar
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExperienceForm;
