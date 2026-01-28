import React from 'react';
import { X, Calendar, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    created_at: string;
    link?: string;
}

interface NotificationDetailModalProps {
    notification: Notification | null;
    isOpen: boolean;
    onClose: () => void;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({ notification, isOpen, onClose }) => {
    if (!isOpen || !notification) return null;

    const getIcon = () => {
        switch (notification.type) {
            case 'success': return <CheckCircle className="text-green-500" size={32} />;
            case 'warning': return <AlertTriangle className="text-yellow-500" size={32} />;
            case 'error': return <AlertCircle className="text-red-500" size={32} />;
            default: return <Info className="text-blue-500" size={32} />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Detalhes da Notificação</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-gray-50 rounded-xl shrink-0">
                            {getIcon()}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2">{notification.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                <Calendar size={12} />
                                <span>{formatDate(notification.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 mb-6">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                            {notification.message}
                        </p>
                    </div>

                    {notification.link && (
                        <a
                            href={notification.link}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full text-center bg-[#F04E23] text-white font-bold py-3 rounded-xl hover:bg-[#d93d15] transition-colors"
                        >
                            Acessar Link
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationDetailModal;
