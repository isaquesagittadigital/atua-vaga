
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import StatusModal from '../modals/StatusModal';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onCodeSent: () => void;
  title?: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, onCodeSent, title = "Recuperar senha" }) => {
  const [email, setEmail] = useState('samuel@sagittadigital.com.br');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 1200);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-[15px]";

  return (
    <div className="w-full max-w-[450px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white px-10 py-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 relative">
        <button 
          onClick={onBack}
          className="flex items-center gap-1.5 text-gray-800 font-black text-[14px] mb-8 hover:text-[#F04E23] transition-colors"
        >
          <ChevronLeft size={18} strokeWidth={3} />
          Voltar
        </button>

        <h2 className="text-3xl font-black text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-8 font-medium">
          Iremos te ajudar a recuperar sua conta, insira seu email para enviarmos um código de recuperação!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">E-mail</label>
            <input 
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              required
            />
            <p className="mt-2 text-[12px] text-gray-400 font-medium">Insira seu email de recuperação.</p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-100 text-[16px]"
          >
            {loading ? 'Enviando...' : 'Enviar código'}
          </button>
        </form>
      </div>

      {showSuccess && (
        <StatusModal 
          type="success"
          title="Código enviado!"
          message="Verifique no seu email se o código chegou, não esqueça da caixa de spam!"
          buttonText="Abrir e-mail"
          onConfirm={() => {
            setShowSuccess(false);
            onCodeSent();
          }}
        />
      )}
    </div>
  );
};

export default ForgotPasswordForm;
