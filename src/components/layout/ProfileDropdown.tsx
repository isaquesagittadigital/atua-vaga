import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
    userName?: string;
    userEmail?: string;
    avatarUrl?: string;
    children?: React.ReactNode;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userName, userEmail, avatarUrl, children }) => {
    const { signOut, user, profile } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get info from props, then from auth context profile, then from auth context user metadata
    const name = userName || profile?.full_name || user?.user_metadata?.full_name || 'Usuário';
    const email = userEmail || profile?.email || user?.email || 'email@exemplo.com';
    const avatar = avatarUrl || profile?.avatar_url || user?.user_metadata?.avatar_url;

    // Extract first initial
    const initial = name.charAt(0).toUpperCase();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setIsOpen(false);
        try {
            await signOut();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Garante redirecionamento mesmo em caso de erro
            window.location.href = '/auth/login';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full border-2 border-slate-100 focus:outline-none transition-transform active:scale-95 bg-slate-50 flex items-center justify-center text-[#1D4ED8] font-bold overflow-hidden hover:bg-slate-100 shadow-sm"
            >
                {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span>{initial}</span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                    {/* User Info Section */}
                    <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-50 mb-1">
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center text-[#1D4ED8] font-bold">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span>{initial}</span>
                            )}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-[#1E293B] text-sm truncate">{name}</span>
                            <span className="text-xs text-slate-400 font-medium truncate">{email}</span>
                        </div>
                    </div>

                    {/* Custom Actions */}
                    {children}

                    {/* Logout Section */}
                    <div className="py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 flex items-center gap-3 text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors text-left"
                        >
                            <LogOut size={16} className="text-slate-400" />
                            <span>Sair</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
