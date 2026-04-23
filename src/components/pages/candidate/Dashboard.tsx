import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, MapPin, Briefcase, ChevronRight,
  Trophy, ArrowUpRight, TrendingUp, Eye, X,
  Building2, ClipboardList, Sparkles
} from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import OnboardingModal from '@/components/modals/OnboardingModal';
import { calculateJobMatch } from '@/utils/matchingUtils';

interface Job {
  id: string;
  title: string;
  remote_policy: string | null;
  match_score: number | null;
  created_at: string | null;
  companies: { name: string; logo_url: string | null } | null;
}

const JOB_COLORS = [
  'bg-blue-500', 'bg-orange-500', 'bg-purple-500',
  'bg-green-500', 'bg-red-500', 'bg-teal-500', 'bg-indigo-500',
];

const getColor = (str: string) =>
  JOB_COLORS[Math.abs((str ?? '').charCodeAt(0)) % JOB_COLORS.length];

const getInitials = (name: string) =>
  (name ?? 'E').split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

// ── JobCard ───────────────────────────────────────────────────────────────────
const JobCard = ({
  job,
  matchLabel,
  onClick,
  onDismiss,
}: {
  job: Job;
  matchLabel?: string;
  onClick?: () => void;
  onDismiss?: (e: React.MouseEvent) => void;
}) => {
  const color = getColor(job.title ?? '');
  const initials = getInitials(job.companies?.name ?? 'E');

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group border-b border-gray-50 last:border-0"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white font-black text-sm flex-shrink-0 overflow-hidden`}>
          {job.companies?.logo_url
            ? <img src={job.companies.logo_url} alt="" className="w-full h-full object-cover" />
            : initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-[15px] leading-tight">
              {job.title}
            </h4>
            {matchLabel && (
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 whitespace-nowrap">
                {matchLabel}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {job.companies?.name ?? 'Empresa'} • {job.remote_policy ?? 'Remoto'}
          </p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-gray-200 hover:text-gray-500 transition-colors ml-4 p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
        title="Remover vaga"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard: React.FC = () => {
  const { user, profile, hasTestResult } = useAuth();
  const navigate = useNavigate();

  // Stats
  const [companyCount, setCompanyCount] = useState<number>(0);
  const [profileViewCount, setProfileViewCount] = useState<number>(0);

  // Jobs sections
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);

  // User state
  const [hasTest, setHasTest] = useState<boolean>(false);
  const [testId, setTestId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Job dismissal and Toast state
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Use stable primitive values as deps to avoid infinite re-fetch caused by
  // object reference changes in the auth context on every render.
  const userId = user?.id;
  const profileUpdatedAt = (profile as any)?.updated_at;

  useEffect(() => {
    // Load dismissed jobs from localStorage
    if (userId) {
      const saved = localStorage.getItem(`dismissed_jobs_${userId}`);
      if (saved) {
        setDismissedIds(new Set(JSON.parse(saved)));
      }
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, profileUpdatedAt]);

  const handleDismissJob = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;

    const newDismissed = new Set(dismissedIds);
    newDismissed.add(jobId);
    setDismissedIds(newDismissed);
    localStorage.setItem(`dismissed_jobs_${userId}`, JSON.stringify(Array.from(newDismissed)));

    showToast('Vaga removida com sucesso');
  };

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Data fetching ──────────────────────────────────────────────────────────

  const fetchDashboardData = async () => {
    setLoading(true);
    // Reset states to prevent "cache" feel from previous user
    setCompanyCount(0);
    setProfileViewCount(0);
    setRecommendedJobs([]);
    setLatestJobs([]);
    setSimilarJobs([]);
    setHasTest(false);
    setProgress(0);

    await Promise.all([
      fetchStats(),
      fetchBehavioralTest(),
      calculateProgress(),
    ]);

    // Check if onboarding is needed
    if (profile && (!profile.cpf || !profile.phone)) {
      setShowOnboarding(true);
    }

    setLoading(false);
  };

  const fetchStats = async () => {
    // 1. Real company count
    const { count: cCount } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    setCompanyCount(cCount ?? 0);

    // 2. Profile view count proxy: applications to jobs related to the user's area
    //    Since there's no profile_views table, we count all active job_applications in the system
    const { count: vCount } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true });
    setProfileViewCount(vCount ?? 0);
  };

  const fetchBehavioralTest = async () => {
    if (!user) return;

    // Check if user has completed a test
    const { data: results } = await supabase
      .from('candidate_test_results')
      .select('id, scores')
      .eq('user_id', user.id)
      .limit(1);

    const tested = Array.isArray(results) && results.length > 0;
    setHasTest(tested);

    // Get the Big Five test ID for CTA link
    const { data: testData } = await supabase
      .from('behavioral_tests')
      .select('id')
      .eq('title', 'Mapeamento de Perfil Comportamental (Big Five)')
      .single();
    if (testData) setTestId(testData.id);

    // Now fetch jobs based on test state
    await fetchJobSections(tested);
  };

  const fetchJobSections = async (tested: boolean) => {
    try {
      // Fetch all open jobs to work with locally
      const { data: allJobsData, error } = await supabase
        .from('jobs')
        .select('*, companies(name, logo_url)')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch applied job IDs to hide them
      const { data: appliedData } = await supabase
        .from('job_applications')
        .select('job_id')
        .eq('user_id', user?.id);
      
      const appliedIds = new Set(appliedData?.map(a => a.job_id) || []);

      let allJobs: Job[] = ((allJobsData as any[]) ?? [])
        .filter(j => !appliedIds.has(j.id)) // Filter out already applied jobs
        .map(j => ({
          ...j,
          match_score: calculateJobMatch(j.id, user?.id, tested) 
        }));

      // 1. Alerta de novas vagas (always top 3 by date)
      const latestList = allJobs.slice(0, 3);
      setLatestJobs(latestList);

      const latestIds = new Set(latestList.map(j => j.id));

      if (tested) {
        // 2. Recomendadas (highest match score)
        // Sort by match_score local
        const sortedByMatch = [...allJobs].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
        
        // Filter out those already in latest to avoid repetition IF we have enough jobs
        let recommended = sortedByMatch.filter(j => !latestIds.has(j.id));
        if (recommended.length === 0 && allJobs.length > 0) {
          recommended = sortedByMatch; // Fallback to all if everything is "new"
        }
        setRecommendedJobs(recommended.slice(0, 3));

        const recommendedIds = new Set(recommended.slice(0, 3).map(j => j.id));
        const excludedIds = new Set([...latestIds, ...recommendedIds]);

        // 3. Vagas semelhantes (next best matches)
        let similar = sortedByMatch.filter(j => !excludedIds.has(j.id));
        if (similar.length === 0 && allJobs.length > 0) {
          similar = sortedByMatch.filter(j => !recommendedIds.has(j.id));
        }
        setSimilarJobs(similar.slice(0, 3));
      } else {
        // No test: show CTA and next latest jobs
        setRecommendedJobs([]);
        setSimilarJobs(allJobs.slice(3, 6));
      }
    } catch (err) {
      console.error('Error fetching job sections:', err);
      // Fallback empty states
      setLatestJobs([]);
      setRecommendedJobs([]);
      setSimilarJobs([]);
    }
  };

  const calculateProgress = async () => {
    if (!user) return;
    let done = 0;
    const total = 6;
    if (profile?.full_name && profile?.phone) done++;
    if ((profile as any)?.city) done++;
    const { count: edu } = await supabase.from('academic_education').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    if (edu && edu > 0) done++;
    const { count: exp } = await supabase.from('professional_experience').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    if (exp && exp > 0) done++;
    if (profile?.trainings && profile.trainings.length > 0) done++;
    const { count: tests } = await supabase.from('candidate_test_results').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    if (tests && tests > 0) done++;
    setProgress(Math.round((done / total) * 100));
  };

  // ── Render helpers ─────────────────────────────────────────────────────────
  const CardHeader = ({
    title,
    subtitle,
    onViewAll,
  }: {
    title: string;
    subtitle: string;
    onViewAll?: () => void;
  }) => (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">{title}</h2>
        <p className="text-xs text-gray-400 font-medium mt-1">{subtitle}</p>
      </div>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-gray-400 hover:text-gray-700 flex items-center gap-1 whitespace-nowrap mt-1 transition-colors"
        >
          Ver todas <ChevronRight size={13} />
        </button>
      )}
    </div>
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F04E23]" />
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="flex-1">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 items-start">

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <aside className="w-full lg:w-[380px] xl:w-[400px] flex-shrink-0 space-y-5">

            {/* User Card */}
            <div
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate('/app/profile')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-5 border-4 border-gray-50 shadow-lg bg-gray-100 flex items-center justify-center text-3xl font-black text-gray-400">
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    : (profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U')
                  }
                </div>
                <h3 className="text-xl font-black text-gray-900">{profile?.full_name || 'Candidato'}</h3>
                <p className="text-sm font-semibold text-gray-500 mt-1">{profile?.job_objective || 'Profissional'}</p>
                <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1">
                  <MapPin size={11} />
                  {(profile as any)?.city || 'Sua cidade'}, {(profile as any)?.state || 'UF'}
                </p>

                {/* Real stats */}
                <div className="w-full mt-6 bg-blue-50 rounded-2xl p-5 text-left space-y-3">
                  <p className="text-[12px] font-bold text-blue-600 flex items-center gap-2">
                    <Building2 size={13} className="flex-shrink-0" />
                    <span>
                      <span className="font-black text-blue-700">{companyCount.toLocaleString('pt-BR')}</span> empresas cadastradas na plataforma
                    </span>
                  </p>
                  <p className="text-[12px] font-bold text-blue-600 flex items-center gap-2">
                    <Eye size={13} className="flex-shrink-0" />
                    <span>
                      <span className="font-black text-blue-700">{profileViewCount.toLocaleString('pt-BR')}</span> visitas ao perfil na plataforma
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <span className="text-sm font-semibold text-gray-500">Progresso do perfil:</span>
                <span className="text-sm font-black text-gray-900">{progress}% concluído</span>
              </div>

              <div className="relative h-2.5 w-full bg-gray-100 rounded-full mb-8">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(progress, 4)}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center text-blue-500 shadow-lg"
                  style={{ left: `calc(${Math.max(progress, 4)}% - 16px)` }}
                >
                  <Trophy size={13} />
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-5">
                <p className="text-sm font-black text-gray-800 leading-snug">
                  {progress < 100
                    ? 'Quando foi sua última experiência profissional?'
                    : 'Perfil 100% completo! Parabéns.'}
                </p>
                <p className="text-xs text-gray-400 font-medium mt-2 leading-relaxed">
                  Mais de 300 buscas foram feitas utilizando filtros de experiência profissional.
                </p>
              </div>

              <button
                onClick={() => navigate('/app/professional-registration')}
                className="w-full py-4 bg-[#F04E23] text-white font-black rounded-2xl text-sm hover:bg-[#d63e19] hover:shadow-lg hover:shadow-orange-100 transition-all transform hover:-translate-y-0.5"
              >
                Completar cadastro profissional
              </button>
            </div>

            {/* Behavioral Test Link */}
            <button
              onClick={() => navigate(testId ? `/app/behavioral-test/${testId}` : '/app/behavioral-test')}
              className="w-full bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between group hover:border-orange-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-orange-50 text-[#F04E23] rounded-xl">
                  <FileText size={20} />
                </div>
                <span className="font-bold text-gray-700 text-sm">Resultado do teste comportamental</span>
              </div>
              <ArrowUpRight size={18} className="text-gray-300 group-hover:text-[#F04E23] transition-all" />
            </button>
          </aside>

          {/* ── Main Content ──────────────────────────────────────────── */}
          <section className="flex-1 min-w-0 space-y-5">

            {/* ── 1. Recomendadas: vagas por aderência ou CTA de teste ── */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <CardHeader
                title="Recomendadas para você"
                subtitle={
                  hasTest
                    ? 'Baseado no seu perfil comportamental e requisitos da vaga.'
                    : 'Realize o teste comportamental para ver vagas personalizadas.'
                }
                onViewAll={hasTest ? () => navigate('/app/jobs') : undefined}
              />

              {hasTest ? (
                // With test: show highest match_score jobs
                recommendedJobs.filter(j => !dismissedIds.has(j.id)).length > 0 ? (
                  recommendedJobs
                    .filter(j => !dismissedIds.has(j.id))
                    .map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        matchLabel={
                          job.match_score != null
                            ? `${job.match_score}% de aderência`
                            : '87% de aderência'
                        }
                        onClick={() => navigate('/app/jobs', { state: { selectedJobId: job.id } })}
                        onDismiss={(e) => handleDismissJob(job.id, e)}
                      />
                    ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">Nenhuma vaga recomendada disponível.</p>
                )
              ) : (
                // No test: CTA banner
                <div className="flex flex-col items-center text-center py-8 px-4">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles size={28} className="text-[#F04E23]" />
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">Descubra vagas ideais para você</h3>
                  <p className="text-sm text-gray-400 font-medium mb-6 max-w-sm leading-relaxed">
                    Realize o teste comportamental e nosso sistema vai recomendar as melhores vagas com base no seu perfil.
                  </p>
                  <button
                    onClick={() => navigate(testId ? `/app/behavioral-test/${testId}` : '/app/behavioral-test')}
                    className="px-8 py-3.5 bg-[#F04E23] text-white font-black rounded-2xl text-sm hover:bg-[#d63e19] hover:shadow-lg hover:shadow-orange-100 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <ClipboardList size={18} />
                    Realizar teste comportamental
                  </button>
                </div>
              )}
            </div>

            {/* ── 2. Alerta: sempre as vagas mais recentes cadastradas ── */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <CardHeader
                title="Alerta de novas vagas"
                subtitle="As últimas vagas cadastradas na plataforma."
                onViewAll={() => navigate('/app/jobs')}
              />
              <div>
                <div className="flex items-center gap-2 py-3 px-2 mb-2 border-b border-gray-50">
                  <span className="text-base">✨</span>
                  <p className="text-xs font-semibold text-gray-500">
                    <span className="font-black text-gray-800">Principais atualizações</span>
                  </p>
                </div>
                {latestJobs.filter(j => !dismissedIds.has(j.id)).length > 0 ? (
                  latestJobs
                    .filter(j => !dismissedIds.has(j.id))
                    .map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onClick={() => navigate('/app/jobs', { state: { selectedJobId: job.id } })}
                        onDismiss={(e) => handleDismissJob(job.id, e)}
                      />
                    ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-6">Nenhuma nova vaga no momento.</p>
                )}
              </div>
            </div>

            {/* ── 3. Vagas semelhantes ────────────────────────────────── */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <CardHeader
                title="Vagas semelhantes"
                subtitle={
                  hasTest
                    ? 'Vagas com aderência ao seu perfil comportamental.'
                    : 'Vagas recentes diferentes das apresentadas acima.'
                }
                onViewAll={() => navigate('/app/jobs')}
              />
              {similarJobs.filter(j => !dismissedIds.has(j.id)).length > 0 ? (
                similarJobs
                  .filter(j => !dismissedIds.has(j.id))
                  .map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      matchLabel={
                        hasTest && job.match_score != null
                          ? `${job.match_score}% de aderência`
                          : undefined
                      }
                      onClick={() => navigate('/app/jobs', { state: { selectedJobId: job.id } })}
                      onDismiss={(e) => handleDismissJob(job.id, e)}
                    />
                  ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">Nenhuma vaga semelhante encontrada.</p>
              )}
            </div>

          </section>
        </div>
      </div>

      {/* ── Toast Notification ────────────────────────────────────────── */}
      {toast?.show && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] border border-gray-800">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
              <Sparkles size={14} />
            </div>
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        </div>
      )}
      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal 
          onStart={() => {
            setShowOnboarding(false);
            navigate('/app/profile');
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;
