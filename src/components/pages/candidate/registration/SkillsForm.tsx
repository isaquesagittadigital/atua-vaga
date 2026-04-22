import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, X, Pencil, Globe, Linkedin, Instagram, Check } from 'lucide-react';

interface SkillsFormProps {
    onNext: () => void;
    readOnly?: boolean;
    canEdit?: boolean;
    hideSkip?: boolean;
}

const SOCIAL_PLATFORMS = [
    { name: 'LinkedIn', icon: Linkedin, domain: 'linkedin.com/in/', color: '#0077B5' },
    { name: 'Instagram', icon: Instagram, domain: 'instagram.com/', color: '#E4405F' },
    { name: 'Facebook', icon: Globe, domain: 'facebook.com/', color: '#1877F2' },
    { name: 'GitHub', icon: Globe, domain: 'github.com/', color: '#181717' },
    { name: 'X', icon: Globe, domain: 'x.com/', color: '#000000' },
    { name: 'WhatsApp', icon: Globe, domain: 'wa.me/', color: '#25D366' },
    { name: 'Telegram', icon: Globe, domain: 't.me/', color: '#0088CC' },
    { name: 'TikTok', icon: Globe, domain: 'tiktok.com/@', color: '#000000' },
    { name: 'Discord', icon: Globe, domain: 'discord.gg/', color: '#5865F2' },
];

