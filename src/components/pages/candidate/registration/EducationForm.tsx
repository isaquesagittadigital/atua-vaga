import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Trash2, Pencil } from 'lucide-react';
import { formatDate, parseDateToISO, formatDateToLocale } from '@/utils/validators';
import ConfirmModal from '@/components/modals/ConfirmModal';

interface EducationFormProps {
    onNext: () => void;
    onBack?: () => void;
    readOnly?: boolean;
    canEdit?: boolean;
    hideSkip?: boolean;
}

interface Education {
    id?: string;
    level: string;
    institution: string;
    course: string;
    start_date: string;
    end_date: string;
    status: string;
}

const EducationForm: React.FC<EducationFormProps> = ({ onNext, readOnly = false, canEdit = false, hideSkip = false }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [educations, setEducations] = useState<Education[]>([]);
    const [isEditing, setIsEditing] = useState(!canEdit);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentEducation, setCurrentEducation] = useState<Education>({
        level: '', institution: '', course: '', start_date: '', end_date: '', status: 'Concluído'
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [eduToDelete, setEduToDelete] = useState<string | null>(null);

    const fetchEducation = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('academic_education')
            .select('*')
            .eq('user_id', user.id)
            .order('start_date', { ascending: false });

        if (data) {
            setEducations((data as any[]).map(edu => ({
                ...edu,
                start_date: formatDateToLocale(edu.start_date || ''),
                end_date: formatDateToLocale(edu.end_date || '')
            })));
        }
    };

    useEffect(() => { fetchEducation(); }, [user]);

    const handleDelete = async (id: string) => {
        setEduToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!eduToDelete) return;
        const { error } = await supabase.from('academic_education').delete().eq('id', eduToDelete);
        if (!error) fetchEducation();
        setShowDeleteModal(false);
        setEduToDelete(null);
    };

    const handleEdit = (edu: Education) => {
        setEditingId(edu.id!);
        setCurrentEducation({
            level: edu.level,
            institution: edu.institution,
            course: edu.course || '',
            start_date: edu.start_date || '',
            end_date: edu.end_date || '',
            status: edu.status || 'Concluído'
        });
        setIsAdding(true);
    };

    const handleSaveCurrent = async () => {
        if (!user) return;
        if (!currentEducation.level || !currentEducation.institution) {
            alert('Preencha os campos obrigatórios.');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                user_id: user.id,
                level: currentEducation.level,
                institution: currentEducation.institution,
                course: currentEducation.course,
                start_date: parseDateToISO(currentEducation.start_date),
                end_date: parseDateToISO(currentEducation.end_date),
                status: currentEducation.status
            };

            const { error } = editingId 
                ? await supabase.from('academic_education').update(payload).eq('id', editingId)
                : await supabase.from('academic_education').insert(payload);

            if (error) throw error;
            setIsAdding(false);
            setEditingId(null);
            setCurrentEducation({ level: '', institution: '', course: '', start_date: '', end_date: '', status: 'Concluído' });
            fetchEducation();
        } catch (err) {
            console.error(err);
            alert('Erro ao salvar formação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Formação acadêmica</h2>
                    <p className="text-gray-400 font-bold mt-1 text-sm">
                        Mostre aos recrutadores seu nível educacional adicionando sua escolaridade.
                    </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                    {/* Edit toggle (canEdit mode) */}
                    {canEdit && !isEditing && !readOnly && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="text-[#F04E23] flex gap-2 items-center font-black hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                            <Pencil size={16} /> Editar
                        </button>
                    )}
                    {/* Add button — always visible */}
                    {!readOnly && (
                        <button
                            onClick={() => {
                                if (canEdit) setIsEditing(true);
                                setIsAdding(true);
                                setEditingId(null);
                                setCurrentEducation({ level: '', institution: '', course: '', start_date: '', end_date: '', status: 'Concluído' });
                            }}
                            className="flex items-center gap-2 text-[#1D4ED8] font-bold text-sm hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <PlusCircle size={18} /> Adicionar formação
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4 mt-8">
                {/* ── List of all education entries ────────────────────── */}
                {educations.length > 0 && (
                    <div className="space-y-3">
                        {educations.map(edu => (
                            <div
                                key={edu.id}
                                className="relative group grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 animate-in fade-in duration-300"
                            >
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Tipo de formação</label>
                                    <div className="px-4 py-3 rounded-xl border border-gray-50 bg-gray-50/50 text-gray-900 font-bold text-[13px]">{edu.level}</div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Curso</label>
                                    <div className="px-4 py-3 rounded-xl border border-gray-50 bg-gray-50/50 text-gray-900 font-bold text-[13px]">{edu.course || '—'}</div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Instituição</label>
                                    <div className="px-4 py-3 rounded-xl border border-gray-50 bg-gray-50/50 text-gray-900 font-bold text-[13px]">{edu.institution}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 mb-1.5 uppercase tracking-wider">Início</label>
                                        <div className="px-4 py-3 rounded-xl border border-gray-50 bg-gray-50/50 text-gray-900 font-bold text-[13px]">{edu.start_date || '—'}</div>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-gray-400 mb-1.5">Conclusão</label>
                                        <div className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-medium text-sm">
                                            {edu.status === 'Cursando' ? 'Cursando' : edu.end_date || 'Concluído'}
                                        </div>
                                    </div>
                                </div>

                                {/* Per-item actions */}
                                {!readOnly && isEditing && edu.id && (
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(edu)}
                                            className="flex items-center gap-1.5 text-blue-500 font-bold text-xs hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-all"
                                        >
                                            <Pencil size={13} /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(edu.id!)}
                                            className="flex items-center gap-1.5 text-red-500 font-bold text-xs hover:bg-red-50 px-2.5 py-1 rounded-lg transition-all"
                                        >
                                            <Trash2 size={13} /> Excluir
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Empty state ───────────────────────────────────────── */}
                {educations.length === 0 && !isAdding && (
                    <div className="text-center py-10 text-gray-400 font-bold text-sm border-2 border-dashed border-gray-100 rounded-2xl">
                        Nenhuma formação cadastrada ainda.
                    </div>
                )}

                {/* ── Add Form ──────────────────────────────────────────── */}
                {isAdding && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-[32px] border-2 border-dashed border-blue-100 bg-blue-50/20 animate-in slide-in-from-top-4 duration-300">
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-wider">Tipo de formação</label>
                            <select
                                value={currentEducation.level}
                                onChange={(e) => setCurrentEducation({ ...currentEducation, level: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-4 focus:ring-orange-50 outline-none bg-white text-gray-900 font-bold text-[14px] transition-all"
                            >
                                <option value="">Selecionar</option>
                                <option value="Ensino Médio">Ensino Médio</option>
                                <option value="Ensino Superior">Ensino Superior</option>
                                <option value="Pós-graduação">Pós-graduação</option>
                                <option value="Curso Técnico">Curso Técnico</option>
                                <option value="Mestrado / Doutorado">Mestrado / Doutorado</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-wider">Curso</label>
                            <input
                                type="text"
                                value={currentEducation.course}
                                onChange={(e) => setCurrentEducation({ ...currentEducation, course: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-4 focus:ring-orange-50 outline-none bg-white text-gray-900 font-bold text-[14px] transition-all"
                                placeholder="Ex: Engenharia de Software"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2 uppercase tracking-wider">Instituição</label>
                            <input
                                type="text"
                                value={currentEducation.institution}
                                onChange={(e) => setCurrentEducation({ ...currentEducation, institution: e.target.value })}
                                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-4 focus:ring-orange-50 outline-none bg-white text-gray-900 font-bold text-[14px] transition-all"
                                placeholder="Nome da instituição"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 mb-2">Data de início</label>
                                <input
                                    type="text"
                                    value={currentEducation.start_date}
                                    onChange={(e) => setCurrentEducation({ ...currentEducation, start_date: formatDate(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                    placeholder="DD/MM/AAAA"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 mb-2">Data de conclusão</label>
                                <input
                                    type="text"
                                    value={currentEducation.end_date}
                                    onChange={(e) => setCurrentEducation({ ...currentEducation, end_date: formatDate(e.target.value) })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                    placeholder="DD/MM/AAAA"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-3 flex items-center gap-8 py-1">
                            {['Concluído', 'Cursando', 'Não finalizado'].map(status => (
                                <label key={status} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="edu-status"
                                        checked={currentEducation.status === status}
                                        onChange={() => setCurrentEducation({ ...currentEducation, status })}
                                        className="w-4 h-4 text-[#F04E23] border-gray-300 focus:ring-[#F04E23]"
                                    />
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">{status}</span>
                                </label>
                            ))}
                        </div>

                        <div className="md:col-span-3 flex justify-end gap-4 pt-2 border-t border-blue-100">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-2 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveCurrent}
                                disabled={loading}
                                className="px-8 py-3 bg-[#F04E23] text-white rounded-xl font-black text-sm hover:bg-[#d63e19] transition-colors disabled:opacity-50 shadow-lg shadow-orange-100"
                            >
                                {loading ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Gravar formação'}
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

            {showDeleteModal && (
                <ConfirmModal
                    title="Excluir formação"
                    message="Tem certeza que deseja excluir esta formação acadêmica? Esta ação não pode ser desfeita."
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default EducationForm;
