
import React from 'react';
import { X, Check } from 'lucide-react';

interface JobAlertModalProps {
    onClose: () => void;
    onSave: () => void;
}

const JobAlertModal: React.FC<JobAlertModalProps> = ({ onClose, onSave }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] w-full max-w-lg p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Alerta de vagas</h2>
                    {/* <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button> */}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <select className="w-full p-3 rounded-xl border border-gray-200 text-gray-600 bg-white focus:outline-none focus:border-[#F04E23]">
                            <option>Modelo de trabalho</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <select className="w-full p-3 rounded-xl border border-gray-200 text-gray-600 bg-white focus:outline-none focus:border-[#F04E23]">
                            <option>Km de você</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <select className="w-full p-3 rounded-xl border border-gray-200 text-gray-600 bg-white focus:outline-none focus:border-[#F04E23]">
                            <option>Publicação</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <select className="w-full p-3 rounded-xl border border-gray-200 text-gray-600 bg-white focus:outline-none focus:border-[#F04E23]">
                            <option>Salário</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <select className="w-full p-3 rounded-xl border border-gray-200 text-gray-600 bg-white focus:outline-none focus:border-[#F04E23]">
                            <option>Área</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <select className="w-full p-3 rounded-xl border border-gray-200 text-gray-600 bg-white focus:outline-none focus:border-[#F04E23]">
                            <option>Contrato</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="w-[48%]">
                        <select className="w-full p-3 rounded-xl border border-gray-200 text-gray-600 bg-white focus:outline-none focus:border-[#F04E23]">
                            <option>PCD</option>
                        </select>
                    </div>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-full text-sm hover:bg-gray-300 transition-colors">
                        Resetar filtros
                    </button>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onSave}
                        className="w-full py-3.5 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d63f15] transition-colors shadow-lg shadow-orange-500/20"
                    >
                        Salvar alterações
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-[#566D8F] font-bold text-sm hover:text-gray-900 transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobAlertModal;
