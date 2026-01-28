
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../../../ui/Icons';

interface Step1Props {
    onNext: () => void;
    onGoogleLogin: () => void;
    data: any;
    updateData: (data: any) => void;
}

const Step1Account: React.FC<Step1Props> = ({ onNext, onGoogleLogin, data, updateData }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Cadastrar</h2>
                <p className="text-gray-500 font-medium text-sm">Insira suas informações para realizar o cadastro.<br />Levará menos de 1 minuto!</p>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">E-mail corporativo</label>
                    <div className="relative">
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => updateData({ email: e.target.value })}
                            placeholder="seu@email.com"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all font-medium"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Senha</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={(e) => updateData({ password: e.target.value })}
                            placeholder="**********"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all font-medium pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Confirmar senha</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.confirmPassword}
                            onChange={(e) => updateData({ confirmPassword: e.target.value })}
                            placeholder="**********"
                            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all font-medium pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-xl transition-all shadow-lg shadow-orange-500/20 text-[15px] mt-4"
                >
                    Continuar
                </button>

                <div className="text-center">
                    <p className="text-sm font-bold text-gray-500">
                        Já tem uma conta? <a href="/auth/login" className="text-gray-900 hover:text-[#F04E23] transition-colors">Entre agora!</a>
                    </p>
                </div>

                <button
                    onClick={onGoogleLogin}
                    className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-3 mt-4"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                    Entrar com Google
                </button>
            </div>
        </div>
    );
};

export default Step1Account;
