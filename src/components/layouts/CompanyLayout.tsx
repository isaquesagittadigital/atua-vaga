import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, FileText, LogOut } from 'lucide-react';
import { Logo } from '../ui/Icons';

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
                        onClick={() => { }}
                    />
                    <NavItem
                        label="Seleção"
                        onClick={() => { }}
                    />
                </nav>

                <div className="flex items-center gap-6">
                    <button className="text-gray-400 hover:text-[#F04E23] transition-colors relative">
                        <Bell size={22} />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-100"></div>

                    {/* Profile Dropdown Trigger (Mock) */}
                    <div className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-bold text-gray-700 group-hover:text-[#F04E23] transition-colors">Recursos Humanos</p>
                            <p className="text-xs text-gray-400 font-medium">Digital Marketing</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto min-w-0 overflow-y-auto">
                <Outlet />
            </main>
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
