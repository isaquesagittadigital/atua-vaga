import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { session } = useAuth();
    const [selections, setSelections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulação de busca de dados
        const fetchSelections = async () => {
            setLoading(true);
            try {
                // Aqui entraria a chamada de API
                setSelections([]); // Forçando lista vazia
            } finally {
                setLoading(false);
            }
        };
        fetchSelections();
    }, [session]);

    return (
        <div className="max-w-[1400px] w-full mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-black text-gray-900">Seleção</h1>
                <button
                    onClick={() => navigate('/company/jobs')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                    <Search size={20} />
                    Ver vagas
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-10">Acompanhe os processos seletivos e candidatos em destaque.</p>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F04E23]"></div>
                </div>
            ) : selections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border-2 border-dashed border-gray-100 px-6 sm:px-10 text-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                        <Target className="text-[#F04E23]" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-[#1E293B] mb-2">Nenhum processo em andamento</h3>
                    <p className="text-slate-500 max-w-md mb-8">
                        Selecione talentos das suas vagas publicadas para iniciar o processo de contratação.
                    </p>
                    <button
                        onClick={() => navigate('/company/jobs')}
                        className="px-8 py-3 bg-[#1D4ED8] text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 active:scale-95 text-sm"
                    >
                        Ver minhas vagas
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {/* Lista de seleções aqui */}
                </div>
            )}
        </div>
    );
};

export default SelectionPage;
