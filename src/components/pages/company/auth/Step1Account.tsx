import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface Step1Props {
    onNext: () => void;
    onGoogleLogin: () => void;
    data: any;
    updateData: (data: any) => void;
}

const Step1Account: React.FC<Step1Props> = ({ onNext, onGoogleLogin, data, updateData }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const inputClasses = "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all font-medium text-[15px]";
    const labelClasses = "block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wider";

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Cadastrar</h2>
                <p className="text-gray-500 font-bold text-[13px] leading-relaxed">Crie sua conta corporativa para começar a contratar talentos de forma inteligente.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className={labelClasses}>E-mail corporativo</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => updateData({ email: e.target.value })}
                        placeholder="seu@empresa.com"
                        className={inputClasses}
                    />
                </div>

                <div>
                    <label className={labelClasses}>Senha</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) => updateData({ password: e.target.value })}
                            placeholder="Mínimo 8 caracteres"
                            className={`${inputClasses} pr-12`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Confirmar senha</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.confirmPassword}
                            onChange={(e) => updateData({ confirmPassword: e.target.value })}
                            placeholder="Repita sua senha"
                            className={`${inputClasses} pr-12`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-100 text-[16px] transform hover:-translate-y-1 active:translate-y-0 mt-4"
                >
                    Continuar
                </button>

                <div className="text-center mt-6">
                    <p className="text-[13px] text-gray-500 font-medium">
                        Já tem uma conta? <a href="/auth/company/login" className="text-gray-900 font-black hover:underline underline-offset-4 transition-all">Entre agora!</a>
                    </p>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <button
                        onClick={onGoogleLogin}
                        className="w-full py-3.5 border border-gray-200 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all text-[15px] group"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                        Entrar com Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step1Account;
