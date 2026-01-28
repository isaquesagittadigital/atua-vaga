import React from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    buttonText: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, description, buttonText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] p-8 md:p-12 w-full max-w-[480px] flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Success Icon */}
                <div className="w-24 h-24 bg-[#E0F2F1] rounded-full flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-[#00BFA5] rounded-full flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                        <Check size={32} strokeWidth={3} />
                    </div>
                </div>

                {/* Text Content */}
                <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed max-w-[300px]">
                    {description}
                </p>

                {/* Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-[#F04E23] text-white font-black py-4 rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
