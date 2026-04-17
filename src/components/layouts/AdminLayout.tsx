import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { Logo } from '../ui/Icons';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileDropdown } from '../layout/ProfileDropdown';

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut, profile } = useAuth();

    const menuItems = [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Financeiro', path: '/admin/financeiro' },
        { label: 'Gerenciamento', path: '/admin/gerenciamento' },
    ];

    return (
        <div className="min-h-screen bg-white font-sans flex flex-col text-[#1E293B]">
            {/* Header / Top Navigation */}
            <header className="h-20 bg-white border-b border-gray-100 flex items-center px-8 sticky top-0 z-50">
                <div className="flex items-center gap-2 mr-12">
                    <Logo className="scale-75 origin-left" />
                </div>

                <nav className="flex items-center gap-8 flex-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`text-sm font-bold transition-all px-1 py-2 border-b-2 ${isActive
                                    ? 'border-[#F04E23] text-[#F04E23]'
                                    : 'border-transparent text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/admin/notificacoes')} className="text-gray-400 hover:text-gray-600 relative">
                        <Bell size={24} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="pl-6 border-l border-gray-100">
                        <ProfileDropdown />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 bg-white">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="w-full py-8 md:py-12 px-6 lg:px-24 border-t border-gray-100 bg-[#FBFBFB] text-[13px] text-gray-500 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4 md:gap-0 text-center md:text-left">
                <p className="font-normal opacity-80">©atua vaga. Todos os direitos reservados.</p>
                <div className="flex items-center gap-12 mt-6 md:mt-0">
                    <a href="#" className="hover:text-gray-900 transition-colors font-medium">Termos e Condições de Uso</a>
                    <a href="#" className="hover:text-gray-900 transition-colors font-medium">Política de Privacidade</a>
                    <a href="/admin/suporte" className="hover:text-gray-900 transition-colors font-medium">Ajuda</a>
                </div>
            </footer>
        </div>
    );
};
