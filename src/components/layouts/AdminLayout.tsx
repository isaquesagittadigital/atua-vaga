import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { Logo } from '../ui/Icons';
import { useAuth } from '@/contexts/AuthContext';

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

                    <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">{profile?.full_name || 'Administrador'}</p>
                            <p className="text-xs text-gray-400 capitalize">{profile?.role}</p>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all overflow-hidden"
                        >
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User size={20} />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 bg-white">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="px-12 py-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-medium">
                <div className="mb-4 md:mb-0">
                    ©atua vaga. Todos os direitos reservados.
                </div>
                <div className="flex gap-6 uppercase tracking-wider">
                    <a href="#" className="hover:text-gray-600 transition-colors">Termos e Condições de Uso</a>
                    <a href="#" className="hover:text-gray-600 transition-colors">Política de Privacidade</a>
                    <a href="/admin/suporte" className="hover:text-gray-600 transition-colors">Ajuda</a>
                </div>
            </footer>
        </div>
    );
};
