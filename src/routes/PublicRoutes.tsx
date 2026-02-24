import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Auth Pages
import LoginHero from '../components/auth/LoginHero';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import RegisterForm from '../components/auth/RegisterForm';
import CompanyRegisterPage from '../components/pages/company/auth/CompanyRegisterPage';
import { Logo } from '../components/ui/Icons';
import JobsPage from '../components/pages/candidate/JobsPage';
import TermsOfUse from '../components/pages/public/TermsOfUse';
import PrivacyPolicy from '../components/pages/public/PrivacyPolicy';

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

const PublicRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Candidate Auth */}
            <Route path="login" element={
                <AuthPageWrapper>
                    <LoginForm
                        onForgotPassword={() => window.location.href = '/auth/forgot-password'}
                        onRegister={() => window.location.href = '/auth/register'}
                        onLoginSuccess={() => window.location.href = '/'}
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
            <Route path="company/forgot-password" element={
                <AuthPageWrapper title="Empresa">
                    <ForgotPasswordForm
                        title="Recuperar acesso Empresa"
                        onBack={() => window.history.back()}
                        onCodeSent={() => window.location.href = '/auth/company/reset-password'}
                    />
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

            {/* Pages and Terms */}
            <Route path="termos" element={<TermsOfUse />} />
            <Route path="privacidade" element={<PrivacyPolicy />} />
            <Route path="vagas" element={<JobsPage />} />
        </Routes>
    );
};

export default PublicRoutes;
