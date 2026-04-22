import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { formatCPF, formatPhone, formatDate, formatDateToLocale, parseDateToISO, formatCEP } from '@/utils/validators';
import { Pencil } from 'lucide-react';

interface PersonalDataFormProps {
    onNext: () => void;
    readOnly?: boolean;
    canEdit?: boolean;
    hideSkip?: boolean;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ onNext, readOnly = false, canEdit = false, hideSkip = false }) => {
    const { user, profile, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!canEdit);
    
    const [formData, setFormData] = useState({
        full_name: '',
        cpf: '',
        email: '',
        phone: '',
        birth_date: '',
        civil_status: '',
        cep: '',
        city: '',
        state: '',
        street: '',
        number: '',
        neighborhood: '',
        cnh: false
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || profile.name || '',
                cpf: profile.cpf || '',
                email: profile.email || '',
                phone: profile.phone || '',
                birth_date: formatDateToLocale(profile.birth_date || ''),
                civil_status: profile.civil_status || '',
                cep: (profile as any).cep || '',
                city: (profile as any).city || '',
                state: (profile as any).state || '',
                street: (profile as any).street || '',
                number: (profile as any).number || '',
                neighborhood: (profile as any).neighborhood || '',
                cnh: (profile as any).cnh || (profile as any).has_cnh || false
            });
        }
    }, [profile]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    cpf: formData.cpf,
                    phone: formData.phone,
                    birth_date: parseDateToISO(formData.birth_date),
                    civil_status: formData.civil_status,
                    cep: formData.cep,
                    city: formData.city,
                    state: formData.state,
                    street: formData.street,
                    number: formData.number,
                    neighborhood: formData.neighborhood,
                    cnh: formData.cnh
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshUser();

            if (canEdit) {
                setIsEditing(false);
            } else {
                onNext();
            }
        } catch (error) {
            console.error('Error saving personal data:', error);
            alert('Erro ao salvar dados pessoais.');
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = (dateString: string) => {
        if (!dateString) return '';
        const iso = parseDateToISO(dateString);
        if (!iso) return '';
        const birthDate = new Date(iso);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 0 ? `${age} anos` : '';
    };


    return (
        <div className="bg-white">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Dados pessoais</h2>
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
            <p className="text-gray-400 font-bold mb-10 text-sm">Preencha o restante dos seus dados.</p>

            <form onSubmit={handleSave} className="space-y-8">
                <fieldset disabled={readOnly || (canEdit && !isEditing)} className="contents">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Nome */}
                        <div className="md:col-span-1">
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Nome</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => handleChange('full_name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="Seu nome"
                                required
                            />
                        </div>

                        {/* CPF ou CNPJ */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">CPF ou CNPJ</label>
                            <input
                                type="text"
                                value={formData.cpf}
                                onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="000.000.000-00"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">E-mail</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed font-medium"
                            />
                        </div>

                        {/* Telefone */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Telefone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="+55 11 99999-9999"
                            />
                        </div>

                        {/* Data de Nascimento */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Data de nascimento</label>
                            <input
                                type="text"
                                value={formData.birth_date}
                                onChange={(e) => handleChange('birth_date', formatDate(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="DD/MM/AAAA"
                            />
                        </div>

                        {/* Idade */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Idade</label>
                            <input
                                type="text"
                                value={calculateAge(formData.birth_date)}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-400 font-medium"
                                placeholder="--"
                            />
                        </div>

                        {/* Estado Civil */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Estado civil</label>
                            <select
                                value={formData.civil_status}
                                onChange={(e) => handleChange('civil_status', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none bg-white text-gray-800 font-medium appearance-none"
                            >
                                <option value="">Selecionar</option>
                                <option value="Solteiro(a)">Solteiro(a)</option>
                                <option value="Casado(a)">Casado(a)</option>
                                <option value="Divorciado(a)">Divorciado(a)</option>
                                <option value="Viúvo(a)">Viúvo(a)</option>
                            </select>
                        </div>

                        {/* Possui CNH? */}
                        <div className="md:col-span-1">
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Possui CNH?</label>
                            <div className="flex items-center gap-6 py-3">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="cnh"
                                        checked={formData.cnh === true}
                                        onChange={() => handleChange('cnh', true)}
                                        className="w-4 h-4 text-[#F04E23] border-gray-300 focus:ring-[#F04E23]"
                                    />
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Sim</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="cnh"
                                        checked={formData.cnh === false}
                                        onChange={() => handleChange('cnh', false)}
                                        className="w-4 h-4 text-[#F04E23] border-gray-300 focus:ring-[#F04E23]"
                                    />
                                    <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Não</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {!readOnly && isEditing && (
                    <div className="flex justify-center mt-12">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                font-black py-4 px-12 rounded-2xl shadow-xl transition-all transform 
                                ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#F04E23] hover:bg-[#d63f15] text-white shadow-orange-100 hover:-translate-y-1'}
                            `}
                        >
                            {loading ? 'Salvando...' : 'Concluir edição'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default PersonalDataForm;
