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
  const [canTakeNewTest, setCanTakeNewTest] = useState(true);
  const [nextAvailableDate, setNextAvailableDate] = useState<string | null>(null);

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
      let hasRecentTest = false;
      let latestExpiry: Date | null = null;
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      resData?.forEach(res => {
        if (res.test_id && res.scores && Object.keys(res.scores as object).length > 0) {
          resultsMap[res.test_id] = res;
          
          if (res.completed_at) {
            const completedDate = new Date(res.completed_at);
            if (completedDate > twelveMonthsAgo) {
              hasRecentTest = true;
              const expiry = new Date(completedDate);
              expiry.setMonth(expiry.getMonth() + 12);
              if (!latestExpiry || expiry > latestExpiry) latestExpiry = expiry;
            }
          }
        }
      });

      setAllTests(testData || []);
      setAllResults(resultsMap);
      setCanTakeNewTest(!hasRecentTest);
      if (hasRecentTest && latestExpiry) {
        setNextAvailableDate(latestExpiry.toLocaleDateString('pt-BR'));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestAndprogress = async () => {
    try {
      setLoading(true);

      // Check if user has a recent test that blocks new ones
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
      
      const { data: recentResults } = await supabase
        .from('candidate_test_results')
        .select('completed_at')
        .eq('user_id', user!.id)
        .not('completed_at', 'is', null);

      const hasRecent = recentResults?.some(r => r.completed_at && new Date(r.completed_at) > twelveMonthsAgo);
      
      if (hasRecent) {
        alert('Você possui um teste válido realizado nos últimos 12 meses. Novos testes não são permitidos no momento.');
        setView('LIST');
        navigate('/app/behavioral-test');
        return;
      }

      let currentId = testId;

      if (!currentId) {
        // Fallback: try to get any test
        const { data: anyTest } = await supabase.from('behavioral_tests').select('id').limit(1).maybeSingle();
        currentId = anyTest?.id;
      }
      
      if (!currentId) {
        throw new Error('Nenhum teste comportamental foi encontrado no banco de dados.');
      }
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
    } catch (error: any) {
      console.error('Erro detalhado no teste:', error);
      alert(`Erro ao iniciar o teste: ${error.message || 'Falha na conexão com o banco de dados'}. Verifique se as tabelas de teste estão populadas.`);
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
    // Removed updated_at as it might not exist in the database schema yet
    await supabase.from('candidate_test_results').update({ responses: responses }).eq('id', resultId);

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
      if (!activeTestId || !resultId || !user) return;
      setLoading(true);

      // 1. Fetch Question categories to map responses to variables
      const { data: questionsData, error: qError } = await supabase
        .from('test_questions')
        .select('id, category')
        .eq('test_id', activeTestId);

      if (qError) throw qError;

      const variables: Record<string, number> = {};
      questionsData?.forEach(q => {
        if (q.category) {
          variables[q.category] = responses[q.id] || 3;
        }
      });

      // 2. Formulas Implementation (Migrated from Backend)
      const scores: Record<string, number> = {};
      const v = (code: string) => variables[code] || 3;

      // --- AMABILIDADE ---
      scores['Confiança'] = (2 * v('A1') + (v('E1') + 2 * (v('E6') + v('A3')) + 2 * (6 - v('N1')) + 2 * (6 - v('A4')) + (6 - v('N4')))) / 60;
      scores['Franqueza'] = (2 * v('A2') + 2 * (v('C3') + v('A1') + v('A3')) + 2 * ((6 - v('A4')) + (6 - v('N2'))) + v('A2')) / 65;
      scores['Altruísmo'] = (2 * v('A3') + 2 * (v('A1') + v('E6') + v('A6')) + 2 * (v('N2') + v('E3')) + v('A5')) / 65;
      scores['Complacência'] = (2 * v('A4') + 2 * v('A6') + v('A1') + v('A2') + 2 * (6 - v('E3')) + 2 * (6 - v('N2')) + (6 - v('C3'))) / 55;
      scores['Modestia'] = (2 * v('A5') + 2 * (v('A6') + v('C3')) + v('A1') + 2 * (6 - v('E3')) + 2 * (6 - v('O1')) + v('N4')) / 60;
      scores['Sensibilidade'] = (2 * v('A6') + 2 * (v('A3') + v('E6')) + v('A4') + 2 * (6 - v('E3')) + 2 * (6 - v('N1')) + (6 - v('C3'))) / 60;

      // --- CONSCIENCIOSIDADE ---
      scores['Competência'] = (2 * v('C1') + 2 * v('C5') + v('E3') + v('O5') + 2 * (6 - v('N1')) + (6 - v('N6')) + (6 - v('N3'))) / 50;
      scores['Ordem'] = (2 * v('C2') + 2 * (v('C4') + v('C5')) + v('C6') + (6 - v('E5')) + (6 - v('N1')) + 2 * (6 - v('O5'))) / 55;
      scores['Senso de dever'] = (2 * v('C3') + 2 * (v('C1') + v('C5')) + v('A4') + (6 - v('O6')) + 2 * (6 - v('N6')) + 2 * (6 - v('N2'))) / 60;
      scores['Esforço por realizações'] = (2 * v('C4') + 2 * (v('C5') + v('C1')) + v('E3') + 2 * (6 - v('N6')) + 2 * (6 - v('N1')) + (6 - v('N2'))) / 60;
      scores['Autodisciplina'] = (2 * v('C5') + 2 * (v('C4') + v('E3')) + v('C1') + 2 * (6 - v('E5')) + (6 - v('N5'))) / 50;
      scores['Ponderação'] = (2 * v('C6') + 2 * (v('C5') + v('C1')) + v('C2') + 2 * (6 - v('N5')) + 2 * (6 - v('E5'))) / 55;

      // --- EXTROVERSÃO ---
      scores['Acolhimento'] = (2 * v('E1') + 2 * v('E2') + v('E3') + v('E4') + (6 - v('N4')) + (6 - v('N3')) + 2 * (6 - v('N2'))) / 50;
      scores['Gregarismo'] = (2 * v('E2') + 2 * (v('E1') + v('E3')) + v('E4') + (6 - v('N3')) + (6 - v('C2')) + 2 * (6 - v('N4'))) / 55;
      scores['Assertividade'] = (2 * v('E3') + 2 * (v('C1') + v('E4') + v('C5')) + 2 * ((6 - v('N1')) + (6 - v('N6')) + (6 - v('A4')))) / 70;
      scores['Atividade'] = (2 * v('E4') + v('E2') + v('E3') + v('O4') + 2 * (6 - v('N3')) + (6 - v('N1')) + (6 - v('N6'))) / 45;
      scores['Busca de sensações'] = (2 * v('E5') + 2 * (v('E6') + v('O4') + v('O2')) + 2 * ((6 - v('C6')) + (6 - v('N1')) + (6 - v('C2')))) / 70;
      scores['Emoções Positivas'] = (2 * v('E6') + 2 * (v('E1') + v('E3')) + v('A3') + (6 - v('N1')) + 2 * (6 - v('N3')) + 2 * (6 - v('N6'))) / 60;

      // --- NEUROTICISMO ---
      scores['Ansiedade'] = (2 * v('N1') + 2 * (v('N3') + v('N4')) + v('C5') + 2 * ((6 - v('C1')) + (6 - v('A1')) + (6 - v('E3')))) / 65;
      scores['Raiva'] = (2 * v('N2') + 2 * (v('E3') + v('N4')) + v('N3') + 2 * (6 - v('A1')) + 2 * (6 - v('A3'))) / 55;
      scores['Depressão'] = (2 * v('N3') + 2 * (v('N1') + v('N6')) + v('O3') + 2 * (6 - v('E6')) + 2 * (6 - v('E4')) + (6 - v('C1'))) / 60;
      scores['Embaraço'] = (2 * v('N4') + 2 * (v('A5') + v('N3') + v('N1')) + 2 * (6 - v('E3')) + 2 * (6 - v('A1')) + (6 - v('E2'))) / 65;
      scores['Impulsividade'] = (2 * v('N5') + 2 * (v('E5') + v('N1')) + v('O4') + 2 * (6 - v('C5')) + 2 * (6 - v('C1')) + (6 - v('C3'))) / 60;
      scores['Vulnerabilidade'] = (2 * v('N6') + 2 * (v('N1') + v('N3')) + v('O3') + 2 * ((6 - v('C1')) + (6 - v('E3')) + (6 - v('A2')))) / 65;

      // --- ABERTURA ---
      scores['Fantasia'] = (2 * v('O1') + 2 * v('O5') + v('E5') + v('O2') + 2 * ((6 - v('C6')) + (6 - v('C5')) + (6 - v('C2')))) / 60;
      scores['Estética'] = (2 * v('O2') + 2 * v('O1') + v('O5') + v('O3') + 2 * (6 - v('C5')) + (6 - v('C2')) + (6 - v('E3'))) / 55;
      scores['Sentimentos'] = (2 * v('O3') + 2 * (v('O1') + v('N1')) + v('E6') + 2 * (6 - v('E3')) + (6 - v('C2')) + (6 - v('C5'))) / 55;
      scores['Ações Variadas'] = (2 * v('O4') + 2 * (v('O1') + v('E5')) + v('O6') + (6 - v('C6')) + 2 * (6 - v('C2')) + 2 * (6 - v('C5'))) / 60;
      scores['Ideias'] = (2 * v('O5') + 2 * (v('O1') + v('O2')) + v('O6') + 2 * (6 - v('C2')) + 2 * (6 - v('C5')) + (6 - v('N1'))) / 60;
      scores['Valores'] = (2 * v('O6') + 2 * (v('O1') + v('O5')) + v('A1') + (6 - v('C3')) + 2 * (6 - v('A4')) + 2 * (6 - v('C2'))) / 60;

      // Normalize and Round
      const normalizedScores: Record<string, number> = {};
      Object.entries(scores).forEach(([key, val]) => {
        normalizedScores[key] = Math.max(0, Math.min(100, Math.round(val * 100)));
      });

      // 3. Save to Supabase
      const { error: updateError } = await supabase
        .from('candidate_test_results')
        .update({
          responses: responses,
          scores: normalizedScores,
          completed_at: new Date().toISOString()
        })
        .eq('id', resultId);

      if (updateError) throw updateError;

      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Calculation Error:', error);
      alert('Houve um erro ao processar seus resultados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
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

  const allQuestionsOnPageAnswered = currentQuestions.every(q => !!responses[q.id]);

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
                {!canTakeNewTest && nextAvailableDate && (
                  <p className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black border border-orange-100">
                    <ClipboardCheck size={12} /> Próxima avaliação disponível em: {nextAvailableDate}
                  </p>
                )}
              </div>
              {canTakeNewTest && (
                <button 
                  onClick={() => setView('QUIZ')}
                  className="flex items-center gap-3 px-6 py-3 bg-[#F04E23] text-white font-black rounded-xl hover:scale-105 transition-all shadow-lg shadow-orange-100 text-sm"
                >
                  <Plus size={18} strokeWidth={3} /> Novo teste
                </button>
              )}
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

            <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-6 md:p-12 relative">
              <div className="flex flex-col-reverse md:flex-row justify-between items-start mb-10 gap-8">
                <div className="max-w-[700px]">
                  <h1 className="text-lg md:text-2xl font-black text-gray-900 mb-3 tracking-tight">{formatTitle(testTitle)}</h1>
                  <p className="text-gray-400 font-bold text-sm leading-relaxed">
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

              <div className="space-y-12">
                {currentQuestions.map((q, i) => (
                  <div key={q.id}>
                    <h3 className="text-base md:text-lg font-black text-gray-900 mb-6 leading-tight">{q.question_text}</h3>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center w-full bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                      <TestOption label="Discordo totalmente" value={1} isSelected={responses[q.id] === 1} onChange={() => handleOptionChange(q.id, 1)} />
                      <TestOption label="Discordo" value={2} isSelected={responses[q.id] === 2} onChange={() => handleOptionChange(q.id, 2)} />
                      <TestOption label="Neutro" value={3} isSelected={responses[q.id] === 3} onChange={() => handleOptionChange(q.id, 3)} />
                      <TestOption label="Concordo" value={4} isSelected={responses[q.id] === 4} onChange={() => handleOptionChange(q.id, 4)} />
                      <TestOption label="Concordo totalmente" value={5} isSelected={responses[q.id] === 5} onChange={() => handleOptionChange(q.id, 5)} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 mt-16">
                <button onClick={handleBack} className="w-full md:w-auto px-12 py-4 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all text-sm">
                  Voltar
                </button>
                <button 
                  onClick={() => allQuestionsOnPageAnswered && handleContinue()} 
                  disabled={!allQuestionsOnPageAnswered}
                  className={`w-full md:w-auto px-12 py-4 font-black rounded-2xl transition-all shadow-xl text-sm ${
                    allQuestionsOnPageAnswered 
                      ? 'bg-[#F04E23] text-white hover:bg-[#E03E13] shadow-orange-100' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
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
    <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-all ${isSelected ? 'border-[#F04E23] bg-[#F04E23]' : 'border-gray-200 bg-white group-hover:border-[#F04E23]/30'}`}>
        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
    </div>
    <input type="radio" checked={isSelected} onChange={onChange} className="hidden" />
    <span className={`font-black text-xs tracking-tight transition-colors ${isSelected ? 'text-[#F04E23]' : 'text-gray-500 group-hover:text-gray-900'}`}>
      {label}
    </span>
  </label>
);

export default BehavioralTestPage;
