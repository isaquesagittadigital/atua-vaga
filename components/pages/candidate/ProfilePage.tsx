import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/Icons';
import {
   Bell, FileText, ChevronRight, X, MapPin,
   DollarSign, Clock, Briefcase, Calendar,
   Plus, Trash2, Trophy, ChevronDown, Linkedin
} from 'lucide-react';

import { supabase } from '../../../src/lib/supabase';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useEffect, useState } from 'react';
import SuccessModal from '../../modals/SuccessModal';

const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-[15px] font-medium";
const labelClasses = "block text-[14px] font-bold text-gray-600 mb-2";

const ProfilePage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
   const navigate = useNavigate();
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false);

   const [formData, setFormData] = useState({
      full_name: '',
      email: '',
      cpf: '',
      phone: '',
      birth_date: '',
      age: '',
      civil_status: 'Solteiro',
      address: '',
      cnh: 'Sim'
   });

   useEffect(() => {
      if (user) {
         setFormData({
            full_name: user.user_metadata?.full_name || '',
            email: user.email || '',
            cpf: user.user_metadata?.cpf || '',
            phone: user.user_metadata?.phone || '',
            birth_date: user.user_metadata?.birth_date || '',
            age: user.user_metadata?.age || '',
            civil_status: user.user_metadata?.civil_status || 'Solteiro',
            address: user.user_metadata?.address || '',
            cnh: user.user_metadata?.cnh || 'Sim'
         });
      }
   }, [user]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
   };

   const handleSave = async () => {
      try {
         setLoading(true);
         const { error } = await supabase.auth.updateUser({
            data: {
               full_name: formData.full_name,
               cpf: formData.cpf,
               phone: formData.phone,
               birth_date: formData.birth_date,
               age: formData.age,
               civil_status: formData.civil_status,
               address: formData.address,
               cnh: formData.cnh
            }
         });

         if (error) throw error;
         setShowSuccessModal(true);
      } catch (error: any) {
         console.error(error);
         alert('Erro ao atualizar perfil.');
      } finally {
         setLoading(false);
      }
   };


   return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
         <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title="Dados alterados com sucesso!"
            description="Suas informações de perfil foram atualizadas com segurança."
            buttonText="Fechar"
         />
         <main className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-12">
            {/* User Profile Header (Image 2) */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-10 mb-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-8">
                  <div className="relative">
                     <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-gray-50 bg-blue-100 flex items-center justify-center text-4xl font-black text-[#1D4ED8]">
                        {formData.full_name?.charAt(0).toUpperCase() || 'U'}
                     </div>
                     <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg flex items-center justify-center">
                        <Plus size={16} className="text-[#F04E23]" />
                     </div>
                  </div>
                  <div>
                     <h1 className="text-3xl font-black text-gray-900">{formData.full_name || 'Usuário'}</h1>
                     <p className="text-gray-500 font-bold text-lg">Candidato</p>
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
                  <div className="flex justify-between items-center mb-10">
                     <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Dados pessoais</h2>
                        <p className="text-gray-400 font-bold">Preencha o restante dos seus dados.</p>
                     </div>
                     <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                     >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-1">
                        <label className={labelClasses}>Nome</label>
                        <input name="full_name" value={formData.full_name} onChange={handleChange} type="text" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>CPF ou CNPJ</label>
                        <input name="cpf" value={formData.cpf} onChange={handleChange} type="text" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>E-mail</label>
                        <input name="email" value={formData.email} disabled type="email" className={`${inputClasses} bg-gray-50 cursor-not-allowed`} />
                     </div>
                     <div>
                        <label className={labelClasses}>Telefone</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} type="text" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Data de nascimento</label>
                        <input name="birth_date" value={formData.birth_date} onChange={handleChange} type="text" placeholder="DD/MM/AAAA" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Idade</label>
                        <input name="age" value={formData.age} onChange={handleChange} type="text" className={inputClasses} />
                     </div>
                     <div>
                        <label className={labelClasses}>Estado civil</label>
                        <div className="relative">
                           <select name="civil_status" value={formData.civil_status} onChange={handleChange} className={`${inputClasses} appearance-none`}>
                              <option value="Solteiro">Solteiro</option>
                              <option value="Casado">Casado</option>
                              <option value="Divorciado">Divorciado</option>
                              <option value="Viúvo">Viúvo</option>
                           </select>
                           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                     </div>
                     <div>
                        <label className={labelClasses}>Endereço completo</label>
                        <input name="address" value={formData.address} onChange={handleChange} type="text" className={inputClasses} />
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
