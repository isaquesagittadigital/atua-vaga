import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/Icons';
import {
  Bell, FileText, ChevronLeft, Check
} from 'lucide-react';

const questions = [
  "Nossos colaboradores têm autonomia e responsabilidades sobre as demandas diárias.",
  "Acreditamos nas intenções e ações dos funcionários para a tomada de decisões",
  "Interagimos de forma clara e direta com nossos colaboradores e clientes.",
  "Somos abertos e transparente em nossas comunicações e decisões.",
  "Nossa empresa promove ações sociais com frequência.",
  "Sempre ajudamos a quem precisa, mesmo quando não nos é conveniente.",
  "Todos os colaboradores são encorajados a ajudar e apoiar os colegas de trabalho.",
  "Os funcionários são encorajados a ser gentis e solidários uns com os outros.",
  "A empresa tem uma cultura de reconhecer e valorizar as contribuições de todos os membros da equipe.",
  "Preferimos ser discretos e deixar o trabalho e a qualidade dos nosso produtos falarem por si.",
  "Sempre estamos abertos a ouvir e resolver as preocupações dos nossos funcionários e clientes"
];

const BehavioralTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0); // 0, 20, 40, 60, 80
  const [showSuccess, setShowSuccess] = useState(false);

  const handleContinue = () => {
    if (progress < 80) setProgress(progress + 20);
    else setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
        <button onClick={() => navigate('/app/dashboard')} className="flex items-center gap-2 text-gray-800 font-black mb-10 hover:text-[#F04E23] transition-colors">
          <ChevronLeft size={20} strokeWidth={3} /> Voltar
        </button>

        <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-12 md:p-20 relative">
          {/* Header & Progress Indicator */}
          <div className="flex justify-between items-start mb-16">
            <div className="max-w-[700px]">
              <h1 className="text-4xl font-black text-gray-900 mb-6">Teste comportamental</h1>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">
                Responda as perguntas abaixo para obter o seu resultado. Caso não tenha tempo para
                responder todas as 60 perguntas, não se preocupe! Todas as respostas são salvas
                automaticamente, possibilitando que você realize o teste em etapas.
              </p>
            </div>

            {/* Circular Progress (Image 10 style) */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" r="48" stroke="#F1F5F9" strokeWidth="8" fill="none" />
                <circle
                  cx="56" cy="56" r="48" stroke="#5AB7F7" strokeWidth="8" fill="none"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 - (301.59 * progress / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900 leading-none">{progress}%</span>
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Concluído</span>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            {questions.slice(0, 11).map((q, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <h3 className="text-xl font-bold text-gray-900 mb-8 leading-tight">{q}</h3>
                <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center w-full px-4">
                  <TestOption label="Discordo totalmente" name={`q${i}`} />
                  <TestOption label="Discordo parcialmente" name={`q${i}`} />
                  <TestOption label="Neutro" name={`q${i}`} />
                  <TestOption label="Concordo parcialmente" name={`q${i}`} />
                  <TestOption label="Concordo totalmente" name={`q${i}`} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-20">
            <button onClick={() => setProgress(Math.max(0, progress - 20))} className="px-20 py-4 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all text-lg">
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

      {/* Success Modal (Image 5 style) */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[500px] rounded-[48px] overflow-hidden shadow-2xl p-16 text-center animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-[#EBFBF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-10">
              <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white">
                <Check size={40} strokeWidth={4} />
              </div>
            </div>

            <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight leading-none">Teste concluído</h3>
            <p className="text-gray-500 text-lg leading-relaxed mb-12 px-4 font-bold">
              Volte para página inicial e aplique para as vagas mais alinhadas ao seu perfil.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/app/jobs')}
                className="w-full py-5 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-100 text-xl"
              >
                Ir para Vagas
              </button>
              <button
                onClick={() => navigate('/app/dashboard')}
                className="w-full py-4 text-gray-500 font-black text-xl hover:text-gray-900 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TestOption: React.FC<{ label: string, name: string }> = ({ label, name }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <input type="radio" name={name} className="w-7 h-7 border-2 border-gray-200 accent-[#F04E23] focus:ring-[#F04E23]" />
    <span className="text-gray-600 font-bold text-[15px] group-hover:text-[#F04E23] transition-colors">{label}</span>
  </label>
);

export default BehavioralTestPage;
