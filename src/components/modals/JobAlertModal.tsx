import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface JobAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const JobAlertModal: React.FC<JobAlertModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form State
    const [workModels, setWorkModels] = useState<string[]>([]);
    const [kmDistance, setKmDistance] = useState('20');
    const [publication, setPublication] = useState('any');
    const [salary, setSalary] = useState('');
    const [area, setArea] = useState('any');
    const [contract, setContract] = useState<string[]>([]);
    const [pcd, setPcd] = useState('false');

    // Load existing settings
    useEffect(() => {
        if (isOpen && user) {
            loadSettings();
        }
    }, [isOpen, user]);

    const loadSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('job_alerts')
                .select('*')
                .eq('user_id', user?.id)
                .single();

            if (data) {
                setWorkModels(data.work_models || []);
                setKmDistance(data.max_distance?.toString() || '20');
                setSalary(data.min_salary?.toString() || '');
                setArea(data.function_areas?.[0] || 'any');
                setContract(data.contract_types || []);
                setPcd(data.is_pcd ? 'true' : 'false');
            }
        } catch (err) {
            // No settings found, ignore
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);

        try {
            // Upsert alert settings
            const { error } = await supabase.from('job_alerts').upsert({
                user_id: user.id,
                work_models: workModels,
                max_distance: parseInt(kmDistance),
                min_salary: salary ? parseFloat(salary) : null,
                function_areas: area !== 'any' ? [area] : [], // Simplify for single select as per UI
                contract_types: contract,
                is_pcd: pcd === 'true',
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

            if (error) throw error;

            setSuccess(true);
        } catch (err) {
            console.error("Error saving alerts:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (success) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center shadow-xl animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Alerta salvo!</h2>
                    <p className="text-gray-500 mb-6">Alerta de vagas foi salvo com sucesso!</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={onClose} className="w-full bg-[#F04E23] text-white font-bold py-3 rounded-xl hover:bg-[#d93d15] transition-colors">
                            Ir para Vagas
                        </button>
                        <button onClick={() => { setSuccess(false); onClose(); }} className="text-gray-500 font-bold hover:text-gray-700">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl animate-in zoom-in-95">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Alerta de vagas</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Modelo de trabalho */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Modelo de trabalho</label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F04E23]/20 focus:border-[#F04E23]"
                            value={workModels[0] || ''}
                            onChange={(e) => setWorkModels([e.target.value])} // Simple single select for UI match
                        >
                            <option value="">Selecione</option>
                            <option value="remote">Remoto</option>
                            <option value="hybrid">Híbrido</option>
                            <option value="onsite">Presencial</option>
                        </select>
                    </div>

                    {/* Km de você */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Km de você</label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F04E23]/20 focus:border-[#F04E23]"
                            value={kmDistance}
                            onChange={(e) => setKmDistance(e.target.value)}
                        >
                            <option value="10">Até 10km</option>
                            <option value="20">Até 20km</option>
                            <option value="50">Até 50km</option>
                            <option value="100">Até 100km</option>
                        </select>
                    </div>

                    {/* Publicação */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Publicação</label>
                        <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F04E23]/20 focus:border-[#F04E23]">
                            <option value="any">Qualquer data</option>
                            <option value="today">Hoje</option>
                            <option value="week">Última semana</option>
                            <option value="month">Último mês</option>
                        </select>
                    </div>

                    {/* Salário */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Salário Mínimo</label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F04E23]/20 focus:border-[#F04E23]"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                        >
                            <option value="">Qualquer salário</option>
                            <option value="2000">R$ 2.000,00+</option>
                            <option value="5000">R$ 5.000,00+</option>
                            <option value="8000">R$ 8.000,00+</option>
                            <option value="12000">R$ 12.000,00+</option>
                        </select>
                    </div>

                    {/* Área */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Área</label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F04E23]/20 focus:border-[#F04E23]"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                        >
                            <option value="any">Todas as áreas</option>
                            <option value="Tecnologia">Tecnologia</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Design">Design</option>
                            <option value="Vendas">Vendas</option>
                            <option value="Saúde">Saúde</option>
                            <option value="Educação">Educação</option>
                        </select>
                    </div>

                    {/* Contrato */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Contrato</label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F04E23]/20 focus:border-[#F04E23]"
                            value={contract[0] || ''}
                            onChange={(e) => setContract([e.target.value])}
                        >
                            <option value="">Todos</option>
                            <option value="CLT">CLT</option>
                            <option value="PJ">PJ</option>
                            <option value="Estágio">Estágio</option>
                            <option value="Temporário">Temporário</option>
                        </select>
                    </div>

                    {/* PCD */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">PCD</label>
                        <select
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#F04E23]/20 focus:border-[#F04E23]"
                            value={pcd}
                            onChange={(e) => setPcd(e.target.value)}
                        >
                            <option value="false">Não</option>
                            <option value="true">Sim, apenas vagas afirmativas</option>
                        </select>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 flex justify-between items-center">
                    <button className="px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                        Resetar filtros
                    </button>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors">
                            Voltar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d93d15] transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar alterações'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default JobAlertModal;
