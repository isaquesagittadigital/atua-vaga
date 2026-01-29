import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

interface TestSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TestSuccessModal: React.FC<TestSuccessModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[500px] rounded-[48px] overflow-hidden shadow-2xl p-16 text-center animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 bg-[#EBFBF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-10">
                    <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white">
                        <Check size={40} strokeWidth={4} />
                    </div>
                </div>

                <h3 className="text-4xl font-black text-gray-900 mb-6 tracking-tight leading-none">Teste concluído</h3>
                <p className="text-gray-500 text-lg leading-relaxed mb-12 px-4 font-bold">
                    Volte para página inicial e aplique para as vagas mais alinhadas ao seu perfil.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/app/jobs')}
                        className="w-full py-5 bg-[#F04E23] hover:bg-[#E03E13] text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-100 text-xl"
                    >
                        Ir para Vagas
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-4 text-gray-500 font-black text-xl hover:text-gray-900 transition-all"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestSuccessModal;
