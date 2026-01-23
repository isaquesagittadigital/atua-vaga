import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/Icons';
import {
  Bell, FileText, ChevronRight, X, MapPin,
  DollarSign, Clock, Briefcase, Calendar, Info,
  ChevronLeft, HelpCircle
} from 'lucide-react';

const MyJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'competition'>('details');

  const fullJobs = [
    {
      id: 1,
      title: 'Analista de Marketing Digital',
      company: 'Digital Marketing Experts S/A',
      match: '90%',
      date: '1 dia atrás',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      title: 'Pessoa Recursos Humanos',
      company: 'Digital Marketing Experts S/A',
      match: '70%',
      date: '1 dia atrás',
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 5,
      title: 'Gerente de Projetos',
      company: 'Digital Marketing Experts S/A',
      match: '20%',
      date: '1 dia atrás',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-12">
        {!selectedJob ? (
          /* List View (Imagem 3) */
          <div className="animate-in fade-in duration-500">
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Minhas vagas</h1>
            <p className="text-gray-400 font-bold mb-10">Vagas que você se candidatou.</p>

            <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-100">
                {fullJobs.map((job) => (
                  <div key={job.id} className="p-8 flex items-center justify-between group hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 ${job.bgColor} rounded-2xl flex items-center justify-center font-black text-xl ${job.iconColor}`}>
                        {job.title.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-4">
                          <h3 className="text-xl font-black text-[#1D4ED8]">{job.title}</h3>
                          <span className="bg-[#EBF5FF] text-[#1D4ED8] text-[11px] font-black uppercase px-3 py-1 rounded-full border border-blue-100">
                            {job.match} de aderência
                          </span>
                        </div>
                        <p className="text-gray-400 font-bold mt-1">{job.company} • Remoto</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <p className="text-gray-400 font-bold text-sm">A média de % para essa vaga é de 90%</p>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="text-[#F04E23] font-black hover:underline underline-offset-8 decoration-2"
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Detailed Split View (Imagens 4 e 5) */
          <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500">
            {/* Sidebar de Candidaturas */}
            <div className="w-full lg:w-[380px] space-y-4 shrink-0">
              <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-gray-800 font-black mb-6 hover:text-[#F04E23] transition-colors">
                <ChevronLeft size={20} strokeWidth={3} /> Voltar
              </button>
              {fullJobs.map(job => (
                <ApplicationCard
                  key={job.id}
                  job={job}
                  isActive={selectedJob.id === job.id}
                  onClick={() => setSelectedJob(job)}
                />
              ))}
            </div>

            {/* Painel Principal de Detalhes */}
            <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[850px]">
              {/* Header com Tooltip de Match */}
              <div className="p-10 border-b border-gray-100 relative bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-4xl font-black text-[#1D4ED8] mb-2 tracking-tight leading-tight">{selectedJob.title}</h2>
                    <p className="text-gray-500 font-bold text-lg">{selectedJob.company}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-10">
                      <JobInfoItem icon={<MapPin size={18} />} text="Remoto" />
                      <JobInfoItem icon={<DollarSign size={18} />} text="A combinar" color="text-[#F04E23]" />
                      <JobInfoItem icon={<Clock size={18} />} text="Período flexível" />
                      <JobInfoItem icon={<Briefcase size={18} />} text="CLT" />
                      <JobInfoItem icon={<Calendar size={18} />} text="1 dia atrás • 25/01/2025 encerra" />
                      <JobInfoItem icon={<MapPin size={18} />} text="Avenida da Estratégia, 456, Metrópole Digital" />
                    </div>
                  </div>

                  {/* Tooltip de Aderência Realista (Imagens 1 e 2) */}
                  <div className="w-[280px] shrink-0 hidden md:block">
                    <div className="bg-[#112D55] text-white rounded-[20px] p-6 shadow-2xl relative mb-8 animate-in zoom-in-95 duration-500">
                      <div className="space-y-4 text-[13px] font-bold">
                        <div className="flex justify-center text-center">
                          <span>95% de aderência à vaga</span>
                        </div>
                        <div className="flex justify-center text-center">
                          <span>70% de aderência técnica</span>
                        </div>
                        <div className="flex justify-center text-center">
                          <span>82% de aderência com a empresa</span>
                        </div>
                      </div>
                      <div className="mt-5 pt-4 border-t border-white/10">
                        <p className="text-[#FFD666] text-[13px] font-black text-center">87% de aderência média (soma total)</p>
                      </div>
                      {/* Triangle pointing to the help icon below */}
                      <div className="absolute -bottom-2 right-12 w-5 h-5 bg-[#112D55] rotate-45 rounded-sm"></div>
                    </div>

                    <div className="bg-white border-2 border-dashed border-purple-200 rounded-[20px] p-6 flex flex-col items-center group">
                      <div className="flex gap-4 mb-4">
                        <HelpCircle size={24} className="text-gray-400" />
                        <HelpCircle size={24} className="text-gray-900" />
                      </div>
                      <div className="w-16 h-12 flex items-center justify-center opacity-30 grayscale mb-3">
                        <Logo className="scale-[0.25]" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[#F04E23] font-black text-[13px]">
                        Match: {selectedJob.match} <Info size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-10">
                  <button className="px-12 py-4 bg-[#F04E23] text-white font-black rounded-2xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-100 text-lg">
                    Teste comportamental
                  </button>
                  <button className="text-[#F04E23] font-black text-lg px-6 py-4 hover:bg-orange-50 rounded-2xl transition-all">
                    Cancelar candidatura
                  </button>
                </div>
              </div>

              {/* Abas Detalhes / Concorrência */}
              <div className="flex border-b border-gray-100 px-10">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`py-6 px-8 font-black text-lg transition-all border-b-4 ${activeTab === 'details' ? 'border-[#F04E23] text-gray-900' : 'border-transparent text-gray-400'}`}
                >
                  Detalhes da vaga
                </button>
                <button
                  onClick={() => setActiveTab('competition')}
                  className={`py-6 px-8 font-black text-lg transition-all border-b-4 ${activeTab === 'competition' ? 'border-[#F04E23] text-gray-900' : 'border-transparent text-gray-400'}`}
                >
                  Concorrência
                </button>
              </div>

              {/* Conteúdo das Abas */}
              <div className="p-10 flex-1 overflow-y-auto">
                {activeTab === 'details' ? (
                  <div className="space-y-12 animate-in fade-in duration-300">
                    <section>
                      <h3 className="text-2xl font-black text-gray-900 mb-6">Descrição</h3>
                      <div className="text-gray-600 text-[17px] leading-relaxed space-y-4 font-medium">
                        <p>A Digital Marketing Experts S/A está em busca de um Analista de Marketing Digital apaixonado por estratégias online.</p>
                        <p>Nessa posição desafiadora, você terá a oportunidade de aplicar seus conhecimentos em SEO, SEM e gestão de campanhas nas redes sociais. Trabalhe de forma autônoma em um ambiente flexível, moldando o futuro digital da nossa empresa.</p>
                        <p>Se você é criativo, analítico e tem paixão por impulsionar resultados, junte-se a nós e faça parte de uma equipe inovadora que busca constantemente a excelência no marketing digital.</p>
                      </div>
                    </section>
                    <section>
                      <h3 className="text-2xl font-black text-gray-900 mb-6">Requisitos</h3>
                      <ul className="list-disc list-inside text-gray-600 text-[17px] space-y-4 font-bold">
                        <li>Experiência em estratégias de marketing online</li>
                        <li>SEO</li>
                        <li>SEM e gestão de campanhas nas redes sociais.</li>
                        <li>Habilidades analíticas para avaliar o desempenho de campanhas.</li>
                      </ul>
                    </section>
                  </div>
                ) : (
                  /* Aba de Concorrência (Imagem 5) */
                  <div className="space-y-10 animate-in fade-in duration-300 max-w-[800px]">
                    <CompetitionItem label="Comparativo" sub="80% melhor que a concorrência para essa vaga." progress={4} />
                    <CompetitionItem label="Média" sub={`Você possui ${selectedJob.match}, a média para essa vaga é 70%.`} progress={5} />
                    <CompetitionItem label="Residentes" sub="80% dos candidatos são residentes na região da vaga." progress={4} />
                    <CompetitionItem label="Pretensão salarial" sub="Você tem xx%, a média para essa vaga é xx%" progress={3} />
                    <CompetitionItem label="Experiência com cargo" sub="Você tem xx%, a média para essa vaga é xx%" progress={4} />
                    <CompetitionItem label="Trabalhando atualmente" sub="Você tem xx%, a média para essa vaga é xx%" progress={4} />
                    <CompetitionItem label="Experiência no segmento" sub="Você tem xx%, a média para essa vaga é xx%" progress={3} />
                    <CompetitionItem label="Idioma" sub="Você tem xx%, a média para essa vaga é xx%" progress={5} />
                    <CompetitionItem label="Tempo médio empregos anteriores" sub="Você tem xx%, a média para essa vaga é xx%" progress={4} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Padrão */}
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

const ApplicationCard: React.FC<{ job: any, isActive: boolean, onClick: () => void }> = ({ job, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`p-8 rounded-[32px] border-2 transition-all cursor-pointer group shadow-sm ${isActive ? 'bg-white border-[#1D4ED8] ring-4 ring-blue-50' : 'bg-white border-transparent hover:border-gray-200'}`}
  >
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-14 h-14 ${job.bgColor} rounded-2xl flex items-center justify-center font-black text-xl ${job.iconColor}`}>
        {job.title.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-lg truncate text-[#1D4ED8]">{job.title}</h4>
        <p className="text-gray-400 text-sm font-bold truncate">{job.company}</p>
      </div>
    </div>

    <div className="space-y-3 mb-8">
      <div className="flex items-center gap-3 text-gray-500 font-bold text-sm"><MapPin size={16} /> Remoto</div>
      <div className="flex items-center gap-3 text-[#F04E23] font-bold text-sm"><DollarSign size={16} /> A combinar</div>
      <div className="flex items-center gap-3 text-gray-500 font-bold text-sm"><Clock size={16} /> Período flexível</div>
      <div className="flex items-center gap-3 text-gray-500 font-bold text-sm"><Briefcase size={16} /> VR/VT</div>
    </div>

    <div className="mt-auto">
      <div className="w-fit bg-[#EBF5FF] rounded-full px-6 py-2 text-[#1D4ED8] font-black text-[12px] mb-6 border border-blue-100">
        {job.match} de aderência
      </div>
      <div className="flex items-center justify-between">
        <button className="text-[#F04E23] font-black hover:underline underline-offset-8 decoration-2 text-sm">Ver mais</button>
        <span className="flex items-center gap-2 text-gray-400 text-xs font-bold"><Calendar size={14} /> {job.date}</span>
      </div>
    </div>
  </div>
);

const JobInfoItem: React.FC<{ icon: React.ReactNode, text: string, color?: string }> = ({ icon, text, color = "text-gray-500" }) => (
  <div className={`flex items-center gap-3 font-bold text-base ${color}`}>
    <span className="text-gray-400">{icon}</span>
    {text}
  </div>
);

const CompetitionItem: React.FC<{ label: string, sub: string, progress: number }> = ({ label, sub, progress }) => (
  <div className="w-full">
    <div className="flex justify-between items-end mb-3">
      <div>
        <p className="text-gray-900 font-black text-xl mb-1 tracking-tight">{label}</p>
        <p className="text-gray-400 text-[13px] font-bold">{sub}</p>
      </div>
    </div>
    <div className="flex gap-1.5 h-3.5 w-full">
      {[1, 2, 3, 4, 5].map(step => (
        <div
          key={step}
          className={`flex-1 rounded-full transition-all duration-700 ease-out ${step <= progress ? 'bg-[#5AB7F7]' : 'bg-gray-100'}`}
        />
      ))}
    </div>
  </div>
);

export default MyJobsPage;
