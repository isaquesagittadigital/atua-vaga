
import React, { useState } from 'react';
import { ChevronLeft, EyeOff, Eye } from 'lucide-react';
import { GoogleIcon } from '../ui/Icons';
import { formatCPF } from '../../utils/validators';
import StatusModal from '../modals/StatusModal';
import ConfirmModal from '../modals/ConfirmModal';

interface RegisterFormProps {
  onBack: () => void;
  onLoginLink: () => void;
  onRegisterComplete: () => void;
  onRecoverAccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onBack, onLoginLink, onRegisterComplete, onRecoverAccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const [showPass, setShowPass] = useState({ pass: false, confirm: false });
  
  const [formData, setFormData] = useState({
    cpf: '906.781.049-56',
    password: '',
    confirmPassword: '',
    name: 'José de Alencar',
    email: 'samuel@sagittadigital.com.br',
    phone: '+55 11 99239192'
  });

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }));
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (formData.cpf === '906.781.049-56') {
        setShowAlreadyRegistered(true);
      } else {
        setStep(2);
      }
    }, 800);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 1000);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-[15px]";

  return (
    <div className="w-full max-w-[450px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white px-10 py-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 relative">
        <button 
          onClick={step === 1 ? onBack : () => setStep(1)}
          className="flex items-center gap-1.5 text-gray-800 font-black text-[14px] mb-8 hover:text-[#F04E23] transition-colors"
        >
          <ChevronLeft size={18} strokeWidth={3} />
          Voltar
        </button>

        <div className="flex justify-between items-start mb-2">
          <h2 className="text-3xl font-black text-gray-900">Cadastrar</h2>
          <span className="text-[11px] font-black text-[#5AB7F7] uppercase tracking-widest mt-2">Etapa {step} de 2</span>
        </div>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-8 font-medium">
          Insira suas informações para realizar o cadastro. Levará menos de 1 minuto!
        </p>

        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">CPF</label>
              <input 
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleCpfChange}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Senha</label>
              <div className="relative">
                <input 
                  type={showPass.pass ? 'text' : 'password'}
                  placeholder="**********"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  className={inputClasses}
                  required
                />
                <button type="button" onClick={() => setShowPass(p => ({ ...p, pass: !p.pass }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass.pass ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Confirmar senha</label>
              <div className="relative">
                <input 
                  type={showPass.confirm ? 'text' : 'password'}
                  placeholder="**********"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                  className={inputClasses}
                  required
                />
                <button type="button" onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass.confirm ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-100 text-[16px]"
            >
              {loading ? 'Processando...' : 'Continuar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleStep2} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Nome</label>
              <input 
                type="text"
                placeholder="Nome completo"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">E-mail</label>
              <input 
                type="email"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Telefone</label>
              <input 
                type="tel"
                placeholder="+55 00 000000000"
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                className={inputClasses}
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-100 text-[16px]"
            >
              {loading ? 'Finalizando...' : 'Finalizar cadastro'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-[13px] text-gray-500 font-medium">
            Já tem uma conta? <button onClick={onLoginLink} className="text-gray-900 font-black hover:underline underline-offset-4">Entre agora!</button>
          </p>
        </div>

        {step === 1 && (
          <div className="mt-10">
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-200 bg-white rounded-2xl hover:bg-gray-50 transition-all font-bold text-gray-700 text-[14px] shadow-sm"
            >
              <GoogleIcon />
              Entrar com Google
            </button>
          </div>
        )}
      </div>

      {showSuccess && (
        <StatusModal 
          type="success"
          title="Cadastro concluído!"
          message="Agora você já pode entrar na sua conta e aproveitar nossas melhores funcionalidades!"
          buttonText="Ir para login"
          onConfirm={() => {
            setShowSuccess(false);
            onRegisterComplete();
          }}
        />
      )}

      {showAlreadyRegistered && (
        <ConfirmModal 
          type="warning"
          title="Conta já cadastrada!"
          message="Você já possui um cadastro com esse e-mail. Tente recuperar sua conta para acessar nossa plataforma!"
          confirmText="Recuperar acesso"
          cancelText="Voltar"
          onConfirm={() => {
            setShowAlreadyRegistered(false);
            onRecoverAccess();
          }}
          onCancel={() => {
            setShowAlreadyRegistered(false);
          }}
        />
      )}
    </div>
  );
};

export default RegisterForm;
