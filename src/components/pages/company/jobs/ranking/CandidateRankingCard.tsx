import React from 'react';

interface CandidateRankingCardProps {
    name: string;
    role: string;
    age: number;
    location: string;
    imgUrl?: string;
    matchPercentage: number;
    onView?: () => void;
}

const CandidateRankingCard: React.FC<CandidateRankingCardProps> = ({ name, role, age, location, imgUrl, matchPercentage, onView }) => {
    // Determine badge color based on match
    const badgeColor = matchPercentage >= 90 ? 'bg-blue-50 text-blue-600 border-blue-100'
        : matchPercentage >= 70 ? 'bg-orange-50 text-orange-600 border-orange-100'
            : 'bg-red-50 text-red-600 border-red-100';

    return (
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow gap-4">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden shrink-0">
                    <img src={imgUrl || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150"} alt={name} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                    <p className="text-gray-500 text-sm font-medium">{role} • {age} anos • {location}</p>
                </div>
            </div>

            <div className="flex flex-col items-end gap-3 self-stretch sm:self-auto justify-between sm:justify-start">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                    {matchPercentage}% de aderência
                </span>
                <button
                    onClick={onView}
                    className="text-[#F04E23] text-sm font-bold hover:underline"
                >
                    Ver candidato
                </button>
            </div>
        </div>
    );
};

export default CandidateRankingCard;
