import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

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
  confirmText = "Sim, excluir", 
  cancelText = "Cancelar",
  type = "danger"
}) => {
  const isDanger = type === 'danger';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[400px] rounded-[32px] overflow-hidden shadow-2xl p-10 text-center animate-in zoom-in-95 duration-300">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ${isDanger ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
          {isDanger ? <Trash2 size={40} /> : <AlertTriangle size={40} />}
        </div>
        
        <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight tracking-tight">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium">
          {message}
        </p>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className={`w-full py-4 font-black rounded-2xl transition-all shadow-lg hover:-translate-y-0.5 active:scale-95 ${
              isDanger 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-100' 
                : 'bg-[#F04E23] hover:bg-[#E03E13] text-white shadow-orange-100'
            }`}
          >
            {confirmText}
          </button>
          
          <button 
            onClick={onCancel}
            className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-400 font-bold rounded-2xl transition-all active:scale-95"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
