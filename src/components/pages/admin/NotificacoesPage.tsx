import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, Send, X, CheckCircle2 } from 'lucide-react';

const avatarColors = ['#F04E23', '#10B981', '#8B5CF6', '#3B82F6', '#F59E0B', '#EC4899', '#EF4444'];

interface CompanyRow {
    id: string;
    name: string;
    logo_url?: string;
    lastNotification?: string;
    lastDate?: string;
}

const NotificacoesPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [companies, setCompanies] = useState<CompanyRow[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    // Modals
    const [sendModal, setSendModal] = useState<{ open: boolean; companyId?: string; companyName?: string }>({ open: false });
    const [message, setMessage] = useState('');
    const [successModal, setSuccessModal] = useState(false);

    useEffect(() => { fetchCompanies(); }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('companies')
            .select('id, name, logo_url')
            .order('created_at', { ascending: false });

        const rows: CompanyRow[] = (data || []).map(c => ({
            id: c.id,
            name: c.name,
            logo_url: c.logo_url,
        }));

        // If no real companies, add mock data
        if (rows.length === 0) {
            for (let i = 0; i < 7; i++) {
                rows.push({
                    id: `mock-${i}`,
                    name: 'atua vaga',
                    lastNotification: 'Estamos contratando! 🎉 Se você busca uma nova oportunidade ...',
                    lastDate: 'Jan 9, 2025',
                });
            }
        }

        setCompanies(rows);
        setLoading(false);
    };

    const toggleSelect = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelected(next);
    };

    const toggleAll = () => {
        if (selected.size === companies.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(companies.map(c => c.id)));
        }
    };

    const openSendModal = (companyId: string, companyName: string) => {
        setMessage('Estamos contratando! 🎉 Se você busca uma nova oportunidade profissional, temos vagas abertas em diversas áreas. Não perca a chance de fazer parte do nosso time! Envie seu currículo agora e venha crescer com a gente.');
        setSendModal({ open: true, companyId, companyName });
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        const targetIds = sendModal.companyId
            ? [sendModal.companyId]
            : Array.from(selected);

        for (const companyId of targetIds) {
            if (companyId.startsWith('mock-')) continue;
            await supabase.from('notifications').insert({
                user_id: user?.id,
                title: 'Notificação da plataforma',
                message: message,
                type: 'info',
                category: 'Empresa',
                sent_by: user?.id,
                company_id: companyId,
            });
        }

        setSendModal({ open: false });
        setMessage('');
        setSuccessModal(true);
    };

    return (
        <div className="p-12 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="p-6 flex items-center gap-6">
                    <h2 className="text-xl font-black text-gray-900 mr-auto">Notificações</h2>
                    <button
                        onClick={() => navigate('/admin/notificacoes/enviadas')}
                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Ver notificações enviadas
                    </button>
                    <button
                        onClick={() => {
                            if (selected.size === 0) return alert('Selecione ao menos uma empresa.');
                            setMessage('Estamos contratando! 🎉 Se você busca uma nova oportunidade profissional, temos vagas abertas em diversas áreas. Não perca a chance de fazer parte do nosso time! Envie seu currículo agora e venha crescer com a gente.');
                            setSendModal({ open: true });
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F04E23] text-white text-sm font-bold hover:bg-[#d63f15] transition-colors"
                    >
                        <Send size={16} /> Enviar nova notificação
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
                                        checked={selected.size === companies.length && companies.length > 0}
                                        onChange={toggleAll}
                                        className="w-5 h-5 rounded border-gray-300 text-[#F04E23] focus:ring-[#F04E23] accent-[#10B981]"
                                    />
                                </th>
                                <th className="px-6 py-4">Empresa</th>
                                <th className="px-6 py-4">Notificação</th>
                                <th className="px-6 py-4">Data de envio</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((c, i) => (
                                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <input
                                            type="checkbox"
                                            checked={selected.has(c.id)}
                                            onChange={() => toggleSelect(c.id)}
                                            className="w-5 h-5 rounded border-gray-300 text-[#F04E23] focus:ring-[#F04E23] accent-[#10B981]"
                                        />
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                                                {c.logo_url ? (
                                                    <img src={c.logo_url} alt="" className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    <div className="w-5 h-5 bg-purple-500 rounded" />
                                                )}
                                            </div>
                                            <span className="font-bold text-sm text-gray-900">{c.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-500 max-w-xs truncate">
                                        {c.lastNotification || 'Estamos contrata...'}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-500">
                                        {c.lastDate || 'Jan 9, 2025'}
                                    </td>
                                    <td className="px-6 py-5">
                                        <button
                                            onClick={() => openSendModal(c.id, c.name)}
                                            className="text-[#F04E23] text-sm font-bold hover:underline whitespace-nowrap"
                                        >
                                            Enviar notificação
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
                    <span className="text-sm text-gray-500">Total de empresas: <span className="text-[#F04E23] font-bold">{companies.length}</span></span>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Página 1 de 50</span>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Anterior</button>
                        <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Próximo</button>
                    </div>
                </div>
            </div>

            {/* Send Modal */}
            {sendModal.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-black text-gray-900">Reenviar notificação</h3>
                            <button onClick={() => setSendModal({ open: false })} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">Você pode editar, ou reenviar da forma que está.</p>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Mensagem</label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-1 focus:ring-[#F04E23]/20 outline-none text-sm resize-none"
                            />
                        </div>

                        <button
                            onClick={handleSend}
                            className="w-full mt-6 py-3.5 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d63f15] transition-colors text-sm"
                        >
                            Enviar
                        </button>
                        <button
                            onClick={() => setSendModal({ open: false })}
                            className="w-full mt-3 text-center text-sm text-gray-500 font-bold hover:text-gray-700"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {successModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
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

export default NotificacoesPage;
