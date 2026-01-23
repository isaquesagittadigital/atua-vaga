
import React from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
    onClose: () => void;
    onGoToJobs: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, onGoToJobs }) => {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] w-full max-w-sm p-8 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <Check size={40} strokeWidth={3} />
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-2">Alerta salvo!</h2>
                <p className="text-gray-500 font-medium mb-8">
                    Alerta de vagas foi salvo com sucesso!
                </p>

                <div className="w-full space-y-3">
                    <button
                        onClick={onGoToJobs}
                        className="w-full py-3.5 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d63f15] transition-colors shadow-lg shadow-orange-500/20"
                    >
                        Ir para Vagas
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-[#566D8F] font-bold text-sm hover:text-gray-900 transition-colors"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
