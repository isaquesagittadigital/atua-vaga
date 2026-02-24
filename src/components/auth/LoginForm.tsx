
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
  const { signInWithPassword } = useAuth();

  const [formData, setFormData] = useState<any>({
    cpf: '',
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
          {/* Email Field (Unified for now for Supabase simplicity) */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider">E-mail</label>
            <input
              type="email"
              placeholder={loginType === 'candidate' ? "seu@email.com" : "empresa@sagittadigital.com.br"}
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
                placeholder="************"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className={inputClasses}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
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
            className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-100 text-[16px]"
          >
            {loading ? 'Acessando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[13px] text-gray-500 font-medium">
            Não tem uma conta? <button onClick={onRegister} className="text-gray-900 font-black hover:underline underline-offset-4 transition-all">Registre-se agora!</button>
          </p>
        </div>


      </div>
    </div>
  );
};

export default LoginForm;
