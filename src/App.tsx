
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
import ProfessionalRegistrationPage from './components/pages/candidate/registration/ProfessionalRegistrationPage';
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

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // Redirect based on actual role
    if (profile.role === 'candidate') return <Navigate to="/app/dashboard" replace />;
    if (profile.role === 'company_admin' || profile.role === 'company_user') return <Navigate to="/company/dashboard" replace />;
    if (profile.role === 'super_admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/auth/login" replace />; // Fallback
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { profile } = useAuth();

  const handleLoginSuccess = () => {
    // This is a backup if the form doesn't handle redirect, but ideally the form logic or the effect below handles it.
    // Actually, inside LoginForm we call onLoginSuccess.
    // We can dynamically redirect here.
    console.log("Login Success triggered", profile);
    // Rely on useEffect or manual check?
    // Since profile might not be loaded *immediately* upon the callback (async state update),
    // we might need to check "profile" in a useEffect or handle it in the callback by refreshing.
    // For now, simple redirect based on expected role or just reload to let ProtectedRoute handle it?
    // Better: navigate to root and let RequireAuth redirect?
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root based on role or to login */}
        <Route path="/" element={
          <ProtectedRoute>
            {/* If we are here, we are logged in. Redirect to dashboard based on role is handled by the guard if we try to access wrong route, 
                      but for root, we need explicit redirect. */}
            <Navigate to="/app/dashboard" replace />
            {/* This Navigate is a bit naive, ideally we check role. 
                     But ProtectedRoute logic above redirects if allowedRoles mismatch. 
                     Since we didn't specify allowedRoles here, it passes. 
                     Let's make a "RootRedirect" component? Or just rely on the user navigating to specific area. */}
          </ProtectedRoute>
        } />

        {/* Auth Routes - Public */}
        <Route path="/auth">
          <Route path="login" element={
            <AuthPageWrapper>
              <LoginForm
                onForgotPassword={() => window.location.href = '/auth/forgot-password'}
                onRegister={() => window.location.href = '/auth/register'}
                onLoginSuccess={() => window.location.href = '/'} // ProtectedRoute will redirect
                loginType="candidate"
              />
            </AuthPageWrapper>
          } />
          <Route path="register" element={
            <AuthPageWrapper>
              <RegisterForm
                onBack={() => window.history.back()}
                onLoginLink={() => window.location.href = '/auth/login'}
                onRegisterComplete={() => window.location.href = '/'}
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
                onLoginSuccess={() => window.location.href = '/'}
                loginType="company"
              />
            </AuthPageWrapper>
          } />
          <Route path="company/register" element={
            <AuthPageWrapper title="Empresa">
              <CompanyRegisterPage />
            </AuthPageWrapper>
          } />
          <Route path="company/reset-password" element={
            <AuthPageWrapper title="Empresa">
              <ResetPasswordForm
                onCancel={() => window.location.href = '/auth/company/login'}
                onResetComplete={() => window.location.href = '/auth/company/login'}
              />
            </AuthPageWrapper>
          } />
        </Route>

        {/* Candidate Routes */}
        <Route path="/app" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<JobsPage onNavigate={() => { }} />} />
          <Route path="my-jobs" element={<MyJobsPage />} />
          <Route path="profile" element={<ProfilePage onNavigate={() => { }} />} />
          <Route path="behavioral-test/:testId" element={<BehavioralTestPage onNavigate={() => { }} />} />
          <Route path="behavioral-result" element={<BehavioralResultPage onNavigate={() => { }} />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="faq" element={<FAQPage onNavigate={() => { }} />} />
          <Route path="company-profile" element={<CompanyProfilePage onNavigate={() => { }} />} />
          <Route path="professional-registration" element={<ProfessionalRegistrationPage />} />
        </Route>

        {/* Company Routes */}
        <Route path="/company" element={
          <ProtectedRoute allowedRoles={['company_admin', 'company_user']}>
            <CompanyLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="onboarding" element={<OnboardingPage />} />
          <Route path="jobs" element={<JobsListPage />} />
          <Route path="jobs/new" element={<CreateJobPage />} />
          <Route path="jobs/:id" element={<JobCandidatesPage />} />
        </Route>

        {/* Public Jobs Route */}
        <Route path="/vagas" element={<JobsPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
