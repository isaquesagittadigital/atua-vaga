
import React, { useState, useEffect } from 'react';
import { ChevronLeft, EyeOff, Eye } from 'lucide-react';

import { formatCPF, isValidCPF, formatPhone } from '@/utils/validators';
import StatusModal from '../modals/StatusModal';
import ConfirmModal from '../modals/ConfirmModal';
import PasswordStrengthMeter from '../ui/PasswordStrengthMeter'; // NEW
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface RegisterFormProps {
  onBack: () => void;
  onLoginLink: () => void;
  onRegisterComplete: () => void;
  onRecoverAccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onBack, onLoginLink, onRegisterComplete, onRecoverAccess }) => {
  const { signUp } = useAuth();
  const navigate = useNavigate(); // Used for redirection
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // MODAL Visibility States
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false); // Generic Error Modal
  const [errorMessage, setErrorMessage] = useState('');
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);

  const [showPass, setShowPass] = useState({ pass: false, confirm: false });
  const [validationErrors, setValidationErrors] = useState({ cpf: '', password: '', email: '', phone: '' }); // Added email/phone errors
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);

  const [formData, setFormData] = useState({
    cpf: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: ''
  });

  // Real-time validation for Step 1
  useEffect(() => {
    if (step === 1) {
      // 1. Validate Email
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

      // 2. Validate Password Complexity
      const hasMinLen = formData.password.length >= 8;
      const hasUpper = /[A-Z]/.test(formData.password);
      const hasLower = /[a-z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      const hasSpecial = /[\W_]/.test(formData.password);
      const isPasswordComplex = hasMinLen && hasUpper && hasLower && hasNumber && hasSpecial;

      // 3. Match Passwords
      const doPasswordsMatch = formData.password === formData.confirmPassword;

      // Update Errors
      setValidationErrors(prev => ({
        ...prev,
        email: (formData.email.length > 0 && !isEmailValid) ? 'E-mail Inválido' : '',
        password: (formData.confirmPassword && !doPasswordsMatch) ? 'As senhas não coincidem' : ''
      }));

      // Overall Validity
      setIsStep1Valid(isEmailValid && isPasswordComplex && doPasswordsMatch);

    } else if (step === 2) {
      // Step 2 Validation
      const isCpfValid = isValidCPF(formData.cpf);
      const isNameFilled = formData.name.trim().length > 2;
      const cleanPhone = formData.phone.replace(/\D/g, '');
      const isPhoneValid = cleanPhone.length === 11;

      setIsStep2Valid(isCpfValid && isNameFilled && isPhoneValid);
    }
  }, [formData, step]);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const rawValue = e.target.value.replace(/\D/g, '');
    const formatted = formatCPF(rawValue);
    setFormData(prev => ({ ...prev, cpf: formatted }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mask: (00) 0 0000-0000
    const formatted = formatPhone(e.target.value);
    // Strictly limit to mask length (16 chars: "(11) 9 1234-5678")
    if (formatted.length <= 16) {
      setFormData(p => ({ ...p, phone: formatted }));
    }
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid) return;
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        cpf: formData.cpf,
        role: 'candidate'
      });
      // Explicitly show modal logic
      console.log("Registration success!"); // Debug
      setShowSuccess(true);
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("already registered") || error.code === '409') { // 409 Conflict
        setShowAlreadyRegistered(true);
      } else if (error.message.includes("CPF already exists")) {
        setErrorMessage("Este CPF já está sendo utilizado.");
        setShowError(true);
      } else {
        setErrorMessage("Erro ao cadastrar: " + error.message);
        setShowError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-[15px]";

  return (
    <div className="w-full max-w-[450px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-0">
      {/* SUCCESS MODAL TRIGGERED AT END OF FILE */}

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
          <span className="text-[11px] font-black text-[#5AB7F7] mt-2">Etapa {step} de 2</span>
        </div>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-8 font-medium">
          Insira suas informações para realizar o cadastro. Levará menos de 1 minuto!
        </p>

        {step === 1 ? (
          <form onSubmit={handleStep1} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2">E-email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                className={`${inputClasses} ${validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`}
                required
              />
              {validationErrors.cpf && (
                <span className="text-red-500 text-[12px] font-bold mt-1.5 block animate-in slide-in-from-top-1 fade-in duration-300">
                  {validationErrors.cpf}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPass.pass ? 'text' : 'password'}
                  placeholder="Crie uma senha segura"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  className={inputClasses}
                  required
                />
                <button type="button" onClick={() => setShowPass(p => ({ ...p, pass: !p.pass }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.pass ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {/* PASSWORD STRENGTH METER */}
              <PasswordStrengthMeter password={formData.password} />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2">Confirmar senha</label>
              <div className="relative">
                <input
                  type={showPass.confirm ? 'text' : 'password'}
                  placeholder="**********"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                  className={inputClasses}
                  required
                />
                <button type="button" onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.confirm ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {validationErrors.password && (
                <span className="text-red-500 text-[12px] font-bold mt-1.5 block animate-in slide-in-from-top-1 fade-in duration-300">
                  {validationErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isStep1Valid}
              className={`w-full py-4 font-bold rounded-2xl transition-all shadow-lg text-[16px] ${isStep1Valid
                ? 'bg-[#F04E23] hover:bg-[#E03E13] text-white shadow-orange-100 transform hover:-translate-y-1 active:translate-y-0'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
            >
              {loading ? 'Processando...' : 'Continuar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleStep2} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2">Nome</label>
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
              <label className="block text-[11px] font-bold text-gray-400 mb-2">CPF</label>
              <input
                type="text"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleCpfChange}
                maxLength={14}
                className={inputClasses}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 mb-2">Telefone</label>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={15} // (11) 91234-5678 is 15 chars
                className={inputClasses}
                required
              />
              <p className="text-[11px] text-gray-400 mt-1">Formato: (99) 99999-9999</p>
            </div>

            <button
              type="submit"
              disabled={loading || !isStep2Valid}
              className={`w-full py-4 font-bold rounded-2xl transition-all shadow-lg text-[16px] ${isStep2Valid
                ? 'bg-[#F04E23] hover:bg-[#E03E13] text-white shadow-orange-100 transform hover:-translate-y-1 active:translate-y-0'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
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

        {/* Google Register Button */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={async () => {
              try {
                await (await import('@/contexts/AuthContext')).useAuth().signInWithGoogle();
              } catch (err) {
                console.error("Google registration failed", err);
              }
            }}
            className="w-full py-3.5 border border-gray-200 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all text-[15px] group"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            Cadastrar com Google
          </button>
        </div>


      </div>

      {showSuccess && (
        <StatusModal
          type="success"
          title="Cadastro concluído!"
          message="Agora você já pode entrar na sua conta e aproveitar nossas melhores funcionalidades!"
          buttonText="Acessar agora"
          onConfirm={() => {
            setShowSuccess(false);
            onRegisterComplete(); // Notify parent
            navigate('/');
          }}
        />
      )}

      {showError && (
        <StatusModal
          type="error"
          title="Algo deu errado"
          message={errorMessage}
          buttonText="Tentar novamente"
          onConfirm={() => setShowError(false)}
        />
      )}

      {showAlreadyRegistered && (
        <ConfirmModal
          type="warning"
          title="Conta já cadastrada!"
          message="Você já possui um cadastro com esse e-mail ou CPF. Tente recuperar sua conta para acessar nossa plataforma!"
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
