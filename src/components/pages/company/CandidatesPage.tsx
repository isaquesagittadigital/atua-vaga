import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CandidatesPage: React.FC = () => {
    const navigate = useNavigate();
    const { session } = useAuth();
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidates = async () => {
            if (!session?.access_token) return;
            setLoading(true);
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
                const response = await fetch(`${apiUrl}/candidates/matches`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setCandidates(data);
                }
            } catch (error) {
                console.error('Error fetching candidates:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCandidates();
    }, [session]);

    return (
        <div className="max-w-[1400px] w-full mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-black text-gray-900">Candidatos</h1>
                <button
                    onClick={() => navigate('/company/jobs/new')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                    <Plus size={20} />
                    Cadastrar vaga
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-10">Gerencie todos os candidatos que se aplicaram às suas vagas.</p>

            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F04E23]"></div>
                </div>
            ) : candidates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border-2 border-dashed border-gray-100 px-6 sm:px-10 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                        <Users className="text-blue-500" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-[#1E293B] mb-2">Nenhum candidato encontrado</h3>
                    <p className="text-slate-500 max-w-md mb-8">
                        Comece divulgando suas vagas para começar a atrair os melhores talentos para sua empresa.
                    </p>
                    <button
                        onClick={() => navigate('/company/jobs/new')}
                        className="px-8 py-3 bg-[#1D4ED8] text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 active:scale-95 text-sm"
                    >
                        Criar vaga agora
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map(candidate => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CandidateCard: React.FC<{ candidate: any }> = ({ candidate }) => (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center overflow-hidden">
                    {candidate.imgUrl ? (
                        <img src={candidate.imgUrl} alt={candidate.companyRef} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-blue-500 font-bold text-xl">{candidate.companyRef?.charAt(0)}</span>
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-[#F04E23] transition-colors">{candidate.companyRef}</h4>
                    <p className="text-xs text-gray-500">{candidate.role}</p>
                </div>
            </div>
            <div className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-black border border-orange-100">
                {candidate.matchPercentage}% match
            </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
            <span>{candidate.location}</span>
        </div>
        <button className="w-full py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors text-sm">
            Ver perfil completo
        </button>
    </div>
);

export default CandidatesPage;
