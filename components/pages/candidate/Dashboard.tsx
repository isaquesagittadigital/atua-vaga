import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/Icons';
import {
  Bell, FileText, Search, MapPin,
  Briefcase, ChevronRight, Trophy, ArrowUpRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const suggestedJobs = [
    { title: 'Analista de Marketing Digital', company: 'Digital Marketing Experts S/A', location: 'Remoto', match: '90%' },
    { title: 'Pessoa Recursos Humanos', company: 'Digital Marketing Experts S/A', location: 'Remoto', match: '70%' },
    { title: 'Gerente de Projetos', company: 'Digital Marketing Experts S/A', location: 'Remoto', match: '20%' },
  ];

  const JobRow: React.FC<{ title: string, company: string, match: string, onSelect: () => void }> = ({ title, company, match, onSelect }) => (
    <div
      onClick={onSelect}
      className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[24px] transition-all border border-transparent hover:border-gray-100 cursor-pointer group"
    >
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center font-black text-[#1D4ED8]">
          {title.charAt(0)}
        </div>
        <div>
          <h4 className="font-black text-gray-900 text-lg group-hover:text-[#1D4ED8] transition-colors">
            {title}
            <span className="ml-3 bg-orange-50 text-[#F04E23] text-[11px] px-3 py-1 rounded-full border border-orange-100">{match} match</span>
          </h4>
          <p className="text-gray-400 font-bold text-sm mt-0.5">{company} • Remoto</p>
        </div>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 group-hover:text-[#F04E23] group-hover:bg-orange-50 transition-all">
        <ChevronRight size={22} />
      </div>
    </div>
  );

  return (
    <div className="max-w-[1400px] w-full mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Left */}
        <aside className="w-full lg:w-[320px] xl:w-[360px] space-y-6">
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-50 text-center cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/app/profile')}>
            <div className="w-24 h-24 rounded-3xl overflow-hidden mb-6 border-4 border-[#F8FAFC] mx-auto">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-full h-full object-cover grayscale" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 leading-none">José de Alencar</h3>
            <p className="text-gray-500 font-bold mt-2 text-[15px]">Gerente de projetos</p>
            <p className="text-gray-400 text-sm mt-0.5 font-bold">São Paulo, SP</p>

            <div className="mt-8 bg-[#F0F7FF] rounded-2xl p-5 text-left space-y-4">
              <p className="text-[13px] font-black text-[#1D4ED8]">100 produtoras buscaram profissionais da sua área</p>
              <p className="text-[13px] font-black text-[#1D4ED8]">200 visitas ao seu perfil</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-50">
            <h4 className="font-bold text-gray-700 mb-6 text-[15px]">Progresso do perfil: <span className="font-black text-gray-900">100% concluído</span></h4>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-3.5 flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex-1 bg-[#5AB7F7] rounded-full"></div>
                ))}
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#5AB7F7] bg-white flex items-center justify-center text-[#5AB7F7] shadow-lg shadow-blue-50">
                <Trophy size={18} strokeWidth={3} />
              </div>
            </div>
            <div className="bg-[#F8FAFC] rounded-[24px] p-8">
              <h5 className="font-black text-gray-900 text-[17px] mb-3 leading-tight">Melhore seu perfil agora!</h5>
              <p className="text-gray-500 text-[14px] leading-relaxed mb-8 font-medium">Mais de 300 buscas foram feitas utilizando filtros de experiência profissional.</p>
              <button
                onClick={() => navigate('/app/professional-registration')}
                className="w-full py-4 bg-[#F04E23] text-white font-black rounded-2xl text-[14px] hover:bg-[#E03E13] transition-all shadow-xl shadow-orange-100"
              >
                Completar cadastro
              </button>
            </div>
          </div>

          {/* Test Results Card */}
          <button
            onClick={() => navigate('/app/behavioral-test')}
            className="w-full bg-white rounded-[24px] p-8 shadow-sm border border-gray-50 flex items-center justify-between group hover:border-[#F04E23] transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="p-3 bg-orange-50 text-[#F04E23] rounded-2xl">
                <FileText size={24} />
              </div>
              <span className="font-black text-gray-800 text-[15px]">Fazer teste comportamental</span>
            </div>
            <ArrowUpRight size={22} className="text-[#F04E23] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </button>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 space-y-10">
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-50">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-black text-gray-900">Recomendadas para você</h2>
              <button onClick={() => navigate('/app/jobs')} className="text-gray-400 font-bold hover:text-[#F04E23] transition-colors flex items-center gap-1">Ver todas <ChevronRight size={18} /></button>
            </div>
            <div className="space-y-4">
              <JobRow title="Analista de Marketing Digital" company="Digital Marketing Experts" match="87%" onSelect={() => navigate('/app/jobs')} />
              <JobRow title="Especialista em RH" company="Talent Management" match="87%" onSelect={() => navigate('/app/jobs')} />
              <JobRow title="Gerente de Projetos" company="Inova Tech S.A" match="95%" onSelect={() => navigate('/app/jobs')} />
            </div>
          </div>

          <div className="bg-[#1D4ED8] rounded-[32px] p-12 text-white relative overflow-hidden group">
            <div className="relative z-10 max-w-[400px]">
              <h3 className="text-3xl font-black mb-4">Sua vaga ideal está a um clique de distância.</h3>
              <p className="text-blue-100 font-bold mb-8 opacity-80">Explore centenas de oportunidades personalizadas para o seu perfil profissional.</p>
              <button onClick={() => navigate('/app/jobs')} className="px-10 py-4 bg-white text-[#1D4ED8] font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20">Explorar vagas</button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
          </div>
        </section>
      </div>

      <footer className="w-full border-t border-gray-200 py-8 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-gray-500 font-medium">
          <p>©atua vaga. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <button className="hover:text-[#F04E23] transition-colors">Termos e Condições de Uso</button>
            <button className="hover:text-[#F04E23] transition-colors">Política de Privacidade</button>
            <button onClick={() => navigate('/app/faq')} className="hover:text-[#F04E23] transition-colors">Ajuda</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
