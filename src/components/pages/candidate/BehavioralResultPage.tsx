import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/Icons';
import {
  Bell, FileText, ChevronLeft, Trophy
} from 'lucide-react';

const traits = [
  {
    title: "Confiança",
    description: "Pessoas com alta confiança tendem a delegar com mais facilidade e trabalhar bem em equipe, mas podem ser mais vulneráveis a decepções se não forem cautelosas.",
    percent: 40
  },
  {
    title: "Fraqueza",
    description: "A franqueza contribui para uma comunicação clara e assertiva, sendo muito valorizada em ambientes que prezam pela objetividade e integridade.",
    percent: 80
  },
  {
    title: "Altruísmo",
    description: "Pessoas altruístas fortalecem o clima organizacional, contribuindo para ambientes colaborativos e empáticos.",
    percent: 100
  },
  {
    title: "Complacência",
    description: "Um bom nível de complacência favorece a harmonia no time, mas níveis muito altos podem dificultar o enfrentamento de situações que exigem firmeza.",
    percent: 20
  },
  {
    title: "Modestia",
    description: "Pessoas modestas geralmente são bem-vistas em equipes colaborativas, pois valorizam o coletivo mais do que o ego. No entanto, é importante equilibrar para que essa característica não impeça o reconhecimento merecido de suas habilidades e resultados.",
    percent: 0
  },
  {
    title: "Empatia",
    description: "A empatia é fundamental para o trabalho em equipe, liderança e resolução de conflitos. Profissionais empáticos constroem relacionamentos saudáveis e contribuem para ambientes mais humanos e cooperativos.",
    percent: 60
  }
];

const BehavioralResultPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
        <button onClick={() => navigate('/app/profile')} className="flex items-center gap-2 text-gray-800 font-black mb-10 hover:text-[#F04E23] transition-colors">
          <ChevronLeft size={20} strokeWidth={3} /> Voltar
        </button>

        <div className="bg-white border border-gray-100 rounded-[40px] shadow-sm p-12 md:p-20">
          {/* Result Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 pb-12 border-b border-gray-100">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-gray-50">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" alt="José" className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 leading-none">José de Alencar</h1>
                <p className="text-gray-500 font-bold text-lg mt-2">Gerente de projetos</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-600 font-bold text-xl mb-3">Pontuação geral: <span className="font-black text-gray-900">100% de aderência</span></p>
              <div className="flex items-center gap-3">
                <div className="h-3 flex gap-1 w-[300px]">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex-1 bg-[#5AB7F7] rounded-full"></div>
                  ))}
                </div>
                <div className="w-10 h-10 rounded-full bg-[#5AB7F7] flex items-center justify-center text-white shadow-lg">
                  <Trophy size={18} strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Teste comportamental 1</h2>
            <p className="text-gray-400 font-bold">Mostre aos recrutadores seu nível profissional nos testes.</p>
          </div>

          {/* Traits List (Image 3) */}
          <div className="space-y-12">
            {traits.map((trait, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-gray-900">{trait.title}</h3>
                  <span className="text-xl font-black text-gray-900">{trait.percent}%</span>
                </div>
                <p className="text-gray-500 font-medium text-lg mb-6 leading-relaxed max-w-[1000px]">
                  {trait.description}
                </p>
                <div className="h-4 flex gap-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                  {[20, 40, 60, 80, 100].map(step => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-all duration-1000 ${step <= trait.percent ? 'bg-[#5AB7F7]' : 'bg-gray-100'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full py-10 px-12 border-t border-gray-100 bg-white text-[13px] text-gray-400 font-bold flex flex-col md:flex-row items-center justify-between">
        <p>©atua vaga. Todos os direitos reservados.</p>
        <div className="flex items-center gap-10 mt-6 md:mt-0">
          <a href="#" className="hover:text-gray-900 transition-colors">Termos e Condições de Uso</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-gray-900 transition-colors">Ajuda</a>
        </div>
      </footer>
    </div>
  );
};

export default BehavioralResultPage;
