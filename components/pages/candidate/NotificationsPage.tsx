import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../src/contexts/AuthContext';
import { NotificationService, Notification } from '../../../src/services/NotificationService';
import { Bell, Settings, ChevronRight, Check } from 'lucide-react';
import JobAlertModal from '../../modals/JobAlertModal';

const NotificationsPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [alertsActive, setAlertsActive] = useState(false); // New state for banner Logic

    useEffect(() => {
        if (user) {
            checkAlertStatus();
            fetchNotifications();
        }
    }, [user]);

    const checkAlertStatus = async () => {
        try {
            const { data } = await NotificationService.getAlertSettings(user!.id);
            // If data exists and is active, set true
            if (data && data.is_active) {
                setAlertsActive(true);
            } else {
                setAlertsActive(false);
            }
        } catch (error) {
            console.error("Error checking alert status", error);
        }
    };

    const handleToggleAlerts = async (enable: boolean) => {
        if (!user) return;

        try {
            // If enabling, we might need to create a default record if none exists, or just update is_active
            // For simplicity, we assume the record is upserted with default false initially or handled by backend service
            // Here we just toggle the boolean on the existing record or create one

            await NotificationService.toggleAlerts(user.id, enable);
            setAlertsActive(enable);

        } catch (error) {
            console.error("Error toggling alerts", error);
        }
    };

    const fetchNotifications = async () => {
        setLoading(true);
        const data = await NotificationService.fetchNotifications(user!.id);
        setNotifications(data);
        setLoading(false);
    };

    const handleNotificationClick = async (notif: Notification) => {
        if (!notif.read) {
            await NotificationService.markAsRead(notif.id);
            // Update local state
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
        }
        if (notif.link) {
            navigate(notif.link);
        }
    };

    return (
        <div className="min-h-screen bg-white">


            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Banner Section */}
                {!alertsActive ? (
                    // Disabled State: Show Enable Banner
                    <div className="bg-[#E6F4FF] border border-[#BCE3FF] rounded-xl p-4 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3 text-[#0066CC]">
                            <Bell size={20} fill="#0066CC" />
                            <span className="font-bold text-sm">Ative as notificações <span className="font-normal text-gray-700">para ficar por dentro de todas as atualizações na plataforma.</span></span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => handleToggleAlerts(true)}
                                className="text-[#0066CC] font-bold text-sm border border-[#0066CC] rounded-lg px-4 py-2 hover:bg-[#0066CC]/10 transition-colors"
                            >
                                Habilitar notificações
                            </button>
                            <button className="text-gray-500 font-bold text-sm hover:text-gray-700">
                                Fechar
                            </button>
                        </div>
                    </div>
                ) : (
                    // Enabled State: Show Disable Banner (Optional or different style?)
                    // User asked for a button to deactivate when active.
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3 text-green-700">
                            <Check size={20} />
                            <span className="font-bold text-sm">Notificações ativas! <span className="font-normal text-gray-600">Você receberá alertas de novas vagas.</span></span>
                        </div>
                        <button
                            onClick={() => handleToggleAlerts(false)}
                            className="text-red-500 font-bold text-sm border border-red-200 rounded-lg px-4 py-2 hover:bg-red-50 transition-colors"
                        >
                            Desativar notificações
                        </button>
                    </div>
                )}

                {/* Title & Settings - Only visible logic applied to LIST, but header usually stays? 
               "o botão de a Alerta de vagas e toda esta lista de notificação so ficara visivel para configuração quando o usuario Habilitar"
               So if !alertsActive, hide Settings Button and List.
            */}

                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                    <h1 className="text-3xl font-black text-gray-900">Notificações</h1>

                    {alertsActive && (
                        <button
                            onClick={() => setShowConfigModal(true)}
                            className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#F04E23] transition-colors"
                        >
                            <Settings size={20} />
                            <span>Alerta de vagas</span>
                        </button>
                    )}
                </div>

                {/* Notifications List - Only show if active */}
                {alertsActive ? (
                    <div className="space-y-4">
                        {/* Visits Summary Mock */}
                        <div className="flex items-start gap-3 p-4">
                            <span className="text-2xl">👋</span>
                            <div>
                                <p className="text-gray-800 font-bold">Seu perfil teve 3 visitas nos últimos 3 dias</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-400">Carregando...</div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    onClick={() => handleNotificationClick(notif)}
                                    className="bg-white border-b border-gray-50 p-6 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icon Placeholder - Dynamic based on type later */}
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.read ? 'bg-gray-100' : 'bg-green-100 text-green-600'}`}>
                                            {notif.type === 'job_alert' ? <Bell size={20} /> : <div className="font-bold text-lg">A</div>}
                                        </div>

                                        <div>
                                            <h3 className={`font-bold text-lg ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</h3>
                                            <p className="text-gray-500 text-sm">
                                                {new Date(notif.created_at).toLocaleDateString()} • {notif.message}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-[#F04E23] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Ver detalhes</span>
                                        <ChevronRight size={18} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Bell size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-gray-500 font-bold text-lg">Notificações desativadas</h3>
                        <p className="text-gray-400">Ative para receber alertas de vagas.</p>
                    </div>
                )}

            </div>

            {/* Modal */}
            <JobAlertModal
                isOpen={showConfigModal}
                onClose={() => setShowConfigModal(false)}
            />
        </div>
    );
};

export default NotificationsPage;
