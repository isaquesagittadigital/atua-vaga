import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import { CandidateLayout } from './components/layouts/CandidateLayout';
import { CompanyLayout } from './components/layouts/CompanyLayout';
import { AdminLayout } from './components/layouts/AdminLayout';

// Routes Modules
import PublicRoutes from './routes/PublicRoutes';
import CandidateRoutes from './routes/CandidateRoutes';
import CompanyRoutes from './routes/CompanyRoutes';
import AdminRoutes from './routes/AdminRoutes';

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
    if (profile.role === 'super_admin' || profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/auth/login" replace />; // Fallback
  }

  return <>{children}</>;
};

// Smart redirect based on user role
const RoleBasedRedirect = () => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;

  if (profile) {
    if (profile.role === 'admin' || profile.role === 'super_admin') return <Navigate to="/admin/dashboard" replace />;
    if (profile.role === 'company' || profile.role === 'company_admin' || profile.role === 'company_user') return <Navigate to="/company/dashboard" replace />;
  }
  return <Navigate to="/app/dashboard" replace />;
};

const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root based on role */}
        <Route path="/" element={<RoleBasedRedirect />} />


        {/* Public Routes Module (Auth, Terms, Privacy, Public Jobs) */}
        <Route path="/auth/*" element={<PublicRoutes />} />
        {/* We also want to map the base public routes if they don't have '/auth/' prefix 
            but in our PublicRoutes they are relative. Let's map PublicRoutes at root for non-auth public pages,
            or map them individually if better. 
            Actually, the best way for /termos, /privacidade and /vagas to work at root level 
            is to mount PublicRoutes at both "/" and "/auth". But auth routes would become /login instead of /auth/login.
            Let's adjust this: mount PublicRoutes at /* and inside PublicRoutes we keep /auth path? 
            No, the cleaner way is to keep PublicRoutes at "/*". Let's update that. */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Candidate Module Routes */}
        <Route path="/app/*" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateLayout />
          </ProtectedRoute>
        }>
          <Route path="*" element={<CandidateRoutes />} />
        </Route>

        {/* Company Module Routes */}
        <Route path="/company/*" element={
          <ProtectedRoute allowedRoles={['company_admin', 'company_user']}>
            <CompanyLayout />
          </ProtectedRoute>
        }>
          <Route path="*" element={<CompanyRoutes />} />
        </Route>

        {/* Admin Module Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="*" element={<AdminRoutes />} />
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
