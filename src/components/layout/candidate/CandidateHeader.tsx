
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../../ui/Icons';
import { Bell, User, HelpCircle, ThumbsUp, LogOut, Instagram, Facebook, Linkedin, X, UserCog, Menu } from 'lucide-react';

import { useAuth } from '../../../contexts/AuthContext';
import { NotificationService, Notification } from '../../../services/NotificationService';
import NotificationDetailModal from '../../modals/NotificationDetailModal';
import { candidateNavigation } from '../../../config/navigation';

export const CandidateHeader: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);

    // Notification States
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Fetch Notifications
    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        if (!user) return;
        const data = await NotificationService.fetchNotifications(user.id);
        setNotifications(data);
    };

    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read locally
        if (!notification.read) {
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
            await NotificationService.markAsRead(notification.id);
        }

        // Open Modal
        setSelectedNotification(notification);
        setShowNotificationModal(true);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
            setIsProfileMenuOpen(false);
            navigate('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const userInitial = user?.user_metadata?.full_name?.charAt(0).toUpperCase() || 'U';
    const userName = user?.user_metadata?.full_name || 'Usuário';
    const userEmail = user?.email || 'email@exemplo.com';

    const isActive = (path: string) => location.pathname.includes(path);

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 lg:px-12 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4 md:gap-12">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-500 hover:text-[#F04E23] transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu size={24} />
                    </button>

                    <Link to="/app/dashboard">
                        <Logo className="scale-75 origin-left cursor-pointer" />
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        {candidateNavigation.main.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`${isActive(item.path) ? 'text-[#F04E23] font-black border-b-2 border-[#F04E23]' : 'text-gray-500 font-bold hover:text-[#F04E23]'} pb-1 transition-colors`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-6">
                    <Link
                        to="/app/professional-registration"
                        className={`p-2 hidden md:block ${isActive('/app/professional-registration') ? 'text-[#F04E23] bg-orange-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'} rounded-lg transition-all`}
                        title="Cadastro Profissional"
                    >
                        <UserCog size={22} />
                    </Link>

                    <div className="relative" ref={notificationRef}>
                        <Link
                            to="/app/notifications"
                            className={`p-2 block ${isActive('/app/notifications') ? 'text-[#F04E23] bg-orange-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'} rounded-lg transition-all relative`}
                        >
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </Link>
                    </div>

                    <div className="relative hidden md:block" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#5AB7F7] focus:outline-none transition-transform active:scale-95 bg-blue-100 flex items-center justify-center text-[#1D4ED8] font-black"
                        >
                            {userInitial}
                        </button>

                        {isProfileMenuOpen && (
                            <div className="absolute right-0 top-full mt-3 w-72 bg-white rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100">
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-blue-100 flex items-center justify-center text-[#1D4ED8] font-black">
                                        {userInitial}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-semibold text-gray-900 text-sm truncate">{userName}</span>
                                        <span className="text-xs text-gray-500 truncate">{userEmail}</span>
                                    </div>
                                </div>

                                <div className="py-2 border-b border-gray-100">
                                    {candidateNavigation.user.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                if (item.action === 'modal') {
                                                    setShowSocialModal(true);
                                                } else {
                                                    navigate(item.path);
                                                }
                                            }}
                                            className="w-full px-5 py-2.5 flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#F04E23] transition-colors text-left"
                                        >
                                            <item.icon size={18} />
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="py-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-5 py-2.5 flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#F04E23] transition-colors text-left"
                                    >
                                        <LogOut size={18} />
                                        <span>Deslogar</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white md:hidden animate-in fade-in slide-in-from-left duration-200 flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <Logo className="scale-75 origin-left" />
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="space-y-2">
                            {candidateNavigation.main.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                                    className={`w-full text-left p-3 rounded-xl font-bold text-lg ${isActive(item.path) ? 'bg-orange-50 text-[#F04E23]' : 'text-gray-600'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <hr className="border-gray-100" />

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1D4ED8] font-black shadow-sm">
                                    {userInitial}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{userName}</p>
                                    <p className="text-xs text-gray-500">{userEmail}</p>
                                </div>
                            </div>

                            {candidateNavigation.user.map((item) => {
                                if (item.action === 'modal') return null; // Skip modal items in mobile menu for now as per original Navbar? No, original had explicit items.
                                // Actually original had: Profile, Professional Registration, FAQ, Logout. 
                                // Professional Registration is NOT in user nav in config but is special.
                                // I should add it here too.
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                                        className="flex items-center gap-3 w-full p-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                                    >
                                        <item.icon size={20} /> {item.label}
                                    </button>
                                );
                            })}

                            <button onClick={() => { navigate('/app/professional-registration'); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl">
                                <UserCog size={20} /> Cadastro Profissional
                            </button>

                            <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl">
                                <LogOut size={20} /> Sair
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Social Media Modal */}
            {showSocialModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-[400px] rounded-[32px] overflow-hidden shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowSocialModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Siga nossas redes!</h3>
                            <p className="text-gray-500 font-bold text-sm">Fique por dentro de todas as novidades.</p>
                        </div>

                        <div className="space-y-4">
                            <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] hover:bg-blue-50 transition-colors group">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#0A66C2] shadow-sm">
                                    <Linkedin size={20} />
                                </div>
                                <span className="font-black text-gray-700 group-hover:text-[#0A66C2] transition-colors">LinkedIn</span>
                            </a>

                            <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] hover:bg-pink-50 transition-colors group">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#E4405F] shadow-sm">
                                    <Instagram size={20} />
                                </div>
                                <span className="font-black text-gray-700 group-hover:text-[#E4405F] transition-colors">Instagram</span>
                            </a>

                            <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAFC] hover:bg-blue-50 transition-colors group">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#1877F2] shadow-sm">
                                    <Facebook size={20} />
                                </div>
                                <span className="font-black text-gray-700 group-hover:text-[#1877F2] transition-colors">Facebook</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
            {/* Notification Detail Modal */}
            <NotificationDetailModal
                notification={selectedNotification}
                isOpen={showNotificationModal}
                onClose={() => setShowNotificationModal(false)}
            />
        </>
    );
};
