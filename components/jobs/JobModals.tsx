
import React from 'react';
import { TriangleAlert, CheckCircle2, X } from 'lucide-react';

// --- Shared Components ---

const ModalOverlay: React.FC<{ children: React.ReactNode, onClose: () => void }> = ({ children, onClose }) => (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            {children}
        </div>
    </div>
);

const PrimaryButton: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="w-full bg-[#F04E23] text-white font-bold py-3.5 rounded-xl hover:bg-[#d63f16] transition-colors mb-3 shadow-[0_4px_14px_rgba(240,78,35,0.25)]"
    >
        {children}
    </button>
);

const SecondaryButton: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
    <button
        onClick={onClick}
        className="w-full text-gray-500 font-bold py-2 hover:text-gray-700 transition-colors"
    >
        {children}
    </button>
);

// --- 1. Behavioral Test Warning ---
export const BehavioralTestModal: React.FC<{ onRespond: () => void, onLater: () => void }> = ({ onRespond, onLater }) => (
    <ModalOverlay onClose={onLater}>
        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#FEF3C7] rounded-full flex items-center justify-center mb-6 text-[#D97706]">
                <TriangleAlert size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Teste comportamental</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
                Responda o teste comportamental para finalizar sua candidatura.
            </p>
            <PrimaryButton onClick={onRespond}>Responder agora</PrimaryButton>
            <SecondaryButton onClick={onLater}>Responder mais tarde</SecondaryButton>
        </div>
    </ModalOverlay>
);

// --- 2. Low Profile Match Warning ---
export const LowMatchModal: React.FC<{ onApply: () => void, onEdit: () => void, onClose: () => void }> = ({ onApply, onEdit, onClose }) => (
    <ModalOverlay onClose={onClose}>
        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#FEF3C7] rounded-full flex items-center justify-center mb-6 text-[#D97706]">
                <TriangleAlert size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Fora do perfil da vaga</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                Suas informações profissionais não estão alinhadas com o perfil buscado pela empresa.
            </p>
            <PrimaryButton onClick={onApply}>Candidatar-se</PrimaryButton>
            <SecondaryButton onClick={onEdit}>Editar currículo</SecondaryButton>
        </div>
    </ModalOverlay>
);

// --- 3. Report Success Modal ---
export const ReportSuccessModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <ModalOverlay onClose={onClose}>
        <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center mb-6 text-[#16A34A]">
                <CheckCircle2 size={32} strokeWidth={3} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Vaga denunciada</h3>
            <p className="text-gray-600 mb-8">
                A vaga foi denunciada com sucesso!
            </p>
            <PrimaryButton onClick={onClose}>Ir para Vagas</PrimaryButton>
            <SecondaryButton onClick={onClose}>Fechar</SecondaryButton>
        </div>
    </ModalOverlay>
);

// --- 4. Report Form Modal ---
export const ReportFormModal: React.FC<{ onSubmit: () => void, onCancel: () => void }> = ({ onSubmit, onCancel }) => (
    <ModalOverlay onClose={onCancel}>
        <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Denunciar vaga</h3>

            <div className="space-y-4 mb-8">
                {['Falsa', 'Discriminatória', 'Inexistente', 'Suspeita', 'Informações falsas', 'Empresa não existe'].map((item) => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#F04E23] focus:ring-[#F04E23]" />
                        <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{item}</span>
                    </label>
                ))}
            </div>

            <div className="flex gap-4 text-sm text-gray-400 mb-6 cursor-pointer hover:text-gray-600">
                <span>Selecionar todos</span>
                <span>|</span>
                <span>Limpar</span>
            </div>

            <PrimaryButton onClick={onSubmit}>Denunciar vaga</PrimaryButton>
            <SecondaryButton onClick={onCancel}>Voltar</SecondaryButton>
        </div>
    </ModalOverlay>
);
