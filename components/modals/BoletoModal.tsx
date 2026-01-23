import React from 'react';
import { X, Copy, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BoletoModalProps {
    onClose: () => void;
    onBack: () => void;
}

const BoletoModal: React.FC<BoletoModalProps> = ({ onClose, onBack }) => {
    const navigate = useNavigate();

    const handleFinish = () => {
        // Navigate to company dashboard after payment completion/simulation
        navigate('/company/dashboard');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[450px] rounded-[32px] overflow-hidden shadow-2xl p-8 animate-in zoom-in-95 duration-300 relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={24} />
                </button>

                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#1D4ED8] mb-6">
                    <ScanLine size={24} />
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-2">Boleto</h3>
                <p className="text-gray-500 font-medium text-[15px] mb-8">
                    Escaneie o QR Code ou copie o código abaixo para efetuar o pagamento.
                </p>

                <div className="flex justify-center mb-8">
                    <div className="p-4 border-2 border-[#F04E23] rounded-2xl">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AtuaVagaBoletoExamples" alt="QR Code Boleto" className="w-[150px] h-[150px]" />
                    </div>
                </div>

                <button className="flex items-center justify-center gap-2 text-[#F04E23] font-black text-sm hover:underline mx-auto mb-10">
                    <Copy size={16} /> Copiar código do Boleto
                </button>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex-1 py-3.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={handleFinish}
                        className="flex-1 py-3.5 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20"
                    >
                        Finalizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoletoModal;
