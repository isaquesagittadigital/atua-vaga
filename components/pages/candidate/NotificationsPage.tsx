import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronRight, Bell } from 'lucide-react';
import JobAlertModal from '../../modals/JobAlertModal';
import SuccessModal from '../../modals/SuccessModal';

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [showBanner, setShowBanner] = useState(true);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSaveAlert = () => {
        setShowFilterModal(false);
        setShowSuccessModal(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans">
            {/* Banner */}
            {showBanner && (
                <div className="bg-[#DBEAFE] text-[#1e3a8a] text-sm px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 mx-6 lg:mx-12 mt-6 rounded-[16px]">
                    <div className="flex items-center gap-2">
                        <Bell size={16} className="fill-[#1e3a8a] text-[#1e3a8a]" />
                        <p><span className="font-bold">Ative as notificações</span> para ficar por dentro de todas as atualizações na plataforma.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="px-4 py-1.5 border border-[#60A5FA] text-[#1D4ED8] font-bold rounded-full text-xs hover:bg-blue-200 transition-colors">
                            Habilitar notificações
                        </button>
                        <button onClick={() => setShowBanner(false)} className="text-[#64748B] font-bold text-xs hover:text-[#1e3a8a]">
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            <main className="max-w-[1400px] mx-auto p-6 lg:p-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="flex items-center gap-2 text-[#64748B] font-bold hover:text-[#F04E23] transition-colors"
                    >
                        <Settings size={20} />
                        Alerta de vagas
                    </button>
                </div>

                <div className="space-y-0 divide-y divide-gray-100 bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50">
                    {/* Stats Row */}
                    <div className="p-8 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="text-orange-400 text-lg">🎉</span>
                            <p className="text-gray-600">Seu perfil teve <span className="font-bold text-gray-900">3 visitas</span> nos últimos 3 dias</p>
                        </div>
                    </div>

                    {/* Notification Items */}
                    <NotificationItem
                        logo={<div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">⚡</div>}
                        text={<span><span className="font-bold text-gray-900">Sagitta</span> visualizou seu perfil • 12 horas atrás</span>}
                        onAction={() => { }}
                    />
                    <NotificationItem
                        logo={<div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">R</div>}
                        text={<span><span className="font-bold text-gray-900">Veritase</span> visualizou seu perfil • 1 dias atrás</span>}
                        onAction={() => { }}
                    />
                    <NotificationItem
                        logo={<div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">●</div>}
                        text={<span><span className="font-bold text-gray-900">Provoke</span> visualizou seu perfil • 2 dias atrás</span>}
                        onAction={() => { }}
                    />
                </div>
            </main>

            {showFilterModal && (
                <JobAlertModal
                    onClose={() => setShowFilterModal(false)}
                    onSave={handleSaveAlert}
                />
            )}

            {showSuccessModal && (
                <SuccessModal
                    onClose={() => setShowSuccessModal(false)}
                    onGoToJobs={() => {
                        setShowSuccessModal(false);
                        navigate('/app/jobs');
                    }}
                />
            )}
        </div>
    );
};

const NotificationItem: React.FC<{ logo: React.ReactNode, text: React.ReactNode, onAction: () => void }> = ({ logo, text, onAction }) => (
    <div className="p-8 flex items-center justify-between hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-4">
            {logo}
            <div className="text-gray-600">{text}</div>
        </div>
        <button className="flex items-center gap-1 text-[#F04E23] font-bold text-sm hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100">
            Ver empresa <ChevronRight size={16} />
        </button>
    </div>
);

export default NotificationsPage;
