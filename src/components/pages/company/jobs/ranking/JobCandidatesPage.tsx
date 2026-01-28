import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JobCard from '../JobCard';
import CandidateRankingCard from './CandidateRankingCard';

const JobCandidatesPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock candidates
    const candidates = [
        { id: 1, name: 'Joaquim Vinicius', role: 'Engenheiro', age: 20, location: 'São Paulo, SP', matchPercentage: 90, imgUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150' },
        { id: 2, name: 'Sophie Juliana', role: 'Engenheira', age: 22, location: 'São Paulo, SP', matchPercentage: 90, imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
        { id: 3, name: 'Vitória Francisca', role: 'Engenheira', age: 23, location: 'São Paulo, SP', matchPercentage: 70, imgUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150' },
        { id: 4, name: 'Victor Matheus', role: 'Engenheira', age: 23, location: 'São Paulo, SP', matchPercentage: 70, imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
        { id: 5, name: 'Alessandra Ester', role: 'Engenheira', age: 23, location: 'São Paulo, SP', matchPercentage: 70, imgUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=150' },
        { id: 6, name: 'Yago Nascimento', role: 'Engenheira', age: 23, location: 'São Paulo, SP', matchPercentage: 20, imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150' },
    ];

    return (
        <div className="max-w-[1400px] w-full mx-auto px-6 py-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Minhas vagas</h1>
            <p className="text-gray-500 mb-8">Baseado no seu perfil, preferências e requisitos da vaga.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Job Details */}
                <div className="lg:col-span-1">
                    <JobCard
                        id={id}
                        title="Analista de Marketing Digital"
                        company="Digital Marketing Experts S/A"
                        location="Remoto"
                        salary="A combinar"
                        contractType="Período flexível"
                        benefits="VR/VT"
                        postedAt="1 dia atrás"
                    />
                </div>

                {/* Right Column: Candidates Ranking */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Ranking</h2>
                        <p className="text-gray-500 mb-8">Confira abaixo o ranking dos melhores candidatos para essa vaga.</p>

                        <div className="flex flex-col gap-4">
                            {candidates.map(candidate => (
                                <React.Fragment key={candidate.id}>
                                    <CandidateRankingCard {...candidate} />
                                    <div className="h-[1px] bg-gray-50 last:hidden"></div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobCandidatesPage;
