import React, { useState } from 'react';
import { X, CreditCard, Box, ScanLine, Check } from 'lucide-react';
import BoletoModal from './BoletoModal';
import { useNavigate } from 'react-router-dom';

interface PaymentMethodModalProps {
    onClose: () => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ onClose }) => {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState<'credit' | 'pix' | 'boleto' | null>(null);
    const [showBoleto, setShowBoleto] = useState(false);

    const handleContinue = () => {
        if (selectedMethod === 'boleto') {
            setShowBoleto(true);
        } else if (selectedMethod) {
            // Mock success for other methods
            navigate('/company/dashboard');
        }
    };

    if (showBoleto) {
        return <BoletoModal onClose={onClose} onBack={() => setShowBoleto(false)} />;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[500px] rounded-[32px] overflow-hidden shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                </button>

                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1D4ED8] mb-6">
                    <span className="font-bold text-xl">$</span>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-2">Método de pagamento</h3>
                <p className="text-gray-500 font-medium text-[15px] mb-8">
                    Escolha abaixo com qual método de pagamento deseja prosseguir.
                </p>

                <div className="space-y-4 mb-10">
                    {/* Credit Card */}
                    <div
                        onClick={() => setSelectedMethod('credit')}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all group ${selectedMethod === 'credit' ? 'border-[#F04E23] ring-2 ring-orange-50 bg-orange-50/20' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                                <CreditCard size={20} />
                            </div>
                            <span className="font-bold text-gray-700">Cartão de crédito</span>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedMethod === 'credit' ? 'bg-[#F04E23] border-[#F04E23]' : 'border-gray-300'}`}>
                            {selectedMethod === 'credit' && <Check size={14} className="text-white" />}
                        </div>
                    </div>

                    {/* Pix */}
                    <div
                        onClick={() => setSelectedMethod('pix')}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all group ${selectedMethod === 'pix' ? 'border-[#F04E23] ring-2 ring-orange-50 bg-orange-50/20' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                                <Box size={20} className="rotate-45" />
                            </div>
                            <span className="font-bold text-gray-700">Pix</span>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedMethod === 'pix' ? 'bg-[#F04E23] border-[#F04E23]' : 'border-gray-300'}`}>
                            {selectedMethod === 'pix' && <Check size={14} className="text-white" />}
                        </div>
                    </div>

                    {/* Boleto */}
                    <div
                        onClick={() => setSelectedMethod('boleto')}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all group ${selectedMethod === 'boleto' ? 'border-[#F04E23] ring-2 ring-orange-50 bg-orange-50/20' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600">
                                <ScanLine size={20} />
                            </div>
                            <span className="font-bold text-gray-700">Boleto bancário</span>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedMethod === 'boleto' ? 'bg-[#F04E23] border-[#F04E23]' : 'border-gray-300'}`}>
                            {selectedMethod === 'boleto' && <Check size={14} className="text-white" />}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={handleContinue}
                        className={`flex-1 py-3.5 bg-[#F04E23] text-white font-bold rounded-xl transition-all shadow-lg ${!selectedMethod ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:bg-[#E03E13] shadow-orange-500/20'}`}
                        disabled={!selectedMethod}
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodModal;
