import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, FileText, LogOut } from 'lucide-react';
import { Logo } from '../ui/Icons';
import { ProfileDropdown } from '../layout/ProfileDropdown';
import { CandidateFooter } from '../layout/candidate/CandidateFooter';

import { useAuth } from '@/contexts/AuthContext';

export const CompanyLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, company } = useAuth();

    React.useEffect(() => {
        if (user && company !== undefined) {
            const hasCompletedLocal = localStorage.getItem(`onboarding_completed_${user.id}`);
            // Explicitly cast to any to avoid TS errors until supabase.ts types are updated
            const hasCompletedRemote = (company as any)?.onboarding_completed;
            
            if (!hasCompletedLocal && !hasCompletedRemote && !location.pathname.includes('/onboarding')) {
                navigate('/company/onboarding', { replace: true });
            }
            
            // Sync local storage if DB says true
            if (hasCompletedRemote && !hasCompletedLocal) {
                 localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
            }
        }
    }, [user, company, location.pathname, navigate]);

    // Helper to check active route
    const isActive = (path: string) => location.pathname.includes(path);

    const isOnboarding = location.pathname.includes('/onboarding');

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col text-[#1E293B]">
            <header className="w-full h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 md:px-10 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => !isOnboarding && navigate('/company/dashboard')}>
                    <Logo className="scale-90 origin-left" />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavItem
                        label="Indicadores"
                        active={isActive('/dashboard') || isOnboarding} // Highlight the first one or onboarding
                        onClick={() => navigate('/company/dashboard')}
                        disabled={isOnboarding}
                    />
                    <NavItem
                        label="Minhas vagas"
                        active={isActive('/jobs')}
                        onClick={() => navigate('/company/jobs')}
                        disabled={isOnboarding}
                    />
                    <NavItem
                        label="Candidatos"
                        active={isActive('/candidates')}
                        onClick={() => navigate('/company/candidates')}
                        disabled={isOnboarding}
                    />
                    <NavItem
                        label="Seleção"
                        active={isActive('/selection')}
                        onClick={() => navigate('/company/selection')}
                        disabled={isOnboarding}
                    />
                </nav>

                <div className="flex items-center gap-6">
                    <button className="text-gray-400 hover:text-[#F04E23] transition-colors relative">
                        <Bell size={22} />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-100"></div>

                    <ProfileDropdown>
                        <div className="py-1 border-b border-gray-50">
                            <button
                                onClick={() => !isOnboarding && navigate('/company/profile')}
                                disabled={isOnboarding}
                                className={`w-full px-4 py-2 flex items-center gap-3 text-sm font-medium transition-colors text-left ${
                                    isOnboarding 
                                        ? 'text-slate-300 cursor-not-allowed' 
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                    <path d="M3 21h18"/>
                                    <path d="M9 8h1"/>
                                    <path d="M9 12h1"/>
                                    <path d="M9 16h1"/>
                                    <path d="M14 8h1"/>
                                    <path d="M14 12h1"/>
                                    <path d="M14 16h1"/>
                                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
                                </svg>
                                <span>Perfil da Empresa</span>
                            </button>
                        </div>
                    </ProfileDropdown>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto min-w-0 overflow-y-auto">
                <Outlet />
            </main>
            {!isOnboarding && <CandidateFooter />}
        </div>
    );
};

const NavItem: React.FC<{ label: string, active?: boolean, onClick: () => void, disabled?: boolean }> = ({ label, active, onClick, disabled }) => (
    <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`relative px-1 py-2 text-[15px] font-bold transition-all ${active ? 'text-[#F04E23]' : 'text-gray-500'} ${disabled ? 'cursor-default opacity-80' : 'hover:text-gray-900'}`}
    >
        {label}
        {active && (
            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#F04E23] rounded-t-full shadow-[0_-2px_6px_rgba(240,78,35,0.3)]"></span>
        )}
    </button>
);
