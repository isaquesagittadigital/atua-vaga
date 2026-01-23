import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/Icons';
import {
   Bell, FileText, ChevronRight, X, MapPin,
   DollarSign, Clock, Briefcase, Calendar,
   Plus, Trash2, Trophy, ChevronDown, Linkedin
} from 'lucide-react';

const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-[15px] font-medium";
const labelClasses = "block text-[14px] font-bold text-gray-600 mb-2";

const ProfilePage: React.FC = () => {
   const navigate = useNavigate();

   return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
         <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
            {/* User Profile Header (Image 2) */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-10 mb-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-8">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-gray-50">
                        <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" alt="José" className="w-full h-full object-cover grayscale" />
                     </div>
                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        <Plus size={16} className="text-[#F04E23]" />
                     </div>
                  </div>
                  <div>
                     <h1 className="text-3xl font-black text-gray-900">José de Alencar</h1>
                     <p className="text-gray-500 font-bold text-lg">Gerente de projetos</p>
                  </div>
               </div>

               <div className="flex-1 max-w-[400px] w-full">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-gray-600 font-bold text-[15px]">Progresso do perfil: <span className="font-black text-gray-900">100% concluído</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex-1 h-3.5 flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                           <div key={i} className="flex-1 bg-[#5AB7F7] rounded-full"></div>
                        ))}
                     </div>
                     <div className="w-10 h-10 rounded-full bg-[#5AB7F7] flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <Trophy size={20} strokeWidth={2.5} />
                     </div>
                  </div>
               </div>
            </div>

            {/* Form Sections */}
            <div className="space-y-16">
               {/* Personal Data */}
               <section>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Dados pessoais</h2>
                  <p className="text-gray-400 font-bold mb-10">Preencha o restante dos seus dados.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-1">
                        <label className={labelClasses}>Nome</label>
                        <input type="text" defaultValue="José de Alencar" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>CPF ou CNPJ</label>
                        <input type="text" defaultValue="906.781.049-56" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>E-mail</label>
                        <input type="email" defaultValue="samuel@sagittadigital.com.br" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Telefone</label>
                        <input type="text" defaultValue="+55 11 99239192" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Data de nascimento</label>
                        <input type="text" defaultValue="01/01/2000" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Idade</label>
                        <input type="text" defaultValue="37 anos" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Estado civil</label>
                        <div className="relative">
                           <select className={`${inputClasses} appearance-none`}>
                              <option>Solteiro</option>
                              <option>Casado</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                     </div>
                     <div>
                        <label className={labelClasses}>Endereço completo</label>
                        <input type="text" defaultValue="Est. Lins, 123. São Paulo - SP." className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Possuí CNH?</label>
                        <div className="flex gap-6 mt-4">
                           <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-600">
                              <input type="radio" name="cnh" className="w-5 h-5 accent-[#F04E23]" defaultChecked /> Sim
                           </label>
                           <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-600">
                              <input type="radio" name="cnh" className="w-5 h-5 accent-[#F04E23]" /> Não
                           </label>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Education */}
               <section>
                  <div className="flex justify-between items-center mb-8">
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Formação Acadêmica</h2>
                        <p className="text-gray-400 font-bold">Mostre aos recrutadores seu nível educacional adicionando sua escolaridade.</p>
                     </div>
                     <div className="flex gap-6">
                        <button className="flex items-center gap-2 text-[#EF4444] font-bold text-sm"><Trash2 size={18} /> Excluir</button>
                        <button className="flex items-center gap-2 text-[#1D4ED8] font-black text-sm"><Plus size={18} /> Adicionar formação</button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div>
                        <label className={labelClasses}>Tipo de formação</label>
                        <div className="relative">
                           <select className={`${inputClasses} appearance-none`}>
                              <option>Ensino médio</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                     </div>
                     <div>
                        <label className={labelClasses}>Instituição</label>
                        <input type="text" defaultValue="Escola Municipal Souza" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Data de início</label>
                        <div className="flex gap-3">
                           <input type="text" defaultValue="01" className={inputClasses} />
                           <input type="text" defaultValue="2002" className={inputClasses} />
                        </div>
                     </div>
                     <div>
                        <label className={labelClasses}>Data de conclusão</label>
                        <div className="flex gap-3">
                           <input type="text" placeholder="Mês" className={inputClasses} />
                           <input type="text" placeholder="Ano" className={inputClasses} />
                        </div>
                     </div>
                     <div className="md:col-span-2">
                        <div className="flex gap-6 mt-10">
                           <label className="flex items-center gap-2 text-sm font-bold text-gray-400"><input type="radio" /> Concluído</label>
                           <label className="flex items-center gap-2 text-sm font-bold text-gray-400"><input type="radio" /> Cursando</label>
                           <label className="flex items-center gap-2 text-sm font-bold text-gray-900"><input type="radio" defaultChecked /> Não finalizado</label>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Experience */}
               <section>
                  <div className="flex justify-between items-center mb-8">
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Experiências profissionais</h2>
                        <p className="text-gray-400 font-bold">Mostre aos recrutadores seu nível profissional adicionando suas experiências.</p>
                     </div>
                     <div className="flex gap-6">
                        <button className="flex items-center gap-2 text-[#EF4444] font-bold text-sm"><Trash2 size={18} /> Excluir</button>
                        <button className="flex items-center gap-2 text-[#1D4ED8] font-black text-sm"><Plus size={18} /> Adicionar experiência</button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div>
                        <label className={labelClasses}>Nome da empresa</label>
                        <input type="text" defaultValue="Sagitta" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Cargo</label>
                        <input type="text" defaultValue="Gerente de projetos" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Atividades realizadas</label>
                        <input type="text" defaultValue="Gerencio projetos" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Valor da remuneração</label>
                        <input type="text" defaultValue="R$ 10.000" className={inputClasses} />
                        <label className="flex items-center gap-2 mt-4 text-[#1D4ED8] font-bold text-sm">
                           <input type="checkbox" defaultChecked /> Remuneração variável
                        </label>
                        <input type="text" defaultValue="R$ 500" className={`${inputClasses} mt-4`} />
                     </div>
                     <div>
                        <label className={labelClasses}>Data de início</label>
                        <div className="flex gap-3">
                           <input type="text" defaultValue="01" className={inputClasses} />
                           <input type="text" defaultValue="2024" className={inputClasses} />
                        </div>
                     </div>
                     <div>
                        <label className={labelClasses}>Data de saída</label>
                        <div className="flex gap-3">
                           <input type="text" placeholder="Mês" className={inputClasses} />
                           <input type="text" placeholder="Ano" className={inputClasses} />
                        </div>
                        <label className="flex items-center gap-2 mt-4 text-[#1D4ED8] font-bold text-sm">
                           <input type="checkbox" defaultChecked /> Atualmente trabalho aqui
                        </label>
                     </div>
                  </div>
               </section>

               {/* Skills */}
               <section>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Habilidades</h2>
                  <p className="text-gray-400 font-bold mb-10">Mostre aos recrutadores seu nível profissional adicionando suas habilidades.</p>

                  <div className="space-y-8">
                     <div>
                        <label className={labelClasses}>Habilidades</label>
                        <div className="relative max-w-[500px]">
                           <input type="text" placeholder="Informe suas habilidades" className={inputClasses} />
                           <Plus size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-6">
                           {['Comunicação', 'Vendas', 'Organização', 'Gerenciamento', 'Trabalho em equipe', 'Alteridade'].map(skill => (
                              <div key={skill} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-[13px] font-bold text-gray-600 shadow-sm">
                                 {skill} <X size={14} className="text-gray-300" />
                              </div>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className={labelClasses}>Quem sou eu</label>
                        <textarea placeholder="Descreva suas responsabilidades" className={`${inputClasses} h-[140px] resize-none`}></textarea>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                           <label className={labelClasses}>Rede sociais</label>
                           <input type="text" placeholder="Cole o link de suas redes sociais" className={inputClasses} />
                           <div className="mt-4 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 w-fit">
                              <div className="w-5 h-5 bg-[#0077B5] rounded flex items-center justify-center text-white text-[10px] font-black"><Linkedin size={12} /></div>
                              <span className="text-[13px] font-bold text-gray-600">in/jose.alencar</span>
                              <X size={14} className="text-gray-300" />
                           </div>
                        </div>
                        <div>
                           <label className={labelClasses}>Treinamentos</label>
                           <input type="text" placeholder="Informe seus treinamentos" className={inputClasses} />
                        </div>
                        <div>
                           <label className={labelClasses}>Objetivo profissional</label>
                           <input type="text" placeholder="Ex.: salário, cargo, hierarquia ou área" className={inputClasses} />
                        </div>
                        <div>
                           <label className={labelClasses}>Diversidade</label>
                           <input type="text" placeholder="Informe sua identidade, raça ou orientação" className={inputClasses} />
                        </div>
                        <div>
                           <label className={labelClasses}>Disponibilidade para viajar?</label>
                           <div className="flex gap-6 mt-4">
                              <label className="flex items-center gap-2 font-bold text-gray-600"><input type="checkbox" defaultChecked /> Sim</label>
                              <label className="flex items-center gap-2 font-bold text-gray-600"><input type="checkbox" /> Não</label>
                           </div>
                        </div>
                        <div>
                           <label className={labelClasses}>Disponibilidade para dormir?</label>
                           <div className="flex gap-6 mt-4">
                              <label className="flex items-center gap-2 font-bold text-gray-600"><input type="checkbox" defaultChecked /> Sim</label>
                              <label className="flex items-center gap-2 font-bold text-gray-600"><input type="checkbox" /> Não</label>
                           </div>
                        </div>
                        <div>
                           <label className={labelClasses}>Disponibilidade para se mudar?</label>
                           <div className="flex gap-6 mt-4">
                              <label className="flex items-center gap-2 font-bold text-gray-600"><input type="checkbox" defaultChecked /> Sim</label>
                              <label className="flex items-center gap-2 font-bold text-gray-600"><input type="checkbox" /> Não</label>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>

               {/* Behavioral Results */}
               <section>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Resultado comportamental</h2>
                  <p className="text-gray-400 font-bold mb-10">Mostre aos recrutadores seu nível profissional respondendo os testes.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[1, 2, 3].map(i => (
                        <button
                           key={i}
                           onClick={() => navigate('/app/behavioral-result')}
                           className="flex items-center justify-between p-8 bg-[#EBF5FF] border border-blue-100 rounded-[32px] group hover:bg-blue-100 transition-all text-left"
                        >
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-600 text-white rounded-2xl">
                                 <FileText size={24} />
                              </div>
                              <div>
                                 <h4 className="font-black text-[#1D4ED8]">Teste comportamental {i}</h4>
                                 <p className="text-gray-400 font-bold text-[12px] mt-1">PDF • 25 fev, 2023 • 212.5 KB</p>
                              </div>
                           </div>
                           <ChevronRight size={24} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </button>
                     ))}
                  </div>
               </section>
            </div>
         </main>

         {/* Footer */}
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

export default ProfilePage;
