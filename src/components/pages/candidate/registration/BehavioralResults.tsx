import React, { useEffect, useState } from 'react';
import { FileText, ChevronRight, PieChart, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/supabase';

type BehavioralTest = Database['public']['Tables']['behavioral_tests']['Row'];
type TestResult = Database['public']['Tables']['candidate_test_results']['Row'] & {
    behavioral_tests: BehavioralTest | null;
};

const BehavioralResults: React.FC<{ externalUserId?: string }> = ({ externalUserId }) => {
    const navigate = useNavigate();
    const { user: authUser } = useAuth();
    const user = externalUserId ? { id: externalUserId } as any : authUser;
    const [resultsData, setResultsData] = useState<TestResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchTestsAndResults();
    }, [user]);

    const fetchTestsAndResults = async () => {
        try {
            setLoading(true);
            setResultsData([]); // Reset before fetching
            const { data, error } = await supabase
                .from('candidate_test_results')
                .select(`
                    *,
                    behavioral_tests (*)
                `)
                .eq('user_id', user!.id)
                .order('completed_at', { ascending: false });

            if (error) throw error;

            const validResults = (data || []).map(res => ({
                ...res,
                behavioral_tests: res.behavioral_tests as unknown as BehavioralTest
            })).filter(res => 
                res.behavioral_tests && 
                res.scores && 
                typeof res.scores === 'object' && 
                Object.keys(res.scores as object).length > 0
            );

            // Deduplicate: group by test_id and keep the most recent result
            const dedupedResults = validResults.reduce((acc: TestResult[], current) => {
                const existingIndex = acc.findIndex(item => item.test_id === current.test_id);
                if (existingIndex === -1) {
                    acc.push(current as TestResult);
                } else {
                    // If current is newer than existing, replace it
                    const existingDate = new Date(acc[existingIndex].completed_at || 0).getTime();
                    const currentDate = new Date(current.completed_at || 0).getTime();
                    if (currentDate > existingDate) {
                        acc[existingIndex] = current as TestResult;
                    }
                }
                return acc;
            }, []);

            setResultsData(dedupedResults);
        } catch (error) {
            console.error('Error fetching behavioral results:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTitle = (title: string) => {
        if (!title) return '';
        const lower = title.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    if (loading) return (
        <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F04E23]"></div>
        </div>
    );

    const completedResults = resultsData;

    return (
        <div className="space-y-12">
            <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Resultado comportamental</h2>
                    {completedResults.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black border border-green-100">
                           <ClipboardCheck size={14} />
                           {completedResults.length} {completedResults.length === 1 ? 'concluído' : 'concluídos'}
                        </div>
                    )}
                </div>
                <p className="text-gray-400 font-bold mb-10 text-sm">Confira o seu desempenho detalhado nas avaliações realizadas.</p>

                {completedResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {completedResults.map(result => {
                            const test = result.behavioral_tests!;
                            const scoreValues = Object.values(result.scores as Record<string, number> || {});
                            const avg = scoreValues.length > 0 ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : 0;

                            return (
                                <div
                                    key={result.id}
                                    className="group relative border border-gray-300 bg-white rounded-3xl p-8 cursor-pointer hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300"
                                    onClick={() => navigate(`/app/behavioral-result/${result.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-50 group-hover:scale-110 transition-transform">
                                            <PieChart size={28} />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-black text-gray-400 tracking-tight mb-1">Status</span>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black">Verificado</span>
                                        </div>
                                    </div>

                                    <h3 className="font-black text-gray-900 text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors truncate">{formatTitle(test.title)}</h3>
                                    
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                        <FileText size={14} />
                                        <span>PDF • {new Date(result.completed_at || Date.now()).toLocaleDateString('pt-BR')}</span>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-6">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 tracking-tight">Aderência global</span>
                                            <span className="text-xl font-black text-gray-900">{avg}%</span>
                                        </div>
                                        <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <ArrowUpRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-gray-50/50 rounded-[32px] p-16 text-center border border-gray-300 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                            <FileText className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Nenhum teste concluído</h3>
                        <p className="text-gray-400 font-bold text-sm mt-2 mb-8 max-w-[280px] mx-auto">Conclua avaliações para ver seus insights comportamentais aqui.</p>
                        
                        <button
                            onClick={() => navigate('/app/behavioral-test')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[#F04E23] text-white rounded-2xl font-black text-sm hover:bg-[#d63e19] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-orange-100"
                        >
                            <ClipboardCheck size={18} />
                            Realizar Avaliação
                            <ChevronRight size={18} className="opacity-50" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BehavioralResults;
