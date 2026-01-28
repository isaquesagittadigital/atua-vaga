import React from 'react';
import { Building2, DollarSign, Clock, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
    id?: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    contractType: string;
    benefits?: string;
    postedAt: string;
    logoUrl?: string;
    onView?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
    id, title, company, location, salary, contractType, benefits, postedAt, logoUrl
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 hover:shadow-lg transition-all shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col group h-full">
            <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                    {logoUrl ? <img src={logoUrl} alt={company} className="w-full h-full object-cover" /> : <span className="text-xl font-black text-blue-600">C</span>}
                </div>
                <div>
                    <h3 className="font-black text-[#1D4ED8] text-lg leading-tight group-hover:text-[#F04E23] transition-colors line-clamp-2">{title}</h3>
                    <p className="text-gray-500 text-sm font-medium mt-1">{company}</p>
                </div>
            </div>

            <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <MapPin size={18} className="text-blue-400 shrink-0" />
                    {location}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <DollarSign size={18} className="text-blue-400 shrink-0" />
                    <span className="text-orange-500 font-bold">{salary}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                    <Clock size={18} className="text-blue-400 shrink-0" />
                    {contractType}
                </div>
                {benefits && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                        <Building2 size={18} className="text-blue-400 shrink-0" />
                        {benefits}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <button
                    onClick={() => navigate(`/company/jobs/${id || '1'}`)}
                    className="text-[#F04E23] font-bold text-sm hover:underline"
                >
                    Ver mais
                </button>
                <span className="text-gray-400 text-xs font-bold flex items-center gap-1">
                    <Calendar size={14} /> {postedAt}
                </span>
            </div>
        </div>
    );
};

export default JobCard;
