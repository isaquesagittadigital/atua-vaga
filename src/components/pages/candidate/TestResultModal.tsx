import React from 'react';
import { Trophy, ChevronLeft } from 'lucide-react';
import { CandidateFooter } from '../../layout/candidate/CandidateFooter';
import { useAuth } from '@/contexts/AuthContext';

interface TestResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    testTitle: string;
    scores: Record<string, number>; // e.g., { 'Confiança': 80, 'Modéstia': 20 }
}

const TestResultModal: React.FC<TestResultModalProps> = ({ isOpen, onClose, testTitle, scores }) => {
    const { user, profile } = useAuth();
    if (!isOpen) return null;

    const scoreValues = Object.values(scores);
    const averageScore = scoreValues.length > 0
        ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
        : 0;

    // Hardcoded descriptions for now based on Image 3
    const descriptions: Record<string, string> = {
        'Confiança': 'Pessoas com alta confiança tendem a delegar com mais facilidade e trabalhar bem em equipe, mas podem ser mais vulneráveis a decepções se não forem cautelosas.',
        'Fraqueza': 'A franqueza contribui para uma comunicação clara e assertiva, sendo muito valorizada em ambientes que prezam pela objetividade e integridade.',
        'Altruísmo': 'Pessoas altruístas fortalecem o clima organizacional, contribuindo para ambientes colaborativos e empáticos.',
        'Complacência': 'Um bom nível de complacência favorece a harmonia no time, mas níveis muito altos podem dificultar o enfrentamento de situações que exigem firmeza.',
        'Modéstia': 'Pessoas modestas geralmente são bem-vistas em equipes colaborativas, pois valorizam o coletivo mais do que o ego.',
        'Empatia': 'A empatia é fundamental para o trabalho em equipe, liderança e resolução de conflitos.'
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in slide-in-from-bottom-10 duration-300 font-sans">
            <div className="max-w-[900px] mx-auto px-6 py-10">
                <button onClick={onClose} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
                    <ChevronLeft size={20} /> Voltar
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-gray-100 pb-8 gap-6 md:gap-0">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-blue-100 overflow-hidden flex items-center justify-center text-3xl font-black text-blue-600 border-4 border-gray-50">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight">{profile?.full_name || 'Candidato'}</h1>
                            <p className="text-gray-500 font-bold">Profissional Registrado</p>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
                        <span className="text-gray-500 font-bold mb-2">Pontuação geral: <span className="text-gray-900">{averageScore}% de aderência</span></span>
                        <div className="w-full max-w-[300px] h-3 bg-blue-50 rounded-full overflow-hidden flex relative">
                            <div 
                                className="bg-[#3B82F6] h-full rounded-full transition-all duration-1000" 
                                style={{ width: `${averageScore}%` }}
                            />
                            <div 
                                className="absolute bg-[#3B82F6] w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-white shadow-sm transition-all duration-1000"
                                style={{ left: `calc(${averageScore}% - 16px)`, top: '-10px' }}
                            >
                                <Trophy size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-2">{testTitle}</h2>
                <p className="text-gray-500 font-bold mb-10">Confira o seu desempenho detalhado neste teste comportamental.</p>

                <div className="space-y-12">
                    {Object.entries(scores).map(([trait, score], index) => (
                        <div key={trait}>
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2">{trait}</h3>
                                    <p className="text-gray-500 font-medium text-sm max-w-2xl leading-relaxed">
                                        {descriptions[trait] || 'A pontuação indica seu nível de tendência para esta característica comportamental específica.'}
                                    </p>
                                </div>
                                <span className="font-black text-gray-900 text-lg">{score}%</span>
                            </div>
                            <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#5AB7F7] rounded-full transition-all duration-1000"
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-20">
                <CandidateFooter />
            </div>
        </div>
    );
};

export default TestResultModal;
