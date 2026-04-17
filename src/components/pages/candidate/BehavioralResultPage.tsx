import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Trophy, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/supabase';

type TestResult = Database['public']['Tables']['candidate_test_results']['Row'];
type BehavioralTest = Database['public']['Tables']['behavioral_tests']['Row'];

const traitDescriptions: Record<string, string> = {
    'Confiança': 'Pessoas com alta confiança tendem a delegar com mais facilidade e trabalhar bem em equipe, mas podem ser mais vulneráveis a decepções se não forem cautelosas.',
    'Fraqueza': 'A franqueza contribui para uma comunicação clara e assertiva, sendo muito valorizada em ambientes que prezam pela objetividade e integridade.',
    'Altruísmo': 'Pessoas altruístas fortalecem o clima organizacional, contribuindo para ambientes colaborativos e empáticos.',
    'Complacência': 'Um bom nível de complacência favorece a harmonia no time, mas níveis muito altos podem dificultar o enfrentamento de situações que exigem firmeza.',
    'Modestia': 'Pessoas modestas geralmente são bem-vistas em equipes colaborativas, pois valorizam o coletivo mais do que o ego.',
    'Empatia': 'A empatia é fundamental para o trabalho em equipe, liderança e resolução de conflitos.'
};

const BehavioralResultPage: React.FC = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<TestResult | null>(null);
    const [test, setTest] = useState<BehavioralTest | null>(null);

    useEffect(() => {
        if (resultId) fetchResultData();
    }, [resultId]);

    const fetchResultData = async () => {
        try {
            setLoading(true);
            const { data: resData, error: resError } = await supabase
                .from('candidate_test_results')
                .select(`
                    *,
                    behavioral_tests (*)
                `)
                .eq('id', resultId)
                .single();

            if (resError) throw resError;
            
            setResult(resData);
            setTest(resData.behavioral_tests as BehavioralTest);
        } catch (error) {
            console.error('Error fetching result:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-[#F04E23]" size={48} />
            </div>
        );
    }

    if (!result || !test) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                <h2 className="text-xl font-black text-gray-900 mb-4">Resultado não encontrado</h2>
                <button onClick={() => navigate('/app/behavioral-test')} className="px-8 py-3 bg-[#F04E23] text-white font-black rounded-xl text-sm tracking-tight transition-all hover:scale-105">Voltar para avaliações</button>
            </div>
        );
    }

    const scores = (result.scores as Record<string, number>) || {};
    const scoreValues = Object.values(scores);
    const totalAderencia = scoreValues.length > 0 
        ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
        : 0;

    // Helper to format trait names to Sentence Case
    const formatTrait = (text: string) => {
        if (!text) return '';
        const lower = text.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    return (
        <main className="max-w-[1400px] w-full mx-auto px-4 md:px-12 py-8 md:py-16 animate-in fade-in duration-500">
            <button onClick={() => navigate('/app/behavioral-test')} className="flex items-center gap-2 text-gray-800 font-black mb-10 hover:text-[#F04E23] transition-colors text-xs">
                <ChevronLeft size={20} strokeWidth={3} /> Sair do detalhamento
            </button>

            <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-8 md:p-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16 pb-12 border-b border-gray-100">
                    <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-gray-50 flex items-center justify-center bg-blue-100 text-3xl font-black text-blue-600 shadow-xl shadow-blue-50">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                profile?.full_name?.charAt(0) || user?.email?.charAt(0)
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-none mb-2">{profile?.full_name || 'Candidato'}</h1>
                            <p className="text-gray-400 font-bold text-base">Mapeamento concluído com sucesso</p>
                        </div>
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-gray-500 font-bold text-lg mb-4 tracking-tight">Pontuação geral: <span className="font-black text-gray-900">{totalAderencia}% de aderência</span></p>
                        <div className="flex items-center gap-3">
                            <div className="h-3 flex gap-1 w-[200px] md:w-[300px]">
                                {[1, 2, 3, 4, 5].map(i => {
                                    const stepValue = i * 20;
                                    const isFilled = stepValue <= totalAderencia;
                                    const isPartial = !isFilled && (stepValue - 20) < totalAderencia;
                                    
                                    return (
                                        <div key={i} className="flex-1 rounded-full bg-gray-100 overflow-hidden">
                                            {isFilled ? (
                                                <div className="w-full h-full bg-[#5AB7F7]" />
                                            ) : isPartial ? (
                                                <div className="h-full bg-[#5AB7F7]" style={{ width: `${((totalAderencia % 20) / 20) * 100}%` }} />
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#5AB7F7] flex items-center justify-center text-white shadow-xl shadow-blue-100">
                                <Trophy size={20} strokeWidth={3} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-20">
                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">{formatTrait(test.title)}</h2>
                    <p className="text-gray-400 font-bold text-lg">Confira o seu desempenho detalhado neste teste comportamental.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
                    {Object.entries(scores).map(([trait, score], i) => (
                        <div key={trait} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                            <div className="flex justify-between items-end mb-5">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">{formatTrait(trait)}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-gray-900">{score}</span>
                                    <span className="text-gray-400 font-black text-sm">%</span>
                                </div>
                            </div>
                            <div className="h-4 flex gap-1 w-full bg-gray-50 rounded-full overflow-hidden mb-6">
                                {[20, 40, 60, 80, 100].map(step => (
                                    <div
                                        key={step}
                                        className={`flex-1 rounded-full transition-all duration-1000 ${step <= score ? 'bg-[#5AB7F7]' : 'bg-gray-100'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-500 font-bold text-sm leading-relaxed">
                                {traitDescriptions[formatTrait(trait)] || 'A pontuação indica seu nível de tendência para esta característica comportamental específica.'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default BehavioralResultPage;
