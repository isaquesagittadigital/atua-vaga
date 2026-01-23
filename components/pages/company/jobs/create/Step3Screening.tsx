import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface StepProps {
    data: any;
    onUpdate: (data: any) => void;
    onFinish: () => void;
    onBack: () => void;
    loading?: boolean;
}

const Step3Screening: React.FC<StepProps> = ({ data, onUpdate, onFinish, onBack, loading }) => {
    // We synchronize local questions with parent state if needed, or just use parent state.
    // For simplicity, let's keep local state but allow it to update parent on change?
    // Actually, let's just use the props directly if we want to persist it across step navigation.
    // But refactoring the internal logic is tricky with the time.
    // Let's just update the interface to accept the props so it doesn't crash CreateJobPage.

    const [questions, setQuestions] = useState(data.questions || [
        "Quem são suas referências? Cite três pessoas que você acompanha",
        "Como é a sua rotina hoje? Descreva como você organiza o seu dia de trabalho.",
        "O que está buscando atualmente para sua carreira?",
        "Agora fale pra gente porque deveríamos trazer você pro time!"
    ]);
    const [newQuestion, setNewQuestion] = useState("");

    const handleAdd = () => {
        if (newQuestion.trim()) {
            setQuestions([...questions, newQuestion]);
            setNewQuestion("");
        }
    };

    const handleRemove = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500">

            <div className="mb-10">
                <label className="block text-xs text-gray-500 mb-1.5">Nova pergunta</label>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Crie uma pergunta para o canditato"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#F04E23] text-sm"
                    />
                    <button
                        onClick={handleAdd}
                        className="px-4 py-3 bg-[#F04E23] text-white rounded-xl hover:bg-[#E03E13] transition-colors shadow-lg shadow-orange-500/20"
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-start justify-between group">
                        <p className="text-sm text-gray-600 font-medium pr-4">{q}</p>
                        <button
                            onClick={() => handleRemove(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-end gap-4 border-t border-gray-50 pt-6">
                <button onClick={onBack} className="px-8 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                    Voltar
                </button>
                <button
                    onClick={onFinish}
                    disabled={loading}
                    className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                    {loading ? 'Publicando...' : 'Finalizar'}
                </button>
            </div>
        </div>
    );
};

export default Step3Screening;
