import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, Send, X, CheckCircle2 } from 'lucide-react';

interface NotificationRow {
    id: string;
    title: string;
    message: string;
    category: string;
    created_at: string;
    company_name?: string;
}

const NotificacoesEnviadasPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationRow[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [successModal, setSuccessModal] = useState(false);

    useEffect(() => { fetchNotifications(); }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        const rows: NotificationRow[] = (data || []).map(n => ({
            id: n.id,
            title: n.title || '',
            message: n.message || '',
            category: n.category || 'Candidato',
            created_at: n.created_at,
            company_name: 'Nome da empresa',
        }));

        // Fill with mock if empty
        if (rows.length === 0) {
            const cats = ['Candidato', 'Empresa'];
            for (let i = 0; i < 7; i++) {
                rows.push({
                    id: `mock-${i}`,
                    title: 'Estamos contratando! 🎉',
                    message: 'Se você busca uma nova oportunidade ...',
                    category: cats[i % 2],
                    created_at: '2025-01-09T00:00:00Z',
                    company_name: 'Nome da empresa',
                });
            }
        }

        setNotifications(rows);
        setLoading(false);
    };

    const toggleSelect = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelected(next);
    };

    const toggleAll = () => {
        if (selected.size === notifications.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(notifications.map(n => n.id)));
        }
    };

    const handleResend = async () => {
        if (selected.size === 0) return;

        const toResend = notifications.filter(n => selected.has(n.id) && !n.id.startsWith('mock-'));
        for (const n of toResend) {
            await supabase.from('notifications').insert({
                user_id: user?.id,
                title: n.title,
                message: n.message,
                type: 'info',
                category: n.category,
                sent_by: user?.id,
            });
        }

        setSelected(new Set());
        setSuccessModal(true);
        fetchNotifications();
    };

    const categoryColors: Record<string, { bg: string; text: string }> = {
        Candidato: { bg: '#FFF7ED', text: '#F04E23' },
        Empresa: { bg: '#F0F9FF', text: '#64748B' },
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="p-12 max-w-[1600px] mx-auto">
            {/* Back */}
            <button onClick={() => navigate('/admin/notificacoes')} className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-6 hover:text-gray-900 transition-colors">
                <ChevronLeft size={18} /> Voltar
            </button>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="p-6 flex items-center gap-6">
                    <h2 className="text-xl font-black text-gray-900 mr-auto">Todas as notificações</h2>
                    <button
                        onClick={handleResend}
                        disabled={selected.size === 0}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${selected.size > 0
                                ? 'bg-[#F04E23] text-white hover:bg-[#d63f15]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Send size={16} /> Enviar novamente
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                                <th className="px-6 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selected.size === notifications.length && notifications.length > 0}
                                        onChange={toggleAll}
                                        className="w-5 h-5 rounded border-gray-300 accent-[#10B981]"
                                    />
                                </th>
                                <th className="px-6 py-4">Notificações</th>
                                <th className="px-6 py-4">Data de envio</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map(n => {
                                const colors = categoryColors[n.category] || categoryColors.Candidato;
                                return (
                                    <tr key={n.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <input
                                                type="checkbox"
                                                checked={selected.has(n.id)}
                                                onChange={() => toggleSelect(n.id)}
                                                className="w-5 h-5 rounded border-gray-300 accent-[#10B981]"
                                            />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 truncate max-w-md">
                                                    {n.title} {n.message && `Se você busca uma nova oportunidade ...`}
                                                </p>
                                                <p className="text-xs text-gray-400">{n.company_name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-500 whitespace-nowrap">
                                            {formatDate(n.created_at)}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-bold border"
                                                style={{
                                                    backgroundColor: colors.bg,
                                                    color: colors.text,
                                                    borderColor: colors.text + '30',
                                                }}
                                            >
                                                {n.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <button
                                                onClick={() => {
                                                    setSelected(new Set([n.id]));
                                                    handleResend();
                                                }}
                                                className="text-[#F04E23] text-sm font-bold hover:underline whitespace-nowrap"
                                            >
                                                Enviar novamente
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
                    <span className="text-sm text-gray-500">Total de notificações: <span className="text-[#F04E23] font-bold">{notifications.length}</span></span>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Página 1 de 50</span>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Anterior</button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Próximo</button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {successModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center relative">
                        <button onClick={() => setSuccessModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={32} className="text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Notificação reenviada</h3>
                        <p className="text-sm text-gray-400 mb-6">A(s) Empresa(s) serão notificadas.</p>
                        <button
                            onClick={() => setSuccessModal(false)}
                            className="w-full py-3.5 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d63f15] transition-colors text-sm"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificacoesEnviadasPage;
