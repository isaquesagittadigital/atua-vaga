
import React from 'react';
import { Check } from 'lucide-react';

interface StatusModalProps {
  type: 'success' | 'warning';
  title: string;
  message: string;
  buttonText: string;
  onConfirm: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({ title, message, buttonText, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[400px] rounded-3xl overflow-hidden shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-[#D1FAE5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-8">
          <Check size={32} strokeWidth={3} />
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-8 px-4">
          {message}
        </p>
        
        <button 
          onClick={onConfirm}
          className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-bold rounded-xl transition-all shadow-md shadow-orange-100"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default StatusModal;
