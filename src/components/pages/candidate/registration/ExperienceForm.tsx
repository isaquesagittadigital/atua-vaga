import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

interface ExperienceFormProps {
    onNext: () => void;
    readOnly?: boolean;
}

interface Experience {
    id?: string;
    company_name: string;
    role: string;
    description: string;
    salary: number | '';
    is_variable_salary: boolean;
    variable_salary_amount: number | '';
    start_date: string;
    end_date: string;
    is_current: boolean;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ onNext, readOnly = false }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [experiences, setExperiences] = useState<Experience[]>([]);

    const [isAdding, setIsAdding] = useState(false);
    const [currentExp, setCurrentExp] = useState<Experience>({
        company_name: '',
        role: '',
        description: '',
        salary: '',
        is_variable_salary: false,
        variable_salary_amount: '',
        start_date: '',
        end_date: '',
        is_current: false
    });

    useEffect(() => {
        fetchExperience();
    }, [user]);

    const fetchExperience = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('professional_experience')
            .select('*')
            .eq('user_id', user.id);

        if (data) setExperiences(data as any);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta experiência?')) return;
        const { error } = await supabase.from('professional_experience').delete().eq('id', id);
        if (!error) fetchExperience();
    };

    const handleSaveCurrent = async () => {
        if (!user) return;
        if (!currentExp.company_name || !currentExp.role) {
            alert('Preencha os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('professional_experience').insert({
                user_id: user.id,
                company_name: currentExp.company_name,
                role: currentExp.role,
                description: currentExp.description,
                salary: currentExp.salary === '' ? null : Number(currentExp.salary),
                is_variable_salary: currentExp.is_variable_salary,
                variable_salary_amount: currentExp.variable_salary_amount === '' ? null : Number(currentExp.variable_salary_amount),
                start_date: currentExp.start_date || null,
                end_date: currentExp.end_date || null,
                is_current: currentExp.is_current
            });

            if (error) throw error;
            setIsAdding(false);
            setCurrentExp({
                company_name: '', role: '', description: '', salary: '', is_variable_salary: false,
                variable_salary_amount: '', start_date: '', end_date: '', is_current: false
            });
            fetchExperience();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar experiência.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Experiências profissionais</h2>
            <p className="text-gray-500 mb-8">Mostre aos recrutadores seu nível profissional adicionando suas experiências.</p>

            {/* List */}
            {!isAdding && (
                <div className="space-y-4 mb-8">
                    {experiences.map(exp => (
                        <div key={exp.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900">{exp.role}</h3>
                                <p className="text-sm text-gray-500 font-medium">{exp.company_name}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {exp.start_date ? new Date(exp.start_date).getFullYear() : '?'} - {exp.is_current ? 'Atual' : (exp.end_date ? new Date(exp.end_date).getFullYear() : '?')}
                                </p>
                            </div>
                            {!readOnly && (
                                <button onClick={() => exp.id && handleDelete(exp.id)} className="text-red-500 hover:text-red-700 p-2">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}

                    {!readOnly && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="flex items-center gap-2 text-[#F04E23] font-bold hover:underline"
                        >
                            <Plus size={20} />
                            Adicionar experiência
                        </button>
                    )}
                </div>
            )}

            {/* Add Form */}
            {isAdding && !readOnly && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 border-t border-gray-100 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Nome da empresa</label>
                            <input
                                type="text"
                                value={currentExp.company_name}
                                onChange={(e) => setCurrentExp({ ...currentExp, company_name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Cargo</label>
                            <input
                                type="text"
                                value={currentExp.role}
                                onChange={(e) => setCurrentExp({ ...currentExp, role: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Atividades realizadas</label>
                            <textarea
                                value={currentExp.description}
                                onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 min-h-[100px]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Valor da remuneração</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">R$</span>
                                <input
                                    type="text"
                                    placeholder="0,00"
                                    value={currentExp.salary ? (Number(currentExp.salary)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        const numberValue = Number(value) / 100;
                                        setCurrentExp({ ...currentExp, salary: numberValue });
                                    }}
                                    className="w-full pl-12 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase">Remuneração variável</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="variable_salary"
                                        checked={currentExp.is_variable_salary}
                                        onChange={(e) => setCurrentExp({ ...currentExp, is_variable_salary: e.target.checked })}
                                        className="rounded border-gray-300 text-[#F04E23] focus:ring-[#F04E23]"
                                    />
                                    <label htmlFor="variable_salary" className="text-xs text-gray-500 cursor-pointer">Habilitar</label>
                                </div>
                            </div>
                            <div className="relative">
                                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium ${!currentExp.is_variable_salary ? 'text-gray-300' : 'text-gray-500'}`}>R$</span>
                                <input
                                    type="text"
                                    placeholder="0,00"
                                    disabled={!currentExp.is_variable_salary}
                                    value={currentExp.variable_salary_amount ? (Number(currentExp.variable_salary_amount)).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : ''}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        const numberValue = Number(value) / 100;
                                        setCurrentExp({ ...currentExp, variable_salary_amount: numberValue });
                                    }}
                                    className={`w-full pl-12 px-4 py-3 rounded-xl border focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all
                                        ${!currentExp.is_variable_salary ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-200'}
                                    `}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Data de início</label>
                            <input
                                type="date"
                                value={currentExp.start_date}
                                onChange={(e) => setCurrentExp({ ...currentExp, start_date: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Data de saída</label>
                            <input
                                type="date"
                                value={currentExp.end_date}
                                disabled={currentExp.is_current}
                                onChange={(e) => setCurrentExp({ ...currentExp, end_date: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 disabled:bg-gray-100"
                            />
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={currentExp.is_current}
                                    onChange={(e) => setCurrentExp({ ...currentExp, is_current: e.target.checked, end_date: '' })}
                                />
                                <label className="text-sm text-gray-600">Atualmente trabalho aqui</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500 font-bold">Cancelar</button>
                        <button onClick={handleSaveCurrent} className="px-6 py-2 bg-[#F04E23] text-white rounded-full font-bold">Adicionar</button>
                    </div>
                </div>
            )}

            {!isAdding && !readOnly && (
                <div className="flex justify-center mt-10 pt-6 border-t border-gray-100">
                    <button
                        onClick={onNext}
                        className="text-gray-500 font-bold hover:text-gray-700 px-8 py-3"
                    >
                        Pular
                    </button>
                    <button
                        onClick={onNext}
                        className="bg-[#F04E23] hover:bg-[#d63f15] text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-1"
                    >
                        Salvar e continuar
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExperienceForm;
