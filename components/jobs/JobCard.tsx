
import React from 'react';
import { MapPin, DollarSign, Clock, Briefcase, Calendar } from 'lucide-react';

interface Job {
    id: string;
    title: string;
    company_name?: string; // We might need to join with companies table
    location: string;
    salary_min: number;
    salary_max: number;
    type: string;
    created_at: string;
    match_score?: number; // Simulated matching score for now
}

interface JobCardProps {
    job: Job;
    isSelected?: boolean;
    onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isSelected, onClick }) => {
    // Format salary
    const formatSalary = (min: number, max: number) => {
        if (!min && !max) return 'A combinar';
        if (min && max) return `R$ ${min} - ${max}`;
        return `R$ ${min || max}`;
    };

    // Format time (simple version, ideally use date-fns)
    const daysAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    };

    const score = job.match_score || Math.floor(Math.random() * 40) + 60; // Mock score between 60-100 if missing
    let scoreColor = 'bg-blue-100 text-blue-700 border-blue-200';
    if (score < 70) scoreColor = 'bg-orange-100 text-orange-700 border-orange-200';
    if (score > 85) scoreColor = 'bg-blue-50 text-[#5AB7F7] border-[#5AB7F7]/30'; // Light blue like design

    return (
        <div
            onClick={onClick}
            className={`bg-white rounded-[20px] p-6 cursor-pointer transition-all border border-gray-100 shadow-sm hover:shadow-md 
        ${isSelected ? 'ring-2 ring-[#F04E23] shadow-lg' : ''}
      `}
        >
            <div className="flex items-start gap-4 mb-4">
                {/* Placeholder Logo */}
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {(job.company_name || 'C').charAt(0)}
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-lg text-[#1E3A8A] leading-tight mb-1">{job.title}</h3>
                    <p className="text-gray-500 text-sm font-medium">{job.company_name || 'Empresa'}</p>
                </div>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-[#5AB7F7]" />
                    <span className="capitalize">{job.type === 'onsite' ? 'Presencial' : job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-[#5AB7F7]" />
                    <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#5AB7F7]" />
                    <span>Período flexível</span>
                </div>
            </div>

            {/* Match Badge */}
            <div className={`rounded-full px-4 py-1.5 text-xs font-bold border w-fit mb-4 ${scoreColor}`}>
                {score}% de aderência
            </div>

            <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
                <span className="text-[#F04E23] font-bold text-sm hover:underline">Ver mais</span>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <Calendar size={14} />
                    <span>{daysAgo(job.created_at)}</span>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
