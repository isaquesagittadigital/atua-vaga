import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../../ui/MetricCard';
import CandidateMatchCard from '../../ui/CandidateMatchCard';
import { useAuth } from '../../../src/contexts/AuthContext';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { session } = useAuth();

    const [metrics, setMetrics] = useState({
        openJobs: 0,
        closedJobs: 0,
        inProgressJobs: 0,
        totalJobs: 0,
        hired: 0,
        talentPool: 0
    });

    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return;

            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
                const headers = { 'Authorization': `Bearer ${session.access_token}` };

                const [metricsRes, matchesRes] = await Promise.all([
                    fetch(`${apiUrl}/dashboard/metrics`, { headers }),
                    fetch(`${apiUrl}/candidates/matches`, { headers })
                ]);

                if (metricsRes.ok) {
                    const metricsData = await metricsRes.json();
                    setMetrics(metricsData);
                }

                if (matchesRes.ok) {
                    const matchesData = await matchesRes.json();
                    setMatches(matchesData);
                }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session]);

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
                <MetricCard title="Vagas abertas" value={metrics.openJobs.toString()} percentage={0} trend="neutral" />
                <MetricCard title="Vagas fechadas" value={metrics.closedJobs.toString()} percentage={0} trend="neutral" />
                <MetricCard title="Vagas em andamento" value={metrics.inProgressJobs.toString()} percentage={0} trend="neutral" />

                <MetricCard title="Vagas cadastradas" value={metrics.totalJobs.toString()} percentage={0} trend="up" />
                <MetricCard title="Contratados" value={metrics.hired.toString()} percentage={0} trend="neutral" />
                <MetricCard title="Banco de talentos" value={metrics.talentPool.toString()} percentage={0} trend="neutral" />
            </div>

            {/* Tempo Médio Chart Card (Full Width or larger) */}
            <div className="mb-12 grid grid-cols-1 lg:grid-cols-3">
                <MetricCard title="Tempo médio de contratação" value="7 dias" percentage={0} trend="neutral" chartColor="#EF4444" isRed />
            </div>

            {/* Candidate Matches Section (Visual separator) */}
            <div className="border-t border-gray-100 pt-10">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Candidatos Sugeridos</h2>
                <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-6">
                    {matches.map((match, index) => (
                        <CandidateMatchCard
                            key={index}
                            role={match.role}
                            matchPercentage={match.matchPercentage}
                            companyRef={match.companyRef}
                        />
                    ))}
                    {matches.length === 0 && !loading && (
                        <p className="text-gray-500">Nenhum candidato sugerido no momento.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
