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
                    others: formData.others || []
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
            <div className="mb-2 flex justify-between items-center">
                <label className="block text-[11px] font-black text-gray-400 tracking-wider">Habilidades</label>
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

            <div className="flex flex-wrap gap-3 mb-12">
                {skills.map(skill => (
                    <div key={skill.id} className="px-4 py-2 bg-[#F9FAFB] border border-gray-300 rounded-lg text-sm font-semibold text-gray-500 flex items-center gap-3 animate-in fade-in duration-300">
                        {skill.name}
                        {isEditing && (
                            <button onClick={() => handleDeleteSkill(skill.id)} className="text-gray-400 hover:text-gray-900 transition-colors">
                                <X size={16} className="stroke-[2.5]" />
                            </button>
                        )}
                    </div>
                ))}
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

                        {/* Rede Sociais */}
                        <div className="relative">
                            <label className="block text-[11px] font-black text-gray-400 mb-2 tracking-wider">Rede sociais</label>
                            <div className="max-w-sm relative">
                                <input
                                    type="text"
                                    value={socialInput}
                                    onChange={(e) => {
                                        setSocialInput(e.target.value);
                                        setShowSocialSuggestions(true);
                                    }}
                                    onFocus={() => setShowSocialSuggestions(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            const val = socialInput.trim();
                                            if (val) {
                                                // If it looks like a platform name, try to match it
                                                const platform = SOCIAL_PLATFORMS.find(p => p.name.toLowerCase() === val.toLowerCase());
                                                if (platform) {
                                                    setFormData({ ...formData, [platform.name.toLowerCase() as any]: `https://${platform.domain}` });
                                                } else {
                                                    // Otherwise add to others
                                                    setFormData({ 
                                                        ...formData, 
                                                        others: [...formData.others, { name: 'Personalizado', url: val }] 
                                                    });
                                                }
                                                setSocialInput('');
                                                setShowSocialSuggestions(false);
                                            }
                                        }
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium transition-all"
                                    placeholder="Digite a rede social ou cole o link e dê Enter"
                                />

                                {showSocialSuggestions && socialInput.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        {SOCIAL_PLATFORMS.filter(p => p.name.toLowerCase().includes(socialInput.toLowerCase())).map(platform => (
                                            <button
                                                key={platform.name}
                                                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                                onClick={() => {
                                                    const key = platform.name.toLowerCase();
                                                    setFormData({ 
                                                        ...formData, 
                                                        [key as any]: `https://${platform.domain}` 
                                                    });
                                                    setSocialInput('');
                                                    setShowSocialSuggestions(false);
                                                }}
                                            >
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: platform.color }}>
                                                    <platform.icon size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-black text-gray-900 text-sm tracking-tight">{platform.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">Adicionar perfil do {platform.name}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-4">
                                {SOCIAL_PLATFORMS.map(platform => {
                                    const key = platform.name.toLowerCase();
                                    const value = (formData as any)[key];
                                    if (!value) return null;
                                    
                                    return (
                                        <div key={key} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-500 flex items-center gap-2 animate-in zoom-in duration-200">
                                            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px]" style={{ backgroundColor: platform.color }}>
                                                <platform.icon size={12} />
                                            </div>
                                            <span className="truncate max-w-[150px]">{value.split('/').filter(Boolean).pop() || platform.name}</span>
                                            <button 
                                                onClick={() => setFormData({ ...formData, [key as any]: '' } as any)} 
                                                className="text-gray-400 hover:text-gray-900 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                                {/* Others list */}
                                {formData.others?.map((other, idx) => (
                                    <div key={idx} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-500 flex items-center gap-2 animate-in zoom-in duration-200">
                                        <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-gray-500">
                                            <Globe size={12} />
                                        </div>
                                        <span className="truncate max-w-[150px]">{other.url.split('/').filter(Boolean).pop()}</span>
                                        <button 
                                            onClick={() => setFormData({ ...formData, others: formData.others.filter((_, i) => i !== idx) })} 
                                            className="text-gray-400 hover:text-gray-900 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
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
