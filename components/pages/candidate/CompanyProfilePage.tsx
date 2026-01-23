import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, MapPin, Globe, Plus, Users,
    FileText, Briefcase, Bookmark, DollarSign, Clock, Calendar
} from 'lucide-react';
import { Logo } from '../../ui/Icons';

const CompanyProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(false);

    const jobs = [
        { id: 1, title: 'Analista de Marketing Digital', location: 'Remoto', type: 'CLT', date: 'Há 2 dias' },
        { id: 2, title: 'Desenvolvedor Front-end Senior', location: 'Remoto', type: 'PJ', date: 'Há 5 dias' },
        { id: 3, title: 'Product Owner', location: 'São Paulo - SP', type: 'CLT', date: 'Há 1 semana' },
    ];

    return (
        <div className="max-w-[1000px] w-full mx-auto px-6 py-12">
            <button onClick={() => navigate('/app/jobs')} className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#F04E23] mb-8 transition-colors">
                <ChevronLeft size={20} />
                Voltar
            </button>

            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-10 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center border-4 border-gray-50">
                                <Logo className="scale-75" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 mb-1">Cianet Group</h1>
                                <p className="text-gray-400 font-bold text-lg mb-3">Telecomunicações</p>
                                <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                                    <span className="flex items-center gap-2"><MapPin size={16} /> Florianópolis - SC</span>
                                    <a href="#" className="flex items-center gap-2 hover:text-[#F04E23] transition-colors"><Globe size={16} /> www.cianet.com.br</a>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${isFollowing ? 'bg-gray-100 text-gray-600' : 'bg-[#F04E23] text-white hover:bg-[#E03E13] shadow-lg shadow-orange-100'}`}
                        >
                            {isFollowing ? 'Seguindo' : <><Plus size={20} strokeWidth={3} /> Seguir</>}
                        </button>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-xl font-black text-gray-900 mb-4">Sobre a empresa</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Somos uma empresa de tecnologia que desenvolve soluções para o mercado de provedores de internet (ISPs).
                            Nossa missão é impulsionar o crescimento dos nossos clientes através de produtos inovadores e um atendimento de excelência.
                            Com mais de 10 anos de mercado, somos referência no setor e buscamos talentos que queiram crescer conosco.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-10">
                        <div className="bg-[#F8FAFC] p-6 rounded-2xl text-center border border-gray-100">
                            <Users className="mx-auto text-[#1D4ED8] mb-2" size={24} />
                            <p className="text-2xl font-black text-gray-900">51</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Seguidores</p>
                        </div>
                        <div className="bg-[#F8FAFC] p-6 rounded-2xl text-center border border-gray-100">
                            <FileText className="mx-auto text-[#1D4ED8] mb-2" size={24} />
                            <p className="text-2xl font-black text-gray-900">48</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Publicações</p>
                        </div>
                        <div className="bg-[#F8FAFC] p-6 rounded-2xl text-center border border-gray-100">
                            <Briefcase className="mx-auto text-[#1D4ED8] mb-2" size={24} />
                            <p className="text-2xl font-black text-gray-900">5</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Vagas abertas</p>
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="p-10 bg-gray-50/50">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Vagas disponíveis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.map(job => (
                            <div key={job.id} className="bg-white p-6 rounded-[24px] border border-gray-100 hover:shadow-lg hover:border-orange-100 transition-all group cursor-pointer" onClick={() => navigate('/app/jobs')}>
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                    <Logo className="scale-50" />
                                </div>
                                <h4 className="font-black text-gray-900 text-lg mb-1 group-hover:text-[#1D4ED8] transition-colors">{job.title}</h4>
                                <p className="text-gray-400 font-bold text-sm mb-6">Cianet Group</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                        <MapPin size={16} className="text-gray-300" /> {job.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                        <Briefcase size={16} className="text-gray-300" /> {job.type}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <button className="text-[#F04E23] font-black text-sm hover:underline">Ver detalhes</button>
                                    <span className="text-xs font-bold text-gray-400">{job.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfilePage;
