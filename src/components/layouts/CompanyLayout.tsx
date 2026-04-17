import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, FileText, LogOut } from 'lucide-react';
import { Logo } from '../ui/Icons';
import { ProfileDropdown } from '../layout/ProfileDropdown';
import { CandidateFooter } from '../layout/candidate/CandidateFooter';

export const CompanyLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to check active route
    const isActive = (path: string) => location.pathname.includes(path);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col text-[#1E293B]">
            {/* Top Navigation Header */}
            <header className="w-full h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 md:px-10 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/company/dashboard')}>
                    <Logo className="scale-90 origin-left" />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <NavItem
                        label="Indicadores"
                        active={isActive('/dashboard') || isActive('/onboarding')}
                        onClick={() => navigate('/company/dashboard')}
                    />
                    <NavItem
                        label="Minhas vagas"
                        active={isActive('/jobs')}
                        onClick={() => navigate('/company/jobs')}
                    />
                    <NavItem
                        label="Candidatos"
                        active={isActive('/candidates')}
                        onClick={() => navigate('/company/candidates')}
                    />
                    <NavItem
                        label="Seleção"
                        active={isActive('/selection')}
                        onClick={() => navigate('/company/selection')}
                    />
                </nav>

                <div className="flex items-center gap-6">
                    <button className="text-gray-400 hover:text-[#F04E23] transition-colors relative">
                        <Bell size={22} />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-100"></div>

                    <ProfileDropdown />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto min-w-0 overflow-y-auto">
                <Outlet />
            </main>
            <CandidateFooter />
        </div>
    );
};

const NavItem: React.FC<{ label: string, active?: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`relative px-1 py-2 text-[15px] font-bold transition-all ${active ? 'text-[#F04E23]' : 'text-gray-500 hover:text-gray-900'}`}
    >
        {label}
        {active && (
            <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#F04E23] rounded-t-full shadow-[0_-2px_6px_rgba(240,78,35,0.3)]"></span>
        )}
    </button>
);