const SkillsForm: React.FC<SkillsFormProps> = ({ onNext, readOnly = false, canEdit = false, hideSkip = false }) => {
    const { user, profile, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!canEdit);

    const [skills, setSkills] = useState<{ id: string, name: string }[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [socialInput, setSocialInput] = useState('');
    const [trainingInput, setTrainingInput] = useState('');
    const [showSocialSuggestions, setShowSocialSuggestions] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        linkedin: '',
        instagram: '',
        facebook: '',
        github: '',
        x: '',
        whatsapp: '',
        telegram: '',
        tiktok: '',
        discord: '',
        others: [] as { name: string, url: string }[],
        trainings: '',
        salary_objective: '',
        job_objective: '',
        diversity_info: '',
        availability_travel: false,
        availability_move: false,
        availability_sleep: false
    });
    const [languages, setLanguages] = useState<{ name: string, level: string }[]>([]);
    const [newLang, setNewLang] = useState({ name: '', level: 'Básico' });

    useEffect(() => {
        if (user) {
            fetchSkills();
            if (profile) {
                const socials = profile.social_links as any || {};
                setFormData({
                    bio: profile.bio || '',
                    linkedin: socials.linkedin || '',
                    instagram: socials.instagram || '',
                    facebook: socials.facebook || '',
                    github: socials.github || '',
                    x: socials.x || socials.twitter || '',
                    whatsapp: socials.whatsapp || '',
                    telegram: socials.telegram || '',
                    tiktok: socials.tiktok || '',
                    discord: socials.discord || '',
                    others: socials.others || [],
                    trainings: profile.trainings || '',
                    salary_objective: profile.salary_objective?.toString() || '',
                    job_objective: profile.job_objective || '',
                    diversity_info: profile.diversity_info || '',
                    availability_travel: profile.availability_travel || false,
                    availability_move: profile.availability_move || false,
                    availability_sleep: profile.availability_sleep || false
                });
                setLanguages(socials.languages || []);
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
                social_links: { 
                    linkedin: formData.linkedin, 
                    instagram: formData.instagram,
                    facebook: formData.facebook || '',
                    github: formData.github || '',
                    x: formData.x || '',
                    whatsapp: formData.whatsapp || '',
                    telegram: formData.telegram || '',
                    tiktok: formData.tiktok || '',
                    discord: formData.discord || '',
                    others: formData.others || [],
                    languages: languages // Storing here as the column doesn't exist
                },
                salary_objective: formData.salary_objective ? Number(formData.salary_objective) : null,
                job_objective: formData.job_objective,
                diversity_info: formData.diversity_info,
                availability_travel: formData.availability_travel,
                availability_move: formData.availability_move,
                availability_sleep: formData.availability_sleep,
                trainings: typeof formData.trainings === 'string' ? formData.trainings : (Array.isArray(formData.trainings) ? formData.trainings.join(', ') : '')
            }).eq('id', user.id);

            if (error) throw error;
            await refreshUser();

            if (canEdit) {
                setIsEditing(false);
            } else {
                onNext();
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Habilidades e Perfil</h2>
                    <p className="text-gray-400 font-bold mt-1 text-sm">
                        Destaque suas competências, redes sociais e informações sobre seu perfil.
                    </p>
                </div>
                {canEdit && !isEditing && !readOnly && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-[#F04E23] flex gap-2 items-center font-black hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors text-sm"
                    >
                        <Pencil size={18} /> Editar
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="mb-6">
                    <div className="relative max-w-sm">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                            className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-xl text-sm outline-none focus:border-[#F04E23] placeholder:text-gray-400 text-gray-600 font-medium"
                            placeholder="Informe suas habilidades"
                        />
                        <button 
                            onClick={handleAddSkill} 
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center border border-gray-200 rounded-full text-gray-400 hover:text-[#F04E23] hover:border-[#F04E23] transition-all"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                </div>
            ) : null}

            {/* Idiomas Section */}
            <div className="mb-12">
                <label className="block text-[11px] font-black text-gray-400 mb-4 uppercase tracking-wider">Idiomas</label>
                
                {isEditing && (
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                        <input
                            type="text"
                            value={newLang.name}
                            onChange={(e) => setNewLang({ ...newLang, name: e.target.value })}
                            className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm outline-none focus:border-[#F04E23] placeholder:text-gray-400 text-gray-600 font-medium"
                            placeholder="Ex: Inglês, Espanhol..."
                        />
                        <select
                            value={newLang.level}
                            onChange={(e) => setNewLang({ ...newLang, level: e.target.value })}
                            className="md:w-48 px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm outline-none focus:border-[#F04E23] text-gray-600 font-medium appearance-none"
                        >
                            <option value="Básico">Básico</option>
                            <option value="Intermediário">Intermediário</option>
                            <option value="Avançado">Avançado</option>
                            <option value="Fluente">Fluente</option>
                            <option value="Nativo">Nativo</option>
                        </select>
                        <button
                            onClick={() => {
                                if (newLang.name.trim()) {
                                    setLanguages([...languages, { ...newLang }]);
                                    setNewLang({ name: '', level: 'Básico' });
                                }
                            }}
                            className="px-6 py-3 bg-orange-50 text-[#F04E23] rounded-xl font-black text-sm hover:bg-orange-100 transition-colors border border-orange-100"
                        >
                            Adicionar
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    {languages.length === 0 && !isEditing && (
                        <p className="text-gray-400 text-xs italic">Nenhum idioma informado.</p>
                    )}
                    {languages.map((lang, idx) => (
                        <div key={idx} className="group flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#F04E23]/30 transition-all animate-in zoom-in duration-300">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                <Globe size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-900 leading-none mb-1">{lang.name}</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{lang.level}</span>
                            </div>
                            {isEditing && (
                                <button 
                                    onClick={() => setLanguages(languages.filter((_, i) => i !== idx))}
                                    className="ml-2 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

                <fieldset disabled={readOnly || (canEdit && !isEditing)} className="contents">
                    <div className="space-y-12">
                        {/* Bio / Quem sou eu */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2 tracking-wider">Quem sou eu</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium h-32 resize-none transition-all"
                                placeholder="Fale um pouco sobre sua trajetória profissional e pessoal..."
                            />
                        </div>

                        {/* Rede Sociais - Nova Estrutura em Lista/Colunas */}
                        {/* Rede Sociais - Fluxo de Adicionar sob demanda */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-gray-400 mb-6 uppercase tracking-wider">Rede sociais</label>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    {/* Lista de redes já ativas (com valor ou selecionadas para adicionar) */}
                                    {SOCIAL_PLATFORMS.map(platform => {
                                        const key = platform.name.toLowerCase();
                                        const value = (formData as any)[key] || '';
                                        
                                        // Só mostra se houver valor ou se estivermos em modo de edição e a rede foi "ativada" (usando um estado auxiliar ou apenas checando o valor)
                                        // Para simplificar, vamos mostrar as que possuem valor. 
                                        if (!value && !isEditing) return null;
                                        if (!value && isEditing && !(formData as any)[`show_${key}`]) return null;

                                        return (
                                            <div key={key} className="group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#F04E23]/30 transition-all duration-300 animate-in zoom-in duration-300">
                                                <div className="flex items-center gap-4 md:w-48 shrink-0">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: platform.color }}>
                                                        <platform.icon size={20} />
                                                    </div>
                                                    <span className="font-black text-gray-900 text-sm tracking-tight">{platform.name}</span>
                                                </div>

                                                <div className="relative flex-1">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[11px] font-bold pointer-events-none">
                                                        {platform.domain}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={value.replace(`https://${platform.domain}`, '').replace(`http://${platform.domain}`, '')}
                                                        onChange={(e) => {
                                                            const handle = e.target.value.replace(`https://${platform.domain}`, '').replace(`http://${platform.domain}`, '');
                                                            setFormData({ ...formData, [key as any]: handle ? `https://${platform.domain}${handle}` : '' });
                                                        }}
                                                        className="w-full pl-[calc(4ch+2rem)] pr-12 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#F04E23] outline-none text-gray-800 font-bold text-sm transition-all"
                                                        placeholder="seu_usuario"
                                                        style={{ paddingLeft: `${platform.domain.length + 2}ch` }}
                                                    />
                                                    {isEditing && (
                                                        <button 
                                                            onClick={() => setFormData({ ...formData, [key as any]: '', [`show_${key}` as any]: false })}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Outros links personalizados */}
                                    {formData.others?.map((other, idx) => (
                                        <div key={idx} className="group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#F04E23]/30 transition-all duration-300">
                                            <div className="flex items-center gap-4 md:w-48 shrink-0">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-gray-200 transition-colors">
                                                    <Globe size={20} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={other.name}
                                                    onChange={(e) => {
                                                        const newOthers = [...formData.others];
                                                        newOthers[idx].name = e.target.value;
                                                        setFormData({ ...formData, others: newOthers });
                                                    }}
                                                    className="bg-transparent border-none p-0 focus:ring-0 font-black text-gray-900 text-sm tracking-tight outline-none w-full"
                                                />
                                            </div>
                                            <div className="flex-1 flex gap-2 items-center">
                                                <input
                                                    type="url"
                                                    value={other.url}
                                                    onChange={(e) => {
                                                        const newOthers = [...formData.others];
                                                        newOthers[idx].url = e.target.value;
                                                        setFormData({ ...formData, others: newOthers });
                                                    }}
                                                    className="flex-1 px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#F04E23] outline-none text-gray-800 font-bold text-sm transition-all"
                                                    placeholder="https://seu-link-extra.com"
                                                />
                                                <button 
                                                    onClick={() => setFormData({ ...formData, others: formData.others.filter((_, i) => i !== idx) })}
                                                    className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Seletor para adicionar novas redes */}
                                    {isEditing && (
                                        <div className="flex flex-wrap gap-3 pt-4">
                                            <div className="relative group">
                                                <select
                                                    onChange={(e) => {
                                                        if (e.target.value === 'custom') {
                                                            setFormData({ ...formData, others: [...formData.others, { name: 'Outro', url: '' }] });
                                                        } else if (e.target.value) {
                                                            setFormData({ ...formData, [`show_${e.target.value.toLowerCase()}` as any]: true });
                                                        }
                                                        e.target.value = '';
                                                    }}
                                                    className="appearance-none bg-white border-2 border-dashed border-gray-200 hover:border-[#F04E23] text-gray-400 hover:text-[#F04E23] font-black text-sm px-6 py-3 rounded-2xl transition-all cursor-pointer pr-10 outline-none"
                                                >
                                                    <option value="">+ Adicionar rede social</option>
                                                    {SOCIAL_PLATFORMS.filter(p => !(formData as any)[p.name.toLowerCase()]).map(p => (
                                                        <option key={p.name} value={p.name}>{p.name}</option>
                                                    ))}
                                                    <option value="custom">Outro link (Personalizado)</option>
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#F04E23]">
                                                    <Plus size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Treinamentos - Multiline Full Width like Reference */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2 tracking-wider">Treinamentos</label>
                            <textarea
                                value={Array.isArray(formData.trainings) ? formData.trainings.join('\n') : formData.trainings}
                                onChange={(e) => setFormData({ ...formData, trainings: e.target.value as any })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium h-32 resize-none transition-all"
                                placeholder="Liste seus principais cursos, certificações e treinamentos..."
                            />
                        </div>

                        {/* Organized Layout: Text Inputs then Availabilities Grid */}
                        <div className="space-y-10">
                            {/* Row 1: Main Text Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 mb-2 tracking-wider">Objetivo profissional</label>
                                    <textarea
                                        value={formData.job_objective}
                                        onChange={(e) => setFormData({ ...formData, job_objective: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium transition-all resize-none min-h-[120px]"
                                        placeholder="Ex.: salário, cargo, hierarquia ou área"
                                        rows={4}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-black text-gray-400 mb-2 tracking-wider">Diversidade</label>
                                    <input
                                        type="text"
                                        value={formData.diversity_info}
                                        onChange={(e) => setFormData({ ...formData, diversity_info: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium transition-all"
                                        placeholder="Informe sua identidade, raça ou orientação"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-2 italic font-medium">Informação opcional para programas de inclusão.</p>
                                </div>
                            </div>

                            {/* Row 2: Availabilities in a clean 3-col grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-t border-gray-100">
                                {/* Travel */}
                                <div className="space-y-4">
                                    <label className="block text-[11px] font-black text-gray-400 tracking-wider">Disponibilidade para viajar?</label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    checked={formData.availability_travel === true}
                                                    onChange={() => setFormData({ ...formData, availability_travel: true })}
                                                    className="appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                                                />
                                                {formData.availability_travel === true && <Check size={14} className="absolute text-white pointer-events-none" />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Sim</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    checked={formData.availability_travel === false}
                                                    onChange={() => setFormData({ ...formData, availability_travel: false })}
                                                    className="appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                                                />
                                                {formData.availability_travel === false && <Check size={14} className="absolute text-white pointer-events-none" />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Não</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Sleep */}
                                <div className="space-y-4">
                                    <label className="block text-[11px] font-black text-gray-400 tracking-wider">Disponibilidade para dormir?</label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    checked={formData.availability_sleep === true}
                                                    onChange={() => setFormData({ ...formData, availability_sleep: true })}
                                                    className="appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                                                />
                                                {formData.availability_sleep === true && <Check size={14} className="absolute text-white pointer-events-none" />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Sim</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    checked={formData.availability_sleep === false}
                                                    onChange={() => setFormData({ ...formData, availability_sleep: false })}
                                                    className="appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                                                />
                                                {formData.availability_sleep === false && <Check size={14} className="absolute text-white pointer-events-none" />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Não</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Move */}
                                <div className="space-y-4">
                                    <label className="block text-[11px] font-black text-gray-400 tracking-wider">Disponibilidade para se mudar?</label>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    checked={formData.availability_move === true}
                                                    onChange={() => setFormData({ ...formData, availability_move: true })}
                                                    className="appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                                                />
                                                {formData.availability_move === true && <Check size={14} className="absolute text-white pointer-events-none" />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Sim</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    checked={formData.availability_move === false}
                                                    onChange={() => setFormData({ ...formData, availability_move: false })}
                                                    className="appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#3B82F6] checked:border-[#3B82F6] transition-all cursor-pointer"
                                                />
                                                {formData.availability_move === false && <Check size={14} className="absolute text-white pointer-events-none" />}
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">Não</span>
                                        </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>

                {isEditing && (
                    <div className="flex justify-center mt-12 pt-12 border-t border-gray-50">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className={`
                                font-black py-4 px-12 rounded-2xl shadow-xl transition-all transform 
                                ${loading ? 'bg-gray-300' : 'bg-[#F04E23] hover:bg-[#d63f15] text-white shadow-orange-100 hover:-translate-y-1'}
                            `}
                        >
                            {loading ? 'Gravando...' : 'Gravar conhecimentos'}
                        </button>
                    </div>
                )}
        </div>
    );
};

export default SkillsForm;
