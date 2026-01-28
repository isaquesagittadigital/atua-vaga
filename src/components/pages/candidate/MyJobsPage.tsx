import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, MapPin, DollarSign, Clock, Briefcase, Calendar } from 'lucide-react';
import JobDetailsPanel from '../../jobs/JobDetailsPanel';

// Define Job Type
interface Job {
  id: string;
  title: string;
  description: string;
  company_name?: string;
  location: string;
  salary_min: number;
  salary_max: number;
  type: string;
  created_at: string;
  status: string;
  match_score?: number;
  requirements?: string[];
}

const MyJobsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Add hook
  const [activeTab, setActiveTab] = useState<'applied' | 'saved'>('applied');
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // State for Split Layout
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Fetch Saved Jobs
  useEffect(() => {
    if (!user) return;
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('saved_jobs')
          .select(`
            job_id,
            jobs:job_id (
              *,
              companies (
                name,
                logo_url
              )
            )
          `)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching saved jobs:', error);
        } else {
          const jobs = data?.map((item: any) => ({
            ...item.jobs,
            company_name: item.jobs.companies?.name || 'Empresa Confidencial',
          })) || [];
          setSavedJobs(jobs);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, [user]);

  // Mock Fetch Applied Jobs
  useEffect(() => {
    // Simulating fetch
    const mockApplied: Job[] = [
      { id: '1', title: 'Analista de Marketing Digital', company_name: 'Digital Marketing Experts S/A', location: 'Remoto', type: 'Remoto', salary_min: 5000, salary_max: 7000, created_at: new Date().toISOString(), status: 'active', match_score: 90, description: 'Descrição da vaga...' },
      { id: '2', title: 'Pessoa Recursos Humanos', company_name: 'Digital Marketing Experts S/A', location: 'Remoto', type: 'Remoto', salary_min: 0, salary_max: 0, created_at: new Date().toISOString(), status: 'active', match_score: 70, description: 'Descrição da vaga...' },
      { id: '3', title: 'Gerente de Projetos', company_name: 'Digital Marketing Experts S/A', location: 'Remoto', type: 'Remoto', salary_min: 0, salary_max: 0, created_at: new Date().toISOString(), status: 'active', match_score: 20, description: 'Descrição da vaga...' },
    ];
    setAppliedJobs(mockApplied);
    // Handle navigation state from other pages
    const state = location.state as { selectedJobId?: string };
    if (state?.selectedJobId && mockApplied.length > 0) {
      const preSelected = mockApplied.find(j => j.id === state.selectedJobId);
      if (preSelected) setSelectedJob(preSelected);
    }
  }, [location.state]);

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // For mobile
  };

  const activeJobs = activeTab === 'applied' ? appliedJobs : savedJobs;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Minhas vagas</h1>
            <p className="text-gray-500">Vagas que você se candidatou.</p>
          </div>
          {selectedJob && (
            <button onClick={() => setSelectedJob(null)} className="text-[#F04E23] font-bold hover:underline mb-2">
              Voltar para lista
            </button>
          )}
        </div>

        {!selectedJob ? (
          // --- View 1: Initial List View (Image 2) ---
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              <button
                onClick={() => setActiveTab('applied')}
                className={`py-4 px-4 font-bold text-sm transition-all relative ${activeTab === 'applied' ? 'text-[#F04E23]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Candidatadas
                {activeTab === 'applied' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#F04E23]" />}
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`py-4 px-4 font-bold text-sm transition-all relative ${activeTab === 'saved' ? 'text-[#F04E23]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Vagas salvas
                {activeTab === 'saved' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#F04E23]" />}
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F04E23]"></div></div>
              ) : activeJobs.length === 0 ? (
                <div className="text-center py-20 text-gray-400">Nenhuma vaga encontrada.</div>
              ) : (
                activeJobs.map(job => <JobRowItem key={job.id} job={job} onClick={() => handleJobClick(job)} />)
              )}
            </div>
          </div>
        ) : (
          // --- View 2: Master-Detail Layout (Image 3) ---
          <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in duration-300">

            {/* Left Sidebar (List) */}
            <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col bg-white shrink-0 lg:sticky lg:top-8 lg:h-[calc(100vh-120px)] rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Tabs (Simple Line) */}
              <div className="flex gap-8 border-b border-gray-100 mb-6 px-6 pt-4">
                <button onClick={() => setActiveTab('applied')} className={`pb-4 font-bold text-sm ${activeTab === 'applied' ? 'text-[#F04E23] border-b-2 border-[#F04E23]' : 'text-gray-400'}`}>Candidatadas</button>
                <button onClick={() => setActiveTab('saved')} className={`pb-4 font-bold text-sm ${activeTab === 'saved' ? 'text-[#F04E23] border-b-2 border-[#F04E23]' : 'text-gray-400'}`}>Vagas salvas</button>
              </div>

              {/* Scrollable List */}
              <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-20">
                {activeJobs.map(job => (
                  <JobSidebarItem
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    onClick={() => handleJobClick(job)}
                  />
                ))}
              </div>
            </div>

            {/* Right Panel (Details) */}
            <div className="flex-1 bg-white rounded-[32px] border border-blue-200/50 shadow-xl shadow-blue-50/50 relative">
              <JobDetailsPanel
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
                isApplied={activeTab === 'applied'}
                onCancelApplication={() => alert('Candidatura cancelada (mock)')}
                onBehavioralTest={() => alert('Iniciar teste comportamental')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Initial List View Item (Image 2 Style) ---
const JobRowItem: React.FC<{ job: Job; onClick: () => void }> = ({ job, onClick }) => (
  <div className="bg-white rounded-2xl p-6 mb-4 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-all">
    <div className="flex items-center gap-6">
      {/* Logo */}
      <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl shrink-0">
        {job.company_name ? job.company_name.charAt(0).toUpperCase() : 'C'}
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-bold text-[#2563EB] text-lg">{job.title}</h3>
          <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
            {job.match_score || 90}% de aderência
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          {job.company_name || 'Empresa Confidencial'} • {job.location}
        </p>
      </div>
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-10">
      <span className="text-gray-400 text-sm hidden lg:block">
        A média de % para essa vaga é de {job.match_score || 90}%
      </span>
      <button
        onClick={onClick}
        className="text-[#F04E23] font-bold hover:underline whitespace-nowrap"
      >
        Ver detalhes
      </button>
    </div>
  </div>
);

// --- Master-Detail Sidebar Item (Image 3 List Style) ---
const JobSidebarItem: React.FC<{ job: Job; isSelected: boolean; onClick: () => void }> = ({ job, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-2xl border cursor-pointer transition-all hover:shadow-md mb-4
          ${isSelected
        ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100'
        : 'bg-white border-gray-100 hover:border-blue-100'
      }`}
  >
    <div className="flex gap-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shrink-0
               ${isSelected ? 'bg-blue-200 text-[#1E3A8A]' : 'bg-gray-100 text-gray-500'}
          `}>
        {job.company_name ? job.company_name.charAt(0).toUpperCase() : 'C'}
      </div>
      <div className="flex-1">
        <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-[#1E3A8A]' : 'text-[#2563EB]'}`}>
          {job.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4">{job.company_name || 'Empresa Confidencial'}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Briefcase size={14} />
            <span>{job.type}</span>
          </div>
          {/* ... simplified tags for sidebar ... */}
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <DollarSign size={14} />
            <span>{job.salary_min ? `R$ ${job.salary_min}` : 'A combinar'}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border 
               ${job.match_score && job.match_score >= 80 ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}
           `}>
            {job.match_score || 0}% de aderência
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default MyJobsPage;
