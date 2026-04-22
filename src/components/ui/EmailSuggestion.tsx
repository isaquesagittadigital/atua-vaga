
import React from 'react';
import { Sparkles } from 'lucide-react';

interface EmailSuggestionProps {
  suggestion: string;
  onApply: (suggestion: string) => void;
}

const EmailSuggestion: React.FC<EmailSuggestionProps> = ({ suggestion, onApply }) => {
  return (
    <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-300">
      <button
        type="button"
        onClick={() => onApply(suggestion)}
        className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg text-left group transition-all hover:bg-orange-100"
      >
        <Sparkles size={14} className="text-[#F04E23] animate-pulse" />
        <span className="text-[12px] font-bold text-gray-500">
          Você quis dizer <span className="text-[#F04E23] font-black group-hover:underline">{suggestion}</span>?
        </span>
      </button>
    </div>
  );
};

export default EmailSuggestion;
