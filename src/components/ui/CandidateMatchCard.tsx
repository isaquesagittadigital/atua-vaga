import React from 'react';
import { Building2, DollarSign, Clock, Gift, Calendar, User } from 'lucide-react';

interface CandidateMatchCardProps {
    role: string;
    companyRef?: string;
    matchPercentage: number;
    location?: string;
    imgUrl?: string;
}

const CandidateMatchCard: React.FC<CandidateMatchCardProps> = ({ 
    role, 
    companyRef, 
    matchPercentage,
    location = 'Remoto',
    imgUrl 
}) => {
    return (
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] min-w-[320px] flex-1 border-l-4 border-l-blue-500 hover:shadow-lg transition-all group">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 overflow-hidden shrink-0">
                    {imgUrl ? (
                        <img src={imgUrl} alt={companyRef} className="w-full h-full object-cover" />
                    ) : (
                        <User size={24} />
                    )}
                </div>
                <div>
                    <h3 className="font-black text-[#1D4ED8] text-lg leading-tight group-hover:text-[#F04E23] transition-colors line-clamp-1">{role}</h3>
                    <p className="text-gray-500 text-sm font-medium mt-1 line-clamp-1">{companyRef || 'Candidato'}</p>
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <Building2 size={18} className="text-blue-400" />
                    {location}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <DollarSign size={18} className="text-blue-400" />
                    <span className="text-orange-500 font-bold">A combinar</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <Clock size={18} className="text-blue-400" />
                    Período flexível
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <Gift size={18} className="text-blue-400" />
                    VR/VT
                </div>
            </div>

            <div className="flex items-center justify-center mb-6">
                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-full border border-blue-100">
                    {matchPercentage}% de aderência
                </span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <button className="text-[#F04E23] font-bold text-sm hover:underline">Ver perfil</button>
                <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                    <Calendar size={14} /> Ativo agora
                </span>
            </div>
        </div>
    );
};

export default CandidateMatchCard;
