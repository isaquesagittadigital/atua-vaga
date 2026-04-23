import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, MapPin, Info, ExternalLink, User } from 'lucide-react';

interface CandidateMatchCardProps {
    id: string;
    role: string;
    companyRef?: string; // This is the Name
    matchPercentage: number;
    location?: string;
    imgUrl?: string;
    age?: number;
}

const CandidateMatchCard: React.FC<CandidateMatchCardProps> = ({ 
    id,
    role, 
    companyRef, 
    matchPercentage,
    location = 'Brasil',
    imgUrl,
    age = 25
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-8 max-w-md">
            {/* Left side: Avatar and Name */}
            <div className="flex flex-col items-center gap-4 shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-50 shadow-sm bg-gray-50 flex items-center justify-center">
                    {imgUrl ? (
                        <img src={imgUrl} alt={companyRef} className="w-full h-full object-cover" />
                    ) : (
                        <User size={32} className="text-gray-300" />
                    )}
                </div>
                <h3 className="font-bold text-gray-800 text-center max-w-[120px] leading-tight">
                    {companyRef || 'Usuário'}
                </h3>
            </div>

            {/* Right side: Info and Link */}
            <div className="flex flex-col gap-4 flex-1">
                {/* Details List */}
                <div className="space-y-2.5 mt-2">
                    <div className="flex items-center gap-2.5 text-gray-600">
                        <Briefcase size={18} className="text-gray-700" />
                        <span className="text-sm font-medium">{role}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                        <Calendar size={18} className="text-gray-700" />
                        <span className="text-sm font-medium">{age} anos</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                        <MapPin size={18} className="text-gray-700" />
                        <span className="text-sm font-medium">{location}</span>
                    </div>
                </div>

                {/* View Link */}
                <div className="mt-auto pt-2">
                    <button 
                        onClick={() => navigate(`/company/candidates/${id}`)}
                        className="flex items-center gap-2 text-[#C0421D] font-bold hover:underline transition-colors"
                    >
                        Ver candidato
                        <ExternalLink size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateMatchCard;
