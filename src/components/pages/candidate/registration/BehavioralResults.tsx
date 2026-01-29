import React, { useEffect, useState } from 'react';
import { FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/types/supabase';
import TestResultModal from '../TestResultModal';

type BehavioralTest = Database['public']['Tables']['behavioral_tests']['Row'];
type TestResult = Database['public']['Tables']['candidate_test_results']['Row'];

const BehavioralResults: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tests, setTests] = useState<BehavioralTest[]>([]);
    const [results, setResults] = useState<Record<string, TestResult>>({});
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedReaction, setSelectedReaction] = useState<{ test: BehavioralTest, result: TestResult } | null>(null);

    useEffect(() => {
        if (user) fetchTestsAndResults();
    }, [user]);

    const fetchTestsAndResults = async () => {
        try {
            // Fetch Tests
            const { data: testData, error: testError } = await supabase
                .from('behavioral_tests')
                .select('*')
                .order('title');

            if (testError) throw testError;

            // Fetch User Results
            const { data: resData, error: resError } = await supabase
                .from('candidate_test_results')
                .select('*')
                .eq('user_id', user!.id);

            if (resError) throw resError;

            // Map results by test_id
            const resultsMap: Record<string, TestResult> = {};
            resData?.forEach(res => {
                if (res.test_id) resultsMap[res.test_id] = res;
            });

            setTests(testData || []);
            setResults(resultsMap);
        } catch (error) {
            console.error('Error fetching tests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (test: BehavioralTest) => {
        const result = results[test.id];
        if (result && result.scores) {
            // Test completed (or at least has scores)
            setSelectedReaction({ test, result });
        } else {
            // Start or continue test
            navigate(`/app/behavioral-test/${test.id}`);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Carregando avaliação...</div>;

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Resultado comportamental</h2>
                <p className="text-gray-500 mb-8">Mostre aos recrutadores seu nível profissional respondendo os testes.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tests.map(test => {
                        const hasResult = !!results[test.id]?.scores;

                        return (
                            <div
                                key={test.id}
                                className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors group"
                                onClick={() => handleCardClick(test)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-lg text-white transition-colors ${hasResult ? 'bg-blue-500 group-hover:bg-blue-600' : 'bg-orange-500 group-hover:bg-orange-600'}`}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{test.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {hasResult
                                                ? `PDF • ${new Date(results[test.id].completed_at || Date.now()).toLocaleDateString()} • ${test.file_size || '200 KB'}`
                                                : 'Clique para iniciar'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="text-blue-400 group-hover:text-blue-600 transition-colors" size={20} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedReaction && (
                <TestResultModal
                    isOpen={!!selectedReaction}
                    onClose={() => setSelectedReaction(null)}
                    testTitle={selectedReaction.test.title}
                    scores={selectedReaction.result.scores as Record<string, number> || {}}
                />
            )}
        </>
    );
};

export default BehavioralResults;
