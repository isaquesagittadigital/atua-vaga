import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust path if needed
import { useAuth } from '@/contexts/AuthContext';
import { Pencil } from 'lucide-react';

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Endereço</h2>
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
            <p className="text-gray-500 mb-8">Informe seu endereço completo.</p>

            <form onSubmit={handleSave} className="space-y-6">
                <fieldset disabled={readOnly || (canEdit && !isEditing)} className="contents">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* CEP */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">CEP</label>
                            <input
                                type="text"
                                value={formData.cep}
                                onChange={(e) => handleChange('cep', e.target.value)}
                                onBlur={handleCepBlur}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                placeholder="00000-000"
                                required
                            />
                        </div>

                        {/* Cidade */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Cidade</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                required
                            />
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Estado</label>
                            <input
                                type="text"
                                value={formData.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                required
                            />
                        </div>

                        {/* Rua */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Rua</label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => handleChange('street', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                required
                            />
                        </div>

                        {/* Número */}
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Número</label>
                            <input
                                type="text"
                                value={formData.number}
                                onChange={(e) => handleChange('number', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                required
                            />
                        </div>

                        {/* Bairro */}
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Bairro</label>
                            <input
                                type="text"
                                value={formData.neighborhood}
                                onChange={(e) => handleChange('neighborhood', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none"
                                required
                            />
                        </div>
                    </div>
                </fieldset>

                {!readOnly && (
                    <div className="flex justify-center mt-10 pt-6 gap-4">
                        {onBack && (
                            <button
                                type="button"
                                onClick={onBack}
                                className="text-gray-500 font-bold hover:text-gray-700 px-8 py-3"
                            >
                                Voltar
                            </button>
                        )}
                        {!hideSkip && onNext && (
                            <button
                                type="button"
                                onClick={onNext}
                                className="text-gray-500 font-bold hover:text-gray-700 px-8 py-3"
                            >
                                Pular
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading || (canEdit && !isEditing)}
                            className={`
                                font-bold py-3 px-10 rounded-full shadow-lg transition-all transform 
                                ${loading || (canEdit && !isEditing)
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                    : 'bg-[#F04E23] hover:bg-[#d63f15] text-white shadow-orange-200 hover:-translate-y-1'
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
