import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, PieChart, ArrowUpRight, FileText, ClipboardCheck, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import TestSuccessModal from './TestSuccessModal';
import { Database } from '@/types/supabase';

type Question = Database['public']['Tables']['test_questions']['Row'];
type BehavioralTest = Database['public']['Tables']['behavioral_tests']['Row'];
type TestResult = Database['public']['Tables']['candidate_test_results']['Row'];

const QUESTIONS_PER_PAGE = 5;

const BehavioralTestPage: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [view, setView] = useState<'LIST' | 'QUIZ'>(testId ? 'QUIZ' : 'LIST');
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [testTitle, setTestTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [page, setPage] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(testId || null);

  // List View State
  const [allTests, setAllTests] = useState<BehavioralTest[]>([]);
  const [allResults, setAllResults] = useState<Record<string, TestResult>>({});

  useEffect(() => {
    if (user) {
      if (view === 'QUIZ') {
        fetchTestAndprogress();
      } else {
        fetchAllTestsAndResults();
      }
    }
  }, [testId, user, view]);

  const fetchAllTestsAndResults = async () => {
    try {
      setLoading(true);
      const { data: testData } = await supabase.from('behavioral_tests').select('*').order('title');
      const { data: resData } = await supabase.from('candidate_test_results').select('*').eq('user_id', user!.id);

      const resultsMap: Record<string, TestResult> = {};
      resData?.forEach(res => {
        if (res.test_id && res.scores && Object.keys(res.scores as object).length > 0) {
          resultsMap[res.test_id] = res;
        }
      });

      setAllTests(testData || []);
      setAllResults(resultsMap);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestAndprogress = async () => {
    try {
      setLoading(true);
      let currentId = testId;

      if (!currentId) {
        const { data: defaultTest } = await supabase
          .from('behavioral_tests')
          .select('id')
          .eq('title', 'Mapeamento de Perfil Comportamental (Big Five)')
          .single();
        currentId = defaultTest?.id || (await supabase.from('behavioral_tests').select('id').limit(1).single()).data?.id;
      }

      if (!currentId) throw new Error('Nenhum teste encontrado.');
      setActiveTestId(currentId);

      // Fetch Info & Questions
      const [testRes, qRes, progressRes] = await Promise.all([
        supabase.from('behavioral_tests').select('*').eq('id', currentId).single(),
        supabase.from('test_questions').select('*').eq('test_id', currentId).order('order_index'),
        supabase.from('candidate_test_results').select('*').eq('test_id', currentId).eq('user_id', user!.id).maybeSingle()
      ]);

      if (testRes.data) setTestTitle(testRes.data.title);
      if (qRes.data) setQuestions(qRes.data);
      
      if (progressRes.data) {
        setResultId(progressRes.data.id);
        if (progressRes.data.responses) setResponses(progressRes.data.responses as Record<string, number>);
      } else {
        const { data: newRes } = await supabase.from('candidate_test_results').insert({
          test_id: currentId, user_id: user!.id, responses: {}, scores: {}
        }).select().single();
        if (newRes) setResultId(newRes.id);
      }
    } catch (error) {
      console.error(error);
      setView('LIST');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId: string, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleContinue = async () => {
    if (!resultId) return;
    await supabase.from('candidate_test_results').update({ responses: responses, updated_at: new Date().toISOString() }).eq('id', resultId);

    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    if (page < totalPages - 1) {
      setPage(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      calculateAndFinish();
    }
  };

  const calculateAndFinish = async () => {
    try {
      if (!activeTestId || !resultId) return;
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tests/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ testId: activeTestId, responses })
      });
      if (!response.ok) throw new Error('Erro ao calcular');
      setSuccessModalOpen(true);
    } catch (error) {
      console.error(error);
      alert('Houve um erro ao processar seus resultados.');
    }
  };

  const handleBack = () => {
    if (view === 'QUIZ') {
      if (page > 0) {
        setPage(prev => prev - 1);
        window.scrollTo(0, 0);
      } else {
        setView('LIST');
        navigate('/app/behavioral-test');
      }
    } else {
      navigate('/app/dashboard');
    }
  };

  const progressPercentage = Math.round((Object.keys(responses).length / (questions.length || 1)) * 100);
  const currentQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);

  const formatTitle = (title: string) => {
    if (!title) return '';
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-gray-400 animate-pulse text-sm">Carregando...</div>;

  const completedTests = allTests.filter(t => !!allResults[t.id]);

  return (
    <div className="flex-1 font-sans flex flex-col">
      <main className="flex-1 max-w-[1480px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        
        {view === 'LIST' ? (
          <div className="animate-in fade-in duration-500">
            {/* Header List */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Avaliações comportamentais</h1>
                <p className="text-gray-400 font-bold text-base">Gerencie seus testes e visualize seu desempenho profissional.</p>
              </div>
              <button 
                onClick={() => setView('QUIZ')}
                className="flex items-center gap-3 px-6 py-3 bg-[#F04E23] text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-orange-100 text-sm"
              >
                <Plus size={18} strokeWidth={3} /> Novo teste
              </button>
            </div>

            {/* Results Grid */}
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 md:p-12 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black border border-blue-100">
                        {completedTests.length} {completedTests.length === 1 ? 'concluído' : 'concluídos'}
                    </div>
                </div>

                {completedTests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {completedTests.map(test => {
                            const result = allResults[test.id];
                            const scoreValues = Object.values(result.scores as Record<string, number> || {});
                            const avg = scoreValues.length > 0 ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length) : 0;

                            return (
                                <div
                                    key={test.id}
                                    className="group relative border border-gray-100 bg-white rounded-3xl p-10 cursor-pointer hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300"
                                    onClick={() => navigate(`/app/behavioral-result/${result.id}`)}
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-50 group-hover:scale-110 transition-transform">
                                            <PieChart size={28} />
                                        </div>
                                        <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black">Verificado</div>
                                    </div>

                                    <h3 className="font-black text-gray-900 text-lg mb-2 leading-tight group-hover:text-blue-600 transition-colors truncate">{formatTitle(test.title)}</h3>
                                    
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-10">
                                        <FileText size={14} />
                                        <span>PDF de resultado • {new Date(result.completed_at || Date.now()).toLocaleDateString('pt-BR')}</span>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-50 pt-8 mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400">Aderência global</span>
                                            <span className="text-2xl font-black text-gray-900">{avg}%</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <ArrowUpRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            );
                         })}
                    </div>
                ) : (
                    <div className="text-center py-20 px-6">
                         <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Info className="text-gray-300" size={32} />
                         </div>
                         <h3 className="text-xl font-black text-gray-900">Nenhum teste realizado</h3>
                         <p className="text-gray-400 font-bold max-w-sm mx-auto mt-2 text-sm">Inicie sua jornada profissional realizando seu primeiro teste de mapeamento comportamental.</p>
                         <button onClick={() => setView('QUIZ')} className="mt-8 px-8 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-[#F04E23] transition-all shadow-2xl shadow-gray-200 text-xs tracking-tight">Realizar primeiro teste</button>
                    </div>
                )}
            </div>

          </div>
        ) : (
          /* Quiz View */
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <button key="back-btn" onClick={handleBack} className="flex items-center gap-2 text-gray-800 font-black mb-8 hover:text-[#F04E23] transition-colors text-xs">
              <ChevronLeft size={18} strokeWidth={3} /> Sair do teste
            </button>

            <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-6 md:p-16 relative">
              <div className="flex flex-col-reverse md:flex-row justify-between items-start mb-12 gap-8">
                <div className="max-w-[700px]">
                  <h1 className="text-xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">{formatTitle(testTitle)}</h1>
                  <p className="text-gray-400 font-bold text-base leading-relaxed">
                    Responda as perguntas abaixo da maneira mais sincera possível. Não existem respostas certas ou erradas, apenas o seu perfil.
                  </p>
                </div>

                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="48" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                    <circle
                      cx="56" cy="56" r="48" stroke="#5AB7F7" strokeWidth="8" fill="none"
                      strokeDasharray="301.59"
                      strokeDashoffset={301.59 - (301.59 * progressPercentage / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-gray-900 leading-none">{progressPercentage}%</span>
                    <span className="text-[10px] font-black text-gray-400 mt-1">Progresso</span>
                  </div>
                </div>
              </div>

              <div className="space-y-16">
                {currentQuestions.map((q, i) => (
                  <div key={q.id}>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-8 leading-tight">{q.question_text}</h3>
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center w-full bg-gray-50/50 p-8 rounded-3xl border border-gray-50">
                      <TestOption label="Discordo totalmente" value={1} isSelected={responses[q.id] === 1} onChange={() => handleOptionChange(q.id, 1)} />
                      <TestOption label="Discordo" value={2} isSelected={responses[q.id] === 2} onChange={() => handleOptionChange(q.id, 2)} />
                      <TestOption label="Neutro" value={3} isSelected={responses[q.id] === 3} onChange={() => handleOptionChange(q.id, 3)} />
                      <TestOption label="Concordo" value={4} isSelected={responses[q.id] === 4} onChange={() => handleOptionChange(q.id, 4)} />
                      <TestOption label="Concordo totalmente" value={5} isSelected={responses[q.id] === 5} onChange={() => handleOptionChange(q.id, 5)} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 mt-20">
                <button onClick={handleBack} className="w-full md:w-auto px-16 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all text-sm">
                  Voltar
                </button>
                <button onClick={handleContinue} className="w-full md:w-auto px-16 py-5 bg-[#F04E23] text-white font-black rounded-2xl hover:bg-[#E03E13] transition-all shadow-xl shadow-orange-100 text-sm">
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <TestSuccessModal isOpen={successModalOpen} onClose={() => { setSuccessModalOpen(false); setView('LIST'); }} />
    </div>
  );
};

const TestOption: React.FC<{ label: string, value: number, isSelected: boolean, onChange: () => void }> = ({ label, value, isSelected, onChange }) => (
  <label className="flex items-center gap-4 cursor-pointer group">
    <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all ${isSelected ? 'border-[#F04E23] bg-[#F04E23]' : 'border-gray-200 bg-white group-hover:border-[#F04E23]/30'}`}>
        {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
    </div>
    <input type="radio" checked={isSelected} onChange={onChange} className="hidden" />
    <span className={`font-black text-sm tracking-tight transition-colors ${isSelected ? 'text-[#F04E23]' : 'text-gray-500 group-hover:text-gray-900'}`}>
      {label}
    </span>
  </label>
);

export default BehavioralTestPage;
