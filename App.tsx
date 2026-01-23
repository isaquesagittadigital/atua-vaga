import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { CandidateLayout } from './components/layouts/CandidateLayout';
import { CompanyLayout } from './components/layouts/CompanyLayout';
import { AdminLayout } from './components/layouts/AdminLayout';

// Auth Pages
import LoginHero from './components/auth/LoginHero';
import LoginForm from './components/auth/LoginForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import RegisterForm from './components/auth/RegisterForm';
import { Logo } from './components/ui/Icons';
import CompanyRegisterPage from './components/pages/company/auth/CompanyRegisterPage';

// Candidate Pages
import Dashboard from './components/pages/candidate/Dashboard';
import JobsPage from './components/pages/candidate/JobsPage';
import MyJobsPage from './components/pages/candidate/MyJobsPage';
import ProfessionalRegistration from './components/pages/candidate/ProfessionalRegistration';
import ProfilePage from './components/pages/candidate/ProfilePage';
import BehavioralTestPage from './components/pages/candidate/BehavioralTestPage';
import BehavioralResultPage from './components/pages/candidate/BehavioralResultPage';
import NotificationsPage from './components/pages/candidate/NotificationsPage';
import FAQPage from './components/pages/candidate/FAQPage';
import CompanyProfilePage from './components/pages/candidate/CompanyProfilePage';

// Company & Admin Pages
import CompanyDashboard from './components/pages/company/Dashboard';
import AdminDashboard from './components/pages/admin/Dashboard';
import OnboardingPage from './components/pages/company/onboarding/OnboardingPage';
import JobsListPage from './components/pages/company/jobs/JobsListPage';
import CreateJobPage from './components/pages/company/jobs/create/CreateJobPage';
import JobCandidatesPage from './components/pages/company/jobs/ranking/JobCandidatesPage';

// Wrapper for Auth Pages to keep the visual style (Side Hero)
const AuthPageWrapper: React.FC<{ children: React.ReactNode, title?: string }> = ({ children, title = "Candidato" }) => (
  <div className="flex min-h-screen bg-white font-sans">
    <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] h-screen sticky top-0">
      <LoginHero />
    </div>
    <div className="w-full lg:w-[55%] xl:w-[60%] flex flex-col min-h-screen bg-[#F8FAFC]">
      <header className="w-full h-16 border-b border-gray-100 flex items-center justify-center bg-white relative shrink-0">
        <div className="lg:hidden absolute left-6">
          <Logo className="scale-75 origin-left" />
        </div>
        <h1 className="text-lg font-bold text-gray-700 tracking-wide">{title}</h1>
      </header>
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Auth Routes */}
        <Route path="/auth">
          {/* Candidate Auth */}
          <Route path="login" element={
            <AuthPageWrapper>
              <LoginForm
                onForgotPassword={() => window.location.href = '/auth/forgot-password'}
                onRegister={() => window.location.href = '/auth/register'}
                onLoginSuccess={() => window.location.href = '/app/dashboard'}
                loginType="candidate"
              />
            </AuthPageWrapper>
          } />
          <Route path="register" element={
            <AuthPageWrapper>
              <RegisterForm
                onBack={() => window.history.back()}
                onLoginLink={() => window.location.href = '/auth/login'}
                onRegisterComplete={() => window.location.href = '/app/dashboard'}
                onRecoverAccess={() => window.location.href = '/auth/forgot-password'}
              />
            </AuthPageWrapper>
          } />
          <Route path="forgot-password" element={
            <AuthPageWrapper>
              <ForgotPasswordForm
                title="Recuperar acesso"
                onBack={() => window.history.back()}
                onCodeSent={() => window.location.href = '/auth/reset-password'}
              />
            </AuthPageWrapper>
          } />
          <Route path="reset-password" element={
            <AuthPageWrapper>
              <ResetPasswordForm
                onCancel={() => window.location.href = '/auth/login'}
                onResetComplete={() => window.location.href = '/auth/login'}
              />
            </AuthPageWrapper>
          } />



          {/* Company Auth */}
          <Route path="company/login" element={
            <AuthPageWrapper title="Empresa">
              <LoginForm
                onForgotPassword={() => window.location.href = '/auth/company/forgot-password'}
                onRegister={() => window.location.href = '/auth/company/register'}
                onLoginSuccess={() => window.location.href = '/company/dashboard'}
                loginType="company"
              />
            </AuthPageWrapper>
          } />
          <Route path="company/register" element={
            <AuthPageWrapper title="Empresa">
              <CompanyRegisterPage />
            </AuthPageWrapper>
          } />
          {/* ... other auth routes ... */}
          <Route path="company/reset-password" element={
            <AuthPageWrapper title="Empresa">
              <ResetPasswordForm
                onCancel={() => window.location.href = '/auth/company/login'}
                onResetComplete={() => window.location.href = '/auth/company/login'}
              />
            </AuthPageWrapper>
          } />
        </Route>

        {/* Company App Routes */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="onboarding" element={<OnboardingPage />} />

          {/* Jobs Management */}
          <Route path="jobs" element={<JobsListPage />} />
          <Route path="jobs/new" element={<CreateJobPage />} />
          <Route path="jobs/:id" element={<JobCandidatesPage />} />
        </Route>

        <Route path="/app" element={<CandidateLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<JobsPage onNavigate={() => { }} />} />
          {/* Note: JobsPage and others still expect props, we need to clean them up. 
               For now passing empty func to satisfy TS until we refactor them. */}
          <Route path="my-jobs" element={<MyJobsPage onNavigate={() => { }} />} />
          <Route path="profile" element={<ProfilePage onNavigate={() => { }} />} />
          <Route path="behavioral-test" element={<BehavioralTestPage onNavigate={() => { }} />} />
          <Route path="behavioral-result" element={<BehavioralResultPage onNavigate={() => { }} />} />
          <Route path="notifications" element={<NotificationsPage onNavigate={() => { }} />} />
          <Route path="faq" element={<FAQPage onNavigate={() => { }} />} />
          <Route path="company-profile" element={<CompanyProfilePage onNavigate={() => { }} />} />
          <Route path="professional-registration" element={<ProfessionalRegistration onNavigate={() => { }} onComplete={() => { }} />} />
        </Route>

        {/* Company Routes */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route path="dashboard" element={<CompanyDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
