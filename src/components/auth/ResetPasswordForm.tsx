
import React, { useState } from 'react';
import { EyeOff, Eye, AlertTriangle } from 'lucide-react';
import StatusModal from '../modals/StatusModal';
import ConfirmModal from '../modals/ConfirmModal';

interface ResetPasswordFormProps {
  onCancel: () => void;
  onResetComplete: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onCancel, onResetComplete }) => {
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
    }, 1200);
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-[15px]";

  return (
    <div className="w-full max-w-[450px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white px-10 py-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
        <h2 className="text-3xl font-black text-gray-900 mb-3">Redefinir senha</h2>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-8 font-medium">
          Agora insira a sua nova senha, ela não pode ser igual a anterior!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Nova senha</label>
            <div className="relative">
              <input 
                type={showPass.new ? 'text' : 'password'}
                placeholder="**********"
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                className={inputClasses}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPass(p => ({ ...p, new: !p.new }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass.new ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Confirmar senha</label>
            <div className="relative">
              <input 
                type={showPass.confirm ? 'text' : 'password'}
                placeholder="**********"
                value={passwords.confirm}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                className={inputClasses}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass.confirm ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-100 text-[16px]"
          >
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
          
          <button 
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="w-full text-[15px] font-bold text-gray-400 hover:text-gray-900 transition-colors py-2"
          >
            Cancelar
          </button>
        </form>
      </div>

      {showExitConfirm && (
        <ConfirmModal 
          title="Tem certeza que deseja sair?"
          message="Este link possui um tempo de expiração de 15 minutos!"
          onConfirm={onCancel}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}

      {showSuccess && (
        <StatusModal 
          type="success"
          title="Senha redefinida"
          message="Agora você já pode entrar na sua conta e aproveitar nossas melhores funcionalidades!"
          buttonText="Ir para login"
          onConfirm={() => {
            setShowSuccess(false);
            onResetComplete();
          }}
        />
      )}
    </div>
  );
};

export default ResetPasswordForm;
