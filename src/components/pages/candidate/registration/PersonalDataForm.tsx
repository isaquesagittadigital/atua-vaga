import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { formatCPF, formatPhone } from '@/utils/validators';

interface PersonalDataFormProps {
    onNext: () => void;
    readOnly?: boolean;
}

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ onNext, readOnly = false }) => {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        cpf: '',
        email: '',
        phone: '',
        birth_date: '',
        civil_status: '',
        address: '',
        cnh: false
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || profile.name || '',
                cpf: profile.cpf || '',
                email: profile.email || '',
                phone: profile.phone || '',
                birth_date: profile.birth_date || '',
                civil_status: profile.civil_status || '',
                address: profile.address || '',
                cnh: profile.cnh || false
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
                    birth_date: formData.birth_date || null,
                    civil_status: formData.civil_status,
                    address: formData.address,
                    cnh: formData.cnh
                })
                .eq('id', user.id);

            if (error) throw error;
            onNext();
        } catch (error) {
            console.error('Error saving personal data:', error);
            alert('Erro ao salvar dados pessoais. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate age helper
    const calculateAge = (dateString: string) => {
        if (!dateString) return '';
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} anos`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dados pessoais</h2>
            <p className="text-gray-500 mb-8">Preencha o restante dos seus dados.</p>

            <form onSubmit={handleSave} className="space-y-6">
                <fieldset disabled={readOnly} className="contents">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Nome</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => handleChange('full_name', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                placeholder="Seu nome completo"
                                required
                            />
                        </div>

                        {/* CPF or CNPJ */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">CPF ou CNPJ</label>
                            <input
                                type="text"
                                value={formData.cpf}
                                onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                placeholder="000.000.000-00"
                            />
                        </div>

                        {/* Email (Read only) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">E-mail</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* Telefone */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Telefone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                placeholder="+55 11 99999-9999"
                            />
                        </div>

                        {/* Data de Nascimento */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Data de nascimento</label>
                            <input
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => handleChange('birth_date', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                            />
                        </div>

                        {/* Idade (Calculated) */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Idade</label>
                            <input
                                type="text"
                                value={calculateAge(formData.birth_date)}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                                placeholder="--"
                            />
                        </div>

                        {/* Estado Civil */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Estado civil</label>
                            <select
                                value={formData.civil_status}
                                onChange={(e) => handleChange('civil_status', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none bg-white"
                            >
                                <option value="">Selecione</option>
                                <option value="Solteiro(a)">Solteiro(a)</option>
                                <option value="Casado(a)">Casado(a)</option>
                                <option value="Divorciado(a)">Divorciado(a)</option>
                                <option value="Viúvo(a)">Viúvo(a)</option>
                                <option value="União Estável">União Estável</option>
                            </select>
                        </div>

                        {/* Endereço */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Endereço completo</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                placeholder="Rua, número, bairro, cidade - UF"
                            />
                        </div>
                    </div>

                    {/* Possui CNH */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Possui CNH?</label>
                        <div className="flex items-center gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="cnh"
                                    checked={formData.cnh === true}
                                    onChange={() => handleChange('cnh', true)}
                                    className="w-5 h-5 text-[#F04E23] focus:ring-[#F04E23]"
                                />
                                <span className="text-gray-700 font-medium">Sim</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="cnh"
                                    checked={formData.cnh === false}
                                    onChange={() => handleChange('cnh', false)}
                                    className="w-5 h-5 text-[#F04E23] focus:ring-[#F04E23]"
                                />
                                <span className="text-gray-700 font-medium">Não</span>
                            </label>
                        </div>
                    </div>
                </fieldset>

                {!readOnly && (
                    <div className="flex justify-center mt-10 pt-6">
                        <button
                            type="button"
                            onClick={onNext}
                            className="text-gray-500 font-bold hover:text-gray-700 px-8 py-3"
                        >
                            Pular
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#F04E23] hover:bg-[#d63f15] text-white font-bold py-3 px-10 rounded-full shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-1"
                        >
                            {loading ? 'Salvando...' : 'Salvar e continuar'}
                        </button>
                    </div>
                )}


            </form>
        </div>
    );
};

export default PersonalDataForm;
