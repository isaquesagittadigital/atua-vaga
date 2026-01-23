import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/Icons';
import {
  Bell, FileText, ChevronDown, Plus, Trash2,
  X, CheckCircle2, ChevronRight, Check
} from 'lucide-react';

// Fixed: Moved shared UI classes outside the component to be accessible by helper components like AvailabilityQuestion
const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-[15px]";
const labelClasses = "block text-[14px] font-bold text-gray-600 mb-2";

const ProfessionalRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showFinalModal, setShowFinalModal] = useState(false);

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else setShowFinalModal(true);
  };

  const skipStep = () => {
    if (step < 4) setStep(step + 1);
    else setShowFinalModal(true);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <section>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Dados pessoais</h2>
              <p className="text-gray-500 font-bold mb-8">Preencha o restante dos seus dados.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                  <input type="tel" defaultValue="+55 11 99239192" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Data de nascimento</label>
                  <input type="text" placeholder="Ex.: dd/mm/aaaa" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Estado civil</label>
                  <div className="relative">
                    <select className={`${inputClasses} appearance-none pr-10`}>
                      <option>Selecione seu estado civil</option>
                      <option>Solteiro</option>
                      <option>Casado</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Endereço completo</label>
                  <input type="text" placeholder="Informe seu endereço completo" className={inputClasses} />
                </div>
              </div>

              <div className="mt-8">
                <label className={labelClasses}>Possuí CNH?</label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-600">
                    <input type="radio" name="cnh" className="w-5 h-5 accent-[#F04E23]" /> Sim
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-600">
                    <input type="radio" name="cnh" className="w-5 h-5 accent-[#F04E23]" /> Não
                  </label>
                </div>
              </div>
            </section>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Formação Acadêmica</h2>
                  <p className="text-gray-500 font-bold max-w-[400px]">Mostre aos recrutadores seu nível educacional adicionando sua escolaridade.</p>
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-red-500 transition-colors">
                    <Trash2 size={18} /> Excluir
                  </button>
                  <button className="flex items-center gap-2 text-[#1D4ED8] font-black text-sm hover:underline">
                    <Plus size={18} /> Adicionar formação
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border border-gray-100 rounded-[24px] bg-[#F8FAFC]/30">
                <div>
                  <label className={labelClasses}>Tipo de formação</label>
                  <div className="relative">
                    <select className={`${inputClasses} appearance-none pr-10`}>
                      <option>Selecione o tipo de formação</option>
                      <option>Ensino médio</option>
                      <option>Graduação</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Instituição</label>
                  <input type="text" placeholder="Informe o nome da Instituição" className={inputClasses} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClasses}>Curso</label>
                  <input type="text" placeholder="Informe o nome do curso" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Data de início</label>
                  <div className="flex gap-3">
                    <input type="text" placeholder="Mês" className={inputClasses} />
                    <input type="text" placeholder="Ano" className={inputClasses} />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Data de conclusão</label>
                  <div className="flex gap-3">
                    <input type="text" placeholder="Mês" className={inputClasses} />
                    <input type="text" placeholder="Ano" className={inputClasses} />
                  </div>
                  <div className="flex gap-4 mt-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-400 cursor-pointer">
                      <input type="radio" name="status" className="w-4 h-4" /> Concluído
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-400 cursor-pointer">
                      <input type="radio" name="status" className="w-4 h-4" /> Cursando
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-400 cursor-pointer">
                      <input type="radio" name="status" className="w-4 h-4" /> Não finalizado
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      case 3:
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Experiências profissionais</h2>
                  <p className="text-gray-500 font-bold max-w-[400px]">Mostre aos recrutadores seu nível profissional adicionando suas experiências.</p>
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-red-500">
                    <Trash2 size={18} /> Excluir
                  </button>
                  <button className="flex items-center gap-2 text-[#1D4ED8] font-black text-sm hover:underline">
                    <Plus size={18} /> Adicionar experiência
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border border-gray-100 rounded-[24px] bg-[#F8FAFC]/30">
                <div>
                  <label className={labelClasses}>Nome da empresa</label>
                  <input type="text" placeholder="Informe o nome da empresa" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Cargo</label>
                  <input type="text" placeholder="Informe seu cargo" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>Atividades realizadas</label>
                  <textarea placeholder="Descreva suas responsabilidades" className={`${inputClasses} h-[140px] resize-none`} />
                </div>
                <div className="space-y-6">
                  <div>
                    <label className={labelClasses}>Área profissional</label>
                    <input type="text" placeholder="Ex.: Comercial" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Último salário</label>
                    <input type="text" placeholder="Informe somente o valor" className={inputClasses} />
                    <div className="mt-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-[#F04E23] cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-[#F04E23]" defaultChecked /> Remuneração variável
                      </label>
                      <input type="text" placeholder="Informe somente o valor" className={`${inputClasses} mt-2`} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Data de início</label>
                  <div className="flex gap-3">
                    <input type="text" placeholder="Mês" className={inputClasses} />
                    <input type="text" placeholder="Ano" className={inputClasses} />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Data de saída</label>
                  <div className="flex gap-3">
                    <input type="text" placeholder="Mês" className={inputClasses} />
                    <input type="text" placeholder="Ano" className={inputClasses} />
                  </div>
                  <label className="flex items-center gap-2 mt-4 text-sm font-bold text-gray-400 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" /> Atualmente trabalho aqui
                  </label>
                </div>
              </div>
            </section>
          </div>
        );
      case 4:
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            <section>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Habilidades</h2>
              <p className="text-gray-500 font-bold mb-8">Mostre aos recrutadores seu nível profissional adicionando suas habilidades.</p>

              <div className="space-y-8">
                <div>
                  <label className={labelClasses}>Habilidades</label>
                  <div className="relative">
                    <input type="text" placeholder="Informe suas habilidades" className={inputClasses} />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <SkillTag label="Comunicação" />
                    <SkillTag label="Vendas" />
                    <SkillTag label="Organização" />
                    <SkillTag label="Gerenciamento" />
                    <SkillTag label="Trabalho em equipe" />
                    <SkillTag label="Alteridade" />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Quem sou eu</label>
                  <textarea placeholder="Descreva suas responsabilidades" className={`${inputClasses} h-[140px] resize-none`} />
                </div>

                <div>
                  <label className={labelClasses}>Rede sociais</label>
                  <input type="text" placeholder="Cole o link de suas redes sociais" className={inputClasses} />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-2 text-xs font-bold text-gray-600 shadow-sm">
                      <div className="w-5 h-5 bg-[#0077B5] rounded flex items-center justify-center text-white text-[10px]">in</div>
                      in/jose.alencar
                      <X size={14} className="ml-1 cursor-pointer text-gray-300" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className={labelClasses}>Treinamentos</label>
                    <input type="text" placeholder="Informe seus treinamentos" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Objetivo salarial</label>
                    <input type="text" placeholder="Informe qual salário almeja" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Objetivo de cargo</label>
                    <input type="text" placeholder="Informe qual cargo almeja" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Área profissional</label>
                    <input type="text" placeholder="Informe qual área almeja" className={inputClasses} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Diversidade</label>
                    <input type="text" placeholder="Informe sua identidade, raça ou orientação" className={inputClasses} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <AvailabilityQuestion label="Disponibilidade para viajar?" />
                  <AvailabilityQuestion label="Disponibilidade para dormir?" />
                  <AvailabilityQuestion label="Disponibilidade para se mudar?" />
                </div>
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <main className="flex-1 bg-[#F8FAFC] py-16 px-6">
        <div className="max-w-[1000px] mx-auto">
          {step === 1 && (
            <div className="mb-12">
              <h1 className="text-4xl font-black text-gray-900 mb-2">Cadastro profissional</h1>
              <p className="text-gray-500 font-bold">Preencha as informações abaixo para concluir seu cadastro profissional.</p>
            </div>
          )}

          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-12 md:p-20 relative">
            {renderStep()}

            <div className="mt-16 flex flex-col items-center gap-6">
              <button
                onClick={nextStep}
                className="w-full max-w-[400px] py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-100 text-lg"
              >
                {step === 4 ? 'Salvar e concluir' : 'Salvar e continuar'}
              </button>
              <button
                onClick={skipStep}
                className="text-gray-400 font-bold hover:text-gray-600 transition-colors text-lg"
              >
                Pular
              </button>
            </div>
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

      {showFinalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[500px] rounded-[48px] overflow-hidden shadow-2xl p-16 text-center animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-[#EBFBF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-10">
              <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white">
                <Check size={40} strokeWidth={4} />
              </div>
            </div>

            <h3 className="text-4xl font-black text-gray-900 mb-6">Perfil concluído</h3>
            <p className="text-gray-500 text-lg leading-relaxed mb-12 px-4 font-bold">
              Volte para página inicial e aplique para as vagas mais alinhadas ao seu perfil.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowFinalModal(false);
                  navigate('/app/jobs');
                }}
                className="w-full py-5 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-100 text-xl"
              >
                Ir para Vagas
              </button>
              <button
                onClick={() => setShowFinalModal(false)}
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

const SkillTag: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-4 py-2 text-xs font-bold text-gray-600 shadow-sm hover:border-gray-200 transition-all">
    {label}
    <X size={14} className="cursor-pointer text-gray-300 hover:text-gray-500" />
  </div>
);

const AvailabilityQuestion: React.FC<{ label: string }> = ({ label }) => (
  <div>
    <p className={labelClasses}>{label}</p>
    <div className="flex gap-4 mt-2">
      <label className="flex items-center gap-2 text-sm font-bold text-gray-400 cursor-pointer">
        <input type="radio" name={label} className="w-4 h-4 accent-[#F04E23]" /> Sim
      </label>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-400 cursor-pointer">
        <input type="radio" name={label} className="w-4 h-4 accent-[#F04E23]" /> Não
      </label>
    </div>
  </div>
);

export default ProfessionalRegistration;
