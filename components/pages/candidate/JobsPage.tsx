import React, { useState, useEffect } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/Icons';
import {
  Bell, FileText, ChevronRight, Search,
  ChevronDown, MapPin, DollarSign, Clock, Briefcase,
  Calendar, Info, ChevronLeft, Bookmark, Flag
} from 'lucide-react';


interface Job {
  id: string;
  title: string;
  company_id: string; // We will need to join profiles to get company name
  description: string;
  location: string;
  type: string;
  salary_range: string;
  created_at: string;
  // Augmented properties for UI
  company?: string;
  match?: string;
  date?: string;
}


const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [noResults, setNoResults] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Joining with profiles to get company name (assuming company_id links to a profile with role 'company')
      // For this MVP schema, we might not have 'name' in profiles table directly as a column based on my previous migration?
      // Let's check the migration step... Ah, I didn't add 'name' to profiles table in the first migration!
      // I only added email and role.
      // FIX: I will fetch raw jobs for now and placeholder the company name until I update the schema.

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedJobs = data.map((job: any) => ({
          ...job,
          company: 'Empresa Confidencial', // Placeholder until we have profile names
          match: 'N/A', // Match calculation is complex, keeping placeholder
          date: new Date(job.created_at).toLocaleDateString()
        }));
        setJobs(formattedJobs);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.toLowerCase() === 'vazio') {
      setNoResults(true);
      setSelectedJob(null);
    } else {
      setNoResults(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setNoResults(false);
    setSelectedJob(null);
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto px-6 py-12">
      {/* Main Search Section */}
      {!selectedJob && (
        <div className="mb-12">
          <div className="max-w-[1200px] mx-auto text-center">
            <h1 className="text-5xl font-black text-[#F04E23] mb-8">Encontre sua vaga aqui!</h1>

            <form onSubmit={handleSearch} className="max-w-[700px] mx-auto relative mb-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Pesquise pelo cargo, palavra-chave ou empresa"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-[#F04E23] outline-none transition-all text-gray-700 text-[17px] font-medium"
              />
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <FilterDropdown label="Modelo de trabalho" />
              <FilterDropdown label="Km de você" />
              <FilterDropdown label="Publicação" />
              <FilterDropdown label="Salário" />
              <FilterDropdown label="Área" />
              <FilterDropdown label="Contrato" />
              <FilterDropdown label="PCD" />
              <button onClick={handleReset} className="ml-4 text-gray-400 font-bold text-sm hover:text-gray-600 bg-gray-100 px-6 py-3 rounded-full">Resetar filtros</button>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      {selectedJob ? (
        /* Detailed View Flow */
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          <div className="w-full lg:w-[400px] space-y-4 shrink-0">
            <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-[#F04E23] transition-colors">
              <ChevronLeft size={20} /> Voltar
            </button>
            <h2 className="text-3xl font-black text-gray-900 mb-6">Mais recentes</h2>
            {jobs.map(job => (
              <MiniJobCard key={job.id} job={job} isActive={selectedJob.id === job.id} onClick={() => setSelectedJob(job)} />
            ))}
          </div>

          <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-10 border-b border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-4xl font-black text-[#1D4ED8] mb-4">{selectedJob.title}</h2>
                  <div
                    className="flex items-center gap-3 cursor-pointer group w-fit"
                    onClick={() => navigate('/app/company-profile')}
                  >
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 group-hover:border-[#F04E23] transition-colors">
                      <Logo className="scale-50" />
                    </div>
                    <p className="text-gray-500 font-bold text-lg group-hover:text-[#F04E23] transition-colors underline-offset-4 group-hover:underline">{selectedJob.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-y-4 gap-x-8 mt-8">
                    <JobInfoItem icon={<MapPin size={18} />} text="Remoto" />
                    <JobInfoItem icon={<DollarSign size={18} />} text="A combinar" color="text-orange-500" />
                    <JobInfoItem icon={<Clock size={18} />} text="Período flexível" />
                    <JobInfoItem icon={<Briefcase size={18} />} text="CLT" />
                    <JobInfoItem icon={<Calendar size={18} />} text="1 dia atrás • 25/01/2025 encerra" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <button className="px-10 py-4 bg-[#F04E23] text-white font-black rounded-2xl hover:bg-[#E03E13] transition-all shadow-lg shadow-orange-100">
                  Candidatar-se
                </button>
                <button className="flex items-center gap-2 text-gray-500 font-bold px-4 py-4 hover:bg-gray-50 rounded-2xl transition-all border border-gray-100">
                  <Bookmark size={20} /> Salvar vaga
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : noResults ? (
        <div className="text-center py-20">
          <h2 className="text-4xl font-black mb-4">Nenhuma vaga encontrada</h2>
          <button onClick={handleReset} className="text-[#F04E23] font-black underline">Resetar filtros</button>
        </div>
      ) : (
        <div className="space-y-16">
          <JobSection title="Mais recentes" jobs={jobs} onSelect={setSelectedJob} />
        </div>
      )}
    </div>
  );
};

const FilterDropdown: React.FC<{ label: string }> = ({ label }) => (
  <button className="flex items-center gap-4 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:border-[#F04E23] transition-all">
    {label}
    <ChevronDown size={16} className="text-gray-400" />
  </button>
);

const JobSection: React.FC<{ title: string, jobs: any[], onSelect: (j: any) => void }> = ({ title, jobs, onSelect }) => (
  <section>
    <div className="flex items-center justify-between mb-10">
      <h2 className="text-3xl font-black text-gray-900">{title}</h2>
      <button className="text-gray-400 font-bold hover:text-[#F04E23] transition-colors flex items-center gap-1">Ver todas <ChevronRight size={18} /></button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {jobs.map(job => (
        <JobGridCard key={job.id} job={job} onClick={() => onSelect(job)} />
      ))}
    </div>
  </section>
);

const JobGridCard: React.FC<{ job: any, onClick: () => void }> = ({ job, onClick }) => (
  <div className="bg-white border border-gray-100 rounded-[32px] p-8 hover:shadow-xl hover:border-orange-100 transition-all group flex flex-col">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
        <Logo className="scale-[0.4] grayscale opacity-30" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-black text-gray-900 text-lg group-hover:text-[#1D4ED8] transition-colors truncate">{job.title}</h4>
        <p className="text-gray-400 font-bold text-sm truncate">{job.company}</p>
      </div>
    </div>
    <div className="mt-auto">
      <div className="w-full bg-[#F0F7FF] rounded-full h-10 flex items-center justify-center text-[#1D4ED8] font-black text-[11px] mb-6">
        {job.match} de aderência
      </div>
      <div className="flex items-center justify-between">
        <button onClick={onClick} className="text-[#F04E23] font-black hover:underline underline-offset-4">Ver mais</button>
      </div>
    </div>
  </div>
);

const MiniJobCard: React.FC<{ job: any, isActive: boolean, onClick: () => void }> = ({ job, isActive, onClick }) => (
  <div onClick={onClick} className={`p-6 rounded-[24px] border transition-all cursor-pointer ${isActive ? 'bg-[#F0F7FF] border-[#1D4ED8]' : 'bg-white border-gray-100'}`}>
    <h4 className={`font-black truncate ${isActive ? 'text-[#1D4ED8]' : 'text-gray-900'}`}>{job.title}</h4>
    <p className="text-gray-400 text-xs font-bold">{job.company}</p>
  </div>
);

const JobInfoItem: React.FC<{ icon: React.ReactNode, text: string, color?: string }> = ({ icon, text, color = "text-gray-500" }) => (
  <div className={`flex items-center gap-3 font-bold text-base ${color}`}>
    <span className="text-gray-400">{icon}</span>
    {text}
  </div>
);

export default JobsPage;
