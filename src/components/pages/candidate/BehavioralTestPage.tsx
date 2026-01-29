import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import TestSuccessModal from './TestSuccessModal';
import { Database } from '@/types/supabase';

type Question = Database['public']['Tables']['test_questions']['Row'];

const QUESTIONS_PER_PAGE = 5;

const BehavioralTestPage: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [testTitle, setTestTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [page, setPage] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  useEffect(() => {
    if (testId && user) {
      fetchTestAndprogress();
    }
  }, [testId, user]);

  const fetchTestAndprogress = async () => {
    try {
      // Fetch Test Info
      const { data: testData, error: testError } = await supabase
        .from('behavioral_tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (testError) throw testError;
      setTestTitle(testData.title);

      // Fetch Questions
      const { data: qData, error: qError } = await supabase
        .from('test_questions')
        .select('*')
        .eq('test_id', testId)
        .order('order_index');

      if (qError) throw qError;
      setQuestions(qData || []);

      // Fetch Existing Progress
      const { data: resData } = await supabase
        .from('candidate_test_results')
        .select('*')
        .eq('test_id', testId)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (resData) {
        setResultId(resData.id);
        if (resData.responses) {
          setResponses(resData.responses as Record<string, number>);
          // Calculate starting page based on answered questions?
          // For now, start at 0 is fine, or maybe find first unanswered.
          // Let's stick to 0 for simplicity unless we want to jump.
        }
      } else {
        // Create skeleton result
        const { data: newRes } = await supabase
          .from('candidate_test_results')
          .insert({
            test_id: testId,
            user_id: user!.id,
            responses: {},
            scores: {}
          })
          .select()
          .single();
        if (newRes) setResultId(newRes.id);
      }

    } catch (error) {
      console.error('Error fetching test:', error);
      alert('Erro ao carregar teste.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId: string, value: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Auto-save logic could go here (debounced)
  };

  const saveProgress = async () => {
    if (!resultId) return;

    await supabase
      .from('candidate_test_results')
      .update({
        responses: responses,
        updated_at: new Date().toISOString() // Assuming I should add this column or just relies on checking
      })
      .eq('id', resultId);
  };

  const handleContinue = async () => {
    await saveProgress();

    const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
    if (page < totalPages - 1) {
      setPage(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Finish
      calculateAndFinish();
    }
  };

  const calculateAndFinish = async () => {
    // Here we would implement scoring logic based on categories.
    // For now, I'll just save and show success.
    // Mock scoring: Random or simple sum
    const scores: Record<string, number> = {
      'Confiança': 80,
      'Fraqueza': 20,
      'Altruísmo': 90
    };

    if (resultId) {
      await supabase
        .from('candidate_test_results')
        .update({
          responses: responses,
          scores: scores,
          completed_at: new Date().toISOString()
        })
        .eq('id', resultId);
    }

    setSuccessModalOpen(true);
  };

  const handleBack = () => {
    if (page > 0) {
      setPage(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/app/professional-registration'); // Or wherever
    }
  };

  const progressPercentage = Math.round((Object.keys(responses).length / (questions.length || 1)) * 100);

  const currentQuestions = questions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
        <button onClick={() => navigate('/app/professional-registration')} className="flex items-center gap-2 text-gray-800 font-black mb-10 hover:text-[#F04E23] transition-colors">
          <ChevronLeft size={20} strokeWidth={3} /> Voltar
        </button>

        <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-12 md:p-20 relative">
          {/* Header & Progress Indicator */}
          <div className="flex justify-between items-start mb-16">
            <div className="max-w-[700px]">
              <h1 className="text-4xl font-black text-gray-900 mb-6">{testTitle}</h1>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">
                Responda as perguntas abaixo para obter o seu resultado. Caso não tenha tempo para
                responder todas as perguntas, não se preocupe! Todas as respostas são salvas
                automaticamente, possibilitando que você realize o teste em etapas.
              </p>
            </div>

            {/* Circular Progress */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                <circle
                  cx="56" cy="56" r="48" stroke="#5AB7F7" strokeWidth="8" fill="none"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 - (301.59 * progressPercentage / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900 leading-none">{progressPercentage}%</span>
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Concluído</span>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            {currentQuestions.map((q, i) => (
              <div key={q.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <h3 className="text-xl font-bold text-gray-900 mb-8 leading-tight">{q.question_text}</h3>
                <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center w-full px-4">
                  <TestOption
                    label="Discordo totalmente"
                    value={1}
                    isSelected={responses[q.id] === 1}
                    onChange={() => handleOptionChange(q.id, 1)}
                  />
                  <TestOption
                    label="Discordo parcialmente"
                    value={2}
                    isSelected={responses[q.id] === 2}
                    onChange={() => handleOptionChange(q.id, 2)}
                  />
                  <TestOption
                    label="Neutro"
                    value={3}
                    isSelected={responses[q.id] === 3}
                    onChange={() => handleOptionChange(q.id, 3)}
                  />
                  <TestOption
                    label="Concordo parcialmente"
                    value={4}
                    isSelected={responses[q.id] === 4}
                    onChange={() => handleOptionChange(q.id, 4)}
                  />
                  <TestOption
                    label="Concordo totalmente"
                    value={5}
                    isSelected={responses[q.id] === 5}
                    onChange={() => handleOptionChange(q.id, 5)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-20">
            <button onClick={handleBack} className="px-20 py-4 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all text-lg">
              Voltar
            </button>
            <button onClick={handleContinue} className="px-20 py-4 bg-[#F04E23] text-white font-black rounded-2xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-100 text-lg">
              Continuar
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full py-10 px-12 border-t border-gray-100 bg-white text-[13px] text-gray-400 font-bold flex flex-col md:flex-row items-center justify-between shrink-0">
        <p>©atua vaga. Todos os direitos reservados.</p>
        <div className="flex items-center gap-10 mt-6 md:mt-0">
          <a href="#" className="hover:text-gray-900 transition-colors">Termos e Condições de Uso</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Ajuda</a>
        </div>
      </footer>

      <TestSuccessModal isOpen={successModalOpen} onClose={() => setSuccessModalOpen(false)} />
    </div>
  );
};

const TestOption: React.FC<{ label: string, value: number, isSelected: boolean, onChange: () => void }> = ({ label, value, isSelected, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input
      type="radio"
      checked={isSelected}
      onChange={onChange}
      className="w-7 h-7 border-2 border-gray-200 accent-[#F04E23] focus:ring-[#F04E23]"
    />
    <span className={`font-bold text-[15px] transition-colors ${isSelected ? 'text-[#F04E23]' : 'text-gray-600 group-hover:text-[#F04E23]'}`}>
      {label}
    </span>
  </label>
);

export default BehavioralTestPage;
