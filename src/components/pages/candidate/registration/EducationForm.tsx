import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

interface EducationFormProps {
    onNext: () => void;
    onBack?: () => void;
    readOnly?: boolean;
}

interface Education {
    id?: string;
    level: string;
    institution: string;
    course: string; // Not in image explicitly but good to have, mapped to "Tipo de formação" maybe? No, "Tipo" is level.
    start_date: string;
    end_date: string;
    status: string; // Concluído, Cursando, Não finalizado
}

const EducationForm: React.FC<EducationFormProps> = ({ onNext, readOnly = false }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [educations, setEducations] = useState<Education[]>([]);

    // Form state for new/editing entry
    const [isAdding, setIsAdding] = useState(false);
    const [currentEducation, setCurrentEducation] = useState<Education>({
        level: '',
        institution: '',
        course: '',
        start_date: '',
        end_date: '',
        status: 'Concluído'
    });

    useEffect(() => {
        fetchEducation();
    }, [user]);

    const fetchEducation = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('academic_education')
            .select('*')
            .eq('user_id', user.id);

        if (data) setEducations(data as any); // Type assertion needed until full refresh
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta formação?')) return;
        const { error } = await supabase.from('academic_education').delete().eq('id', id);
        if (!error) fetchEducation();
    };

    const handleSaveCurrent = async () => {
        if (!user) return;
        // Basic validation
        if (!currentEducation.level || !currentEducation.institution) {
            alert('Preencha os campos obrigatórios.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('academic_education').insert({
                user_id: user.id,
                level: currentEducation.level,
                institution: currentEducation.institution,
                course: currentEducation.course, // Optional?
                start_date: currentEducation.start_date || null,
                end_date: currentEducation.end_date || null,
                status: currentEducation.status
            });

            if (error) throw error;
            setIsAdding(false);
            setCurrentEducation({ level: '', institution: '', course: '', start_date: '', end_date: '', status: 'Concluído' });
            fetchEducation();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar formação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Formação Acadêmica</h2>
            <p className="text-gray-500 mb-8">Mostre aos recrutadores seu nível educacional adicionando sua escolaridade.</p>

            {/* List of Educations */}
            {!isAdding && (
                <div className="space-y-4 mb-8">
                    {educations.map(edu => (
                        <div key={edu.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                                <p className="text-sm text-gray-500">{edu.level} • {edu.status}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {edu.start_date ? new Date(edu.start_date).getFullYear() : '?'} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Atual'}
                                </p>
                            </div>
                            {!readOnly && (
                                <button onClick={() => edu.id && handleDelete(edu.id)} className="text-red-500 hover:text-red-700 p-2">
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
                            Adicionar formação
                        </button>
                    )}
                </div>
            )}

            {/* Add Form */}
            {isAdding && !readOnly && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 border-t border-gray-100 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Tipo de formação</label>
                            <select
                                value={currentEducation.level}
                                onChange={(e) => setCurrentEducation({ ...currentEducation, level: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none bg-white"
                            >
                                <option value="">Selecione</option>
                                <option value="Ensino Fundamental">Ensino Fundamental</option>
                                <option value="Ensino Médio">Ensino Médio</option>
                                <option value="Ensino Superior">Ensino Superior</option>
                                <option value="Pós-graduação">Pós-graduação</option>
                                <option value="Mestrado">Mestrado</option>
                                <option value="Doutorado">Doutorado</option>
                                <option value="Curso Técnico">Curso Técnico</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Instituição</label>
                            <input
                                type="text"
                                value={currentEducation.institution}
                                onChange={(e) => setCurrentEducation({ ...currentEducation, institution: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Data de início</label>
                            <input
                                type="date"
                                value={currentEducation.start_date}
                                onChange={(e) => setCurrentEducation({ ...currentEducation, start_date: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Data de conclusão</label>
                            <input
                                type="date"
                                value={currentEducation.end_date}
                                onChange={(e) => setCurrentEducation({ ...currentEducation, end_date: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200"
                            />
                        </div>
                    </div>

                    <div className="flex gap-6 mb-8">
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={currentEducation.status === 'Concluído'} onChange={() => setCurrentEducation({ ...currentEducation, status: 'Concluído' })} />
                            <span>Concluído</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={currentEducation.status === 'Cursando'} onChange={() => setCurrentEducation({ ...currentEducation, status: 'Cursando' })} />
                            <span>Cursando</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" checked={currentEducation.status === 'Não finalizado'} onChange={() => setCurrentEducation({ ...currentEducation, status: 'Não finalizado' })} />
                            <span>Não finalizado</span>
                        </label>
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
                        onClick={onNext} // In this design, onNext just moves even if no education added (optional?)
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

export default EducationForm;
