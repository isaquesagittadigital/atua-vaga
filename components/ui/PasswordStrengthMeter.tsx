
import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
    password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
    const requirements = [
        { label: "Mínimo 8 caracteres", test: (p: string) => p.length >= 8 },
        { label: "Letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
        { label: "Letra minúscula", test: (p: string) => /[a-z]/.test(p) },
        { label: "Caractere especial (@$!%*?&)", test: (p: string) => /[\W_]/.test(p) }, // \W matches any non-word character
        { label: "Número", test: (p: string) => /[0-9]/.test(p) },
    ];

    return (
        <div className="mt-3 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                Requisitos da senha:
            </p>
            <div className="space-y-1.5">
                {requirements.map((req, index) => {
                    const isValid = req.test(password);
                    return (
                        <div key={index} className="flex items-center gap-2">
                            <div className={`
                                w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300
                                ${isValid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
                            `}>
                                {isValid ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
                            </div>
                            <span className={`text-[12px] font-medium transition-colors ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
                                {req.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PasswordStrengthMeter;
