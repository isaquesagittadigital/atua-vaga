import React from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../../ui/MetricCard';
import CandidateMatchCard from '../../ui/CandidateMatchCard';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-[1400px] w-full mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-3xl font-black text-gray-900">Indicadores</h1>
                <button
                    onClick={() => navigate('/company/onboarding')}
                    className="px-6 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                    Perguntas técnicas
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <MetricCard title="Vagas abertas" value="32" percentage={40} trend="up" />
                <MetricCard title="Vagas fechadas" value="48" percentage={40} trend="up" />
                <MetricCard title="Vagas em andamento" value="22" percentage={40} trend="up" />

                <MetricCard title="Vagas cadastradas" value="100" percentage={40} trend="up" />
                <MetricCard title="Contratados" value="5" percentage={40} trend="up" />
                <MetricCard title="Banco de talentos" value="50" percentage={40} trend="up" />
            </div>

            {/* Tempo Médio Chart Card (Full Width or larger) */}
            <div className="mb-12 grid grid-cols-1 lg:grid-cols-3">
                <MetricCard title="Tempo médio de contratação" value="7 dias" percentage={10} trend="down" chartColor="#EF4444" isRed />
            </div>

            {/* Candidate Matches Section (Visual separator) */}
            <div className="border-t border-gray-100 pt-10">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Candidatos Sugeridos</h2>
                <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-6">
                    <CandidateMatchCard role="Pessoa Recursos Humanos" matchPercentage={90} />
                    <CandidateMatchCard role="Pessoa Recursos Humanos" matchPercentage={90} />
                    <CandidateMatchCard role="Analista de RH" matchPercentage={85} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
