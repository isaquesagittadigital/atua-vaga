import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
// ... imports
import { Plus, X, Pencil } from 'lucide-react';

interface SkillsFormProps {
    onNext: () => void;
    readOnly?: boolean;
    canEdit?: boolean;
    hideSkip?: boolean;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ onNext, readOnly = false, canEdit = false, hideSkip = false }) => {
    const { user, profile, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!canEdit);

    // Skills State
    const [skills, setSkills] = useState<{ id: string, name: string }[]>([]);
    const [newSkill, setNewSkill] = useState('');

    // Profile Fields State
    const [formData, setFormData] = useState({
        bio: '',
        linkedin: '',
        instagram: '', // Assuming social_links jsonb structure
        trainings: '', // Mapped to... maybe bio or a new field? Let's use bio or separate if needed. Image says "Treinamentos".
        salary_objective: '',
        job_objective: '',
        diversity_info: '',
        availability_travel: false,
        availability_move: false,
        availability_sleep: false // "Disponibilidade para dormir?"
    });

    useEffect(() => {
        if (user) {
            fetchSkills();
            // Pre-fill profile data
            if (profile) {
                const socials = profile.social_links as any || {};
                setFormData({
                    bio: profile.bio || '',
                    linkedin: socials.linkedin || '',
                    instagram: socials.instagram || '',
                    trainings: profile.trainings || '',
                    salary_objective: profile.salary_objective?.toString() || '',
                    job_objective: profile.job_objective || '',
                    diversity_info: profile.diversity_info || '',
                    availability_travel: profile.availability_travel || false,
                    availability_move: profile.availability_move || false,
                    availability_sleep: profile.availability_sleep || false
                });
            }
        }
    }, [user, profile]);

    const fetchSkills = async () => {
        if (!user) return;
        const { data } = await supabase.from('candidate_skills').select('*').eq('user_id', user.id);
        if (data) setSkills(data);
    };

    const handleAddSkill = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!user || !newSkill.trim()) return;
        const { error } = await supabase.from('candidate_skills').insert({
            user_id: user.id,
            name: newSkill.trim()
        });
        if (!error) {
            setNewSkill('');
            fetchSkills();
        }
    };

    const handleDeleteSkill = async (id: string) => {
        await supabase.from('candidate_skills').delete().eq('id', id);
        fetchSkills();
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').update({
                bio: formData.bio,
                social_links: { linkedin: formData.linkedin, instagram: formData.instagram },
                salary_objective: formData.salary_objective ? Number(formData.salary_objective) : null,
                job_objective: formData.job_objective,
                diversity_info: formData.diversity_info,
                availability_travel: formData.availability_travel,
                availability_move: formData.availability_move,
                availability_sleep: formData.availability_sleep,
                trainings: formData.trainings
            }).eq('id', user.id);

            if (error) throw error;

            await refreshUser(); // Update context with new data

            if (canEdit) {
                setIsEditing(false);
            } else {
                onNext();
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar habilidades.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Habilidades</h2>
                {canEdit && !isEditing && !readOnly && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-[#F04E23] flex gap-2 items-center font-bold hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors"
                    >
                        <Pencil size={18} /> Editar
                    </button>
                )}
            </div>
            <p className="text-gray-500 mb-8">Mostre aos recrutadores seu nível profissional adicionando suas habilidades.</p>

            <div className="space-y-6">
                {/* Skills Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Habilidades</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="Informe suas habilidades e pressione Enter"
                            disabled={readOnly || (canEdit && !isEditing)}
                        />
                        {!readOnly && (!canEdit || isEditing) && (
                            <button onClick={handleAddSkill} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F04E23]">
                                <Plus size={20} />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {skills.map(skill => (
                            <span key={skill.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 flex items-center gap-2">
                                {skill.name}
                                {!readOnly && (!canEdit || isEditing) && <button onClick={() => handleDeleteSkill(skill.id)}><X size={14} /></button>}
                            </span>
                        ))}
                    </div>
                </div>


                <fieldset disabled={readOnly || (canEdit && !isEditing)} className="contents space-y-6">
                    {/* Bio */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Quem sou eu</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 h-32"
                            placeholder="Descreva suas responsabilidades"
                        />
                    </div>

                    {/* Socials */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Rede sociais</label>
                        <input
                            type="text"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-2"
                            placeholder="Cole o link de suas redes sociais"
                        />
                        {/* If we want to show multiple links or specific ones, we can iterate, but design shows single input roughly */}
                    </div>

                    {/* Trainings */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Treinamentos</label>
                        <input
                            type="text"
                            value={formData.trainings}
                            onChange={(e) => setFormData({ ...formData, trainings: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200"
                            placeholder="Informe seus treinamentos"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Objetivo Profissional */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Objetivo profissional</label>
                            <input
                                type="text"
                                value={formData.job_objective}
                                onChange={(e) => setFormData({ ...formData, job_objective: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                placeholder="Ex.: salário, cargo, hierarquia ou área"
                            />
                        </div>

                        {/* Diversidade */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Diversidade</label>
                            <select
                                value={formData.diversity_info}
                                onChange={(e) => setFormData({ ...formData, diversity_info: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none bg-white"
                            >
                                <option value="">Informe sua identidade, raça ou orientação</option>
                                <option value="Branca">Branca</option>
                                <option value="Preta">Preta</option>
                                <option value="Parda">Parda</option>
                                <option value="Amarela">Amarela</option>
                                <option value="Indígena">Indígena</option>
                                <option value="Prefiro não declarar">Prefiro não declarar</option>
                            </select>
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Disponibilidade para viajar?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.availability_travel} onChange={(e) => setFormData({ ...formData, availability_travel: e.target.checked })} className="text-[#F04E23] focus:ring-[#F04E23] rounded" />
                                    Sim
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={!formData.availability_travel} onChange={(e) => setFormData({ ...formData, availability_travel: !e.target.checked })} className="text-[#F04E23] focus:ring-[#F04E23] rounded" />
                                    Não
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Disponibilidade para dormir?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.availability_sleep} onChange={(e) => setFormData({ ...formData, availability_sleep: e.target.checked })} className="text-[#F04E23] focus:ring-[#F04E23] rounded" />
                                    Sim
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={!formData.availability_sleep} onChange={(e) => setFormData({ ...formData, availability_sleep: !e.target.checked })} className="text-[#F04E23] focus:ring-[#F04E23] rounded" />
                                    Não
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Disponibilidade para se mudar?</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={formData.availability_move} onChange={(e) => setFormData({ ...formData, availability_move: e.target.checked })} className="text-[#F04E23] focus:ring-[#F04E23] rounded" />
                                    Sim
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={!formData.availability_move} onChange={(e) => setFormData({ ...formData, availability_move: !e.target.checked })} className="text-[#F04E23] focus:ring-[#F04E23] rounded" />
                                    Não
                                </label>
                            </div>
                        </div>
                    </div>

                </fieldset>

                {!readOnly && (
                    <div className="flex justify-center mt-10 pt-6 border-t border-gray-100">
                        {!hideSkip && (
                            <button
                                onClick={onNext}
                                className="text-gray-500 font-bold hover:text-gray-700 px-8 py-3"
                            >
                                Pular
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={loading || (canEdit && !isEditing)}
                            className={`
                                font-bold py-3 px-10 rounded-full shadow-lg transition-all transform 
                                ${(loading || (canEdit && !isEditing))
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-[#F04E23] hover:bg-[#d63f15] text-white shadow-orange-200 hover:-translate-y-1'
                                }
                            `}
                        >
                            {loading ? 'Salvando...' : (canEdit ? 'Concluir edição' : 'Salvar e concluir')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SkillsForm;
