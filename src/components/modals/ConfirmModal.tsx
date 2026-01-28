
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Não", 
  cancelText = "Sim",
  type = "danger"
}) => {
  const isWarning = type === 'warning';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-[#FEF3C7] text-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle size={32} strokeWidth={2} />
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">{title}</h3>
        <p className="text-gray-500 text-[14px] leading-relaxed mb-10 px-4">
          {message}
        </p>
        
        <div className="space-y-3">
          {isWarning ? (
            <>
              <button 
                onClick={onConfirm}
                className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-bold rounded-xl transition-all shadow-md shadow-orange-100"
              >
                {confirmText === "Não" ? "Recuperar acesso" : confirmText}
              </button>
              <button 
                onClick={onCancel}
                className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all"
              >
                {cancelText === "Sim" ? "Voltar" : cancelText}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onCancel}
                className="w-full py-4 bg-[#F04E23] hover:bg-[#E03E13] text-white font-bold rounded-xl transition-all shadow-md shadow-orange-100"
              >
                {confirmText}
              </button>
              <button 
                onClick={onConfirm}
                className="w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all border border-gray-100"
              >
                {cancelText}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
