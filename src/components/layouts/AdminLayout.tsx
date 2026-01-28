import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, ShieldCheck, Settings, LogOut } from 'lucide-react';
import { Logo } from '../ui/Icons';

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-[#1E293B]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1E293B] text-white flex flex-col sticky top-0 h-screen z-20">
                <div className="p-8 pb-4">
                    <Logo className="scale-75 origin-left" />
                    <div className="mt-2 px-2 py-1 bg-gray-700 text-gray-300 text-xs font-black rounded w-fit uppercase">Admin</div>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Visão Geral" active onClick={() => navigate('/admin/dashboard')} />
                    <SidebarItem icon={<Users size={20} />} label="Usuários" onClick={() => { }} />
                    <SidebarItem icon={<Building2 size={20} />} label="Empresas" onClick={() => { }} />
                    <SidebarItem icon={<ShieldCheck size={20} />} label="Moderação" onClick={() => { }} />
                    <SidebarItem icon={<Settings size={20} />} label="Sistema" onClick={() => { }} />
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button onClick={() => navigate('/auth/login')} className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all font-bold">
                        <LogOut size={20} /> Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all font-bold text-[15px] ${active ? 'bg-[#F04E23] text-white shadow-lg shadow-orange-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        {icon}
        {label}
    </button>
);
