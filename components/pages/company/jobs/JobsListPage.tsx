import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JobCard from './JobCard';

const JobsListPage: React.FC = () => {
    const navigate = useNavigate();

    // Mock data based on Image 2
    const jobs = [
        {
            id: '1',
            title: 'Analista de Marketing Digital',
            company: 'Digital Marketing Experts S/A',
            location: 'Remoto',
            salary: 'A combinar',
            contractType: 'Período flexível',
            benefits: 'VR/VT',
            postedAt: '1 dia atrás'
        },
        {
            id: '2',
            title: 'Pessoa Recursos Humanos',
            company: 'Digital Marketing Experts S/A',
            location: 'Remoto',
            salary: 'A combinar',
            contractType: 'Período flexível',
            benefits: 'VR/VT',
            postedAt: '1 dia atrás'
        },
        {
            id: '3',
            title: 'Gerente de Projetos',
            company: 'Digital Marketing Experts S/A',
            location: 'Remoto',
            salary: 'A combinar',
            contractType: 'Período flexível',
            benefits: 'VR/VT',
            postedAt: '1 dia atrás'
        }
    ];

    return (
        <div className="max-w-[1400px] w-full mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-black text-gray-900">Minhas vagas</h1>
                <button
                    onClick={() => navigate('/company/jobs/new')}
                    className="flex items-center gap-2 px-6 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-500/20 text-sm"
                >
                    <Plus size={20} />
                    Cadastrar vaga
                </button>
            </div>
            <p className="text-sm text-gray-500 mb-10">Baseado no seu perfil, preferências e requisitos da vaga.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {jobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                ))}

                {/* Empty State visual helper if needed, but list is populated */}
            </div>
        </div>
    );
};

export default JobsListPage;
