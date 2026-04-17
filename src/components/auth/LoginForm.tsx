
import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';

import { formatCPF } from '@/utils/validators';
import { LoginFormData, FormErrors } from '../types';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onForgotPassword: () => void;
  onRegister: () => void;
  onLoginSuccess: () => void;
  loginType?: 'candidate' | 'company';
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onRegister, onLoginSuccess, loginType = 'candidate' }) => {
  const { signInWithPassword, signInWithGoogle } = useAuth();

  const [formData, setFormData] = useState<any>({
    cpf: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      console.error("Google login failed", err);
      setErrors({ general: 'Falha ao entrar com Google.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({ ...prev, cpf: formatted }));
    if (errors.cpf) setErrors(prev => ({ ...prev, cpf: undefined }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, email: e.target.value }));
    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await signInWithPassword(formData.email, formData.password);

      // Fetch profile to determine redirect destination
      const { data: { user } } = await (await import('@/lib/supabase')).supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await (await import('@/lib/supabase')).supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileData) {
          const role = profileData.role;
          if (role === 'admin' || role === 'super_admin') {
            window.location.href = '/admin/dashboard';
            return;
          }
          if (role === 'company' || role === 'company_admin' || role === 'company_user') {
            window.location.href = '/company/dashboard';
            return;
          }
        }
      }

      // Default: candidate
      window.location.href = '/app/dashboard';
    } catch (err: any) {
      console.error(err);
      setErrors({ general: 'Falha no login. Verifique suas credenciais.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all text-[15px]";

  return (
    <div className="w-full max-w-[450px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white px-10 py-12 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Entrar</h2>
        <p className="text-gray-500 text-[13px] mb-8 font-medium">Faça login para explorar nossas funcionalidades!</p>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* CPF Field */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">CPF</label>
            <input
              type="text"
              placeholder="Informe somente o número"
              value={formData.email}
              onChange={handleEmailChange}
              className={inputClasses}
              required
            />
            {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Informe sua senha"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showPassword ? <Eye size={20} strokeWidth={1.5} /> : <EyeOff size={20} strokeWidth={1.5} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
          </div>

          {/* Options Row */}
          <div className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={formData.rememberMe}
                onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                className="w-4 h-4 border-gray-300 rounded text-[#F04E23] focus:ring-[#F04E23]"
              />
              <label htmlFor="remember" className="text-gray-600 font-bold cursor-pointer">Manter logado</label>
            </div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-gray-500 font-bold hover:text-[#F04E23] transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-100 text-[16px] transform hover:-translate-y-1 active:translate-y-0"
          >
            {loading ? 'Acessando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[13px] text-gray-500 font-medium">
            Não tem uma conta? <button onClick={onRegister} className="text-gray-900 font-black hover:underline underline-offset-4 transition-all">Registre-se agora!</button>
          </p>
        </div>

        {/* Google Login Button */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 border border-gray-200 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all text-[15px] group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            Entrar com Google
          </button>
        </div>


      </div>
    </div>
  );
};

export default LoginForm;
