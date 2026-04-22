import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust path if needed
import { useAuth } from '@/contexts/AuthContext';
import { Pencil } from 'lucide-react';
import { formatCEP } from '@/utils/validators';

interface AddressFormProps {
    onNext?: () => void;
    onBack?: () => void;
    readOnly?: boolean;
    canEdit?: boolean;
    hideSkip?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ onNext, onBack, readOnly = false, canEdit = false, hideSkip = false }) => {
    const { user, profile, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(!canEdit);

    // Using any for profile to accept the new fields until types are fully updated
    const userProfile = profile as any;

    const [formData, setFormData] = useState({
        cep: '',
        city: '',
        state: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: ''
    });

    useEffect(() => {
        if (userProfile) {
            setFormData({
                cep: userProfile.cep || '',
                city: userProfile.city || '',
                state: userProfile.state || '',
                street: userProfile.street || '',
                number: userProfile.number || '',
                complement: userProfile.complement || '',
                neighborhood: userProfile.neighborhood || ''
            });
        }
    }, [userProfile]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCepBlur = async () => {
        const cep = formData.cep.replace(/\D/g, '');
        if (cep.length === 8) {
            setLoading(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        city: data.localidade,
                        state: data.uf,
                        street: data.logradouro,
                        neighborhood: data.bairro
                    }));
                }
            } catch (error) {
                console.error("Error fetching CEP", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    cep: formData.cep,
                    city: formData.city,
                    state: formData.state,
                    street: formData.street,
                    number: formData.number,
                    complement: formData.complement,
                    neighborhood: formData.neighborhood
                })
                .eq('id', user.id);

            if (error) throw error;

            await refreshUser();

            if (canEdit) {
                setIsEditing(false);
            } else if (onNext) {
                onNext();
            }
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Erro ao salvar endereço.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Endereço</h2>
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
            <p className="text-gray-400 font-bold mb-10 text-sm">Informe seu endereço completo.</p>

            <form onSubmit={handleSave} className="space-y-8">
                <fieldset disabled={readOnly || (canEdit && !isEditing)} className="contents">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* CEP */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">CEP</label>
                            <input
                                type="text"
                                value={formData.cep}
                                onChange={(e) => handleChange('cep', formatCEP(e.target.value))}
                                onBlur={handleCepBlur}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="00000-000"
                                required
                            />
                        </div>

                        {/* Logradouro */}
                        <div className="md:col-span-2">
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Logradouro</label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => handleChange('street', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="Rua, Avenida, etc."
                                required
                            />
                        </div>

                        {/* Número */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Número</label>
                            <input
                                type="text"
                                value={formData.number}
                                onChange={(e) => handleChange('number', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="123"
                                required
                            />
                        </div>

                        {/* Complemento */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Complemento</label>
                            <input
                                type="text"
                                value={formData.complement}
                                onChange={(e) => handleChange('complement', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="Apto, Bloco, etc."
                            />
                        </div>

                        {/* Bairro */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Bairro</label>
                            <input
                                type="text"
                                value={formData.neighborhood}
                                onChange={(e) => handleChange('neighborhood', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="Bairro"
                                required
                            />
                        </div>

                        {/* Cidade */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Cidade</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="Cidade"
                                required
                            />
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-[11px] font-black text-gray-400 mb-2">Estado</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#F04E23] outline-none text-gray-800 font-medium"
                                placeholder="UF"
                                required
                            />
                        </div>
                    </div>
                </fieldset>

                {!readOnly && (isEditing || !canEdit) && (
                    <div className={`flex justify-center mt-12 gap-4 ${!onBack && !onNext ? '' : 'pt-6 border-t border-gray-50'}`}>
                        {onBack && (
                            <button
                                type="button"
                                onClick={onBack}
                                className="text-gray-400 font-bold hover:text-gray-600 px-8 py-3"
                            >
                                Voltar
                            </button>
                        )}
                        {!hideSkip && onNext && (
                            <button
                                type="button"
                                onClick={onNext}
                                className="text-gray-400 font-bold hover:text-gray-600 px-8 py-3"
                            >
                                Pular
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                font-black py-4 px-12 rounded-2xl shadow-xl transition-all transform 
                                ${loading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-[#F04E23] hover:bg-[#d63f15] text-white shadow-orange-100 hover:-translate-y-1'
                                }
                            `}
                        >
                            {loading ? 'Salvando...' : (canEdit ? 'Concluir edição' : 'Salvar endereço')}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddressForm;
