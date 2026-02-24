import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Trash2, Pencil, Plus, X, CheckCircle2 } from 'lucide-react';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    sort_order: number;
}

type ModalType = 'none' | 'add' | 'edit' | 'delete' | 'success';

const SuportePage: React.FC = () => {
    const navigate = useNavigate();
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [activeTab, setActiveTab] = useState('Candidato');
    const [loading, setLoading] = useState(true);

    // Modal state
    const [modal, setModal] = useState<ModalType>('none');
    const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
    const [formData, setFormData] = useState({ question: '', answer: '' });
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => { fetchFaqs(); }, []);

    const fetchFaqs = async () => {
        setLoading(true);
        const { data } = await supabase.from('faq').select('*').order('sort_order');
        setFaqs(data || []);
        setLoading(false);
    };

    const filtered = faqs.filter(f => f.category === activeTab);

    // CRUD handlers
    const openAdd = () => {
        setEditingFaq(null);
        setFormData({ question: '', answer: '' });
        setModal('add');
    };

    const openEdit = (faq: FAQ) => {
        setEditingFaq(faq);
        setFormData({ question: faq.question, answer: faq.answer });
        setModal('edit');
    };

    const openDelete = (id: string) => {
        setDeletingId(id);
        setModal('delete');
    };

    const handleSave = async () => {
        if (!formData.question.trim()) return;

        if (editingFaq) {
            await supabase.from('faq').update({
                question: formData.question,
                answer: formData.answer,
            }).eq('id', editingFaq.id);
        } else {
            const maxOrder = filtered.length > 0 ? Math.max(...filtered.map(f => f.sort_order)) + 1 : 1;
            await supabase.from('faq').insert({
                question: formData.question,
                answer: formData.answer,
                category: activeTab,
                sort_order: maxOrder,
            });
        }

        setModal('none');
        fetchFaqs();
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        await supabase.from('faq').delete().eq('id', deletingId);
        setDeletingId(null);
        setModal('none');
        setSuccessMessage('A dúvida foi deletada com sucesso.');
        setModal('success');
        fetchFaqs();
    };

    return (
        <div className="p-12 max-w-[900px] mx-auto">
            {/* Voltar */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold text-sm mb-8 hover:text-gray-900 transition-colors">
                <ChevronLeft size={18} /> Voltar
            </button>

            {/* Title */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-gray-900 mb-3">Dúvidas Frequentes</h1>
                <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
                    Encontre abaixo respostas rápidas para as principais dúvidas sobre os recursos e funcionalidades da plataforma Atua Vaga.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-center gap-0 mb-8">
                {['Candidato', 'Empresa'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === tab
                                ? 'border-[#F04E23] text-[#F04E23]'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-3 mb-4">
                {filtered.map(faq => (
                    <div
                        key={faq.id}
                        className="flex items-center justify-between px-6 py-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group"
                    >
                        <p className="text-sm font-medium text-gray-900 flex-1 pr-4">{faq.question}</p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                onClick={() => openDelete(faq.id)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#F04E23] hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                            <button
                                onClick={() => openEdit(faq)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#F04E23] hover:bg-orange-50 transition-colors"
                            >
                                <Pencil size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add new FAQ row */}
                <button
                    onClick={openAdd}
                    className="flex items-center justify-between w-full px-6 py-5 bg-white border border-dashed border-gray-200 rounded-2xl hover:border-[#F04E23] hover:shadow-md transition-all"
                >
                    <span className="text-sm font-medium text-gray-400">Adicionar dúvida</span>
                    <div className="w-8 h-8 rounded-full border-2 border-[#F04E23] flex items-center justify-center text-[#F04E23]">
                        <Plus size={16} />
                    </div>
                </button>
            </div>

            {/* Help CTA */}
            <div className="text-center mt-16 mb-8">
                <div className="flex justify-center mb-4">
                    <div className="flex -space-x-3">
                        {['#F04E23', '#8B5CF6', '#10B981'].map((color, i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white" style={{ backgroundColor: color, zIndex: 3 - i }} />
                        ))}
                    </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Ainda precisa de ajuda?</h3>
                <p className="text-sm text-gray-400 mb-6">Entre em contato com nosso time para que possamos lhe ajudar.</p>
                <button className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d63f15] transition-colors text-sm">
                    Entrar em contato
                </button>
            </div>

            {/* =========== ADD / EDIT MODAL =========== */}
            {(modal === 'add' || modal === 'edit') && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900">
                                {modal === 'add' ? 'Adicionar dúvida' : 'Editar dúvida'}
                            </h3>
                            <button onClick={() => setModal('none')} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">Dúvida</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                                    placeholder="Escreva a dúvida"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-1 focus:ring-[#F04E23]/20 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2">Conteúdo</label>
                                <textarea
                                    value={formData.answer}
                                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                    placeholder="Escreva o conteúdo da dúvida"
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-1 focus:ring-[#F04E23]/20 outline-none text-sm resize-none"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full mt-6 py-3.5 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d63f15] transition-colors text-sm"
                        >
                            Salvar
                        </button>
                        <button
                            onClick={() => setModal('none')}
                            className="w-full mt-3 text-center text-sm text-gray-500 font-bold hover:text-gray-700"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* =========== DELETE CONFIRMATION MODAL =========== */}
            {modal === 'delete' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center relative">
                        <button onClick={() => setModal('none')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Trash2 size={28} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Você tem certeza que deseja deletar?</h3>
                        <p className="text-sm text-gray-400 mb-6">Essa ação não poderá ser desfeita. Todas as informações serão deletadas.</p>

                        <button
                            onClick={handleDelete}
                            className="w-full py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors text-sm"
                        >
                            Sim, deletar dúvida
                        </button>
                        <button
                            onClick={() => setModal('none')}
                            className="w-full mt-3 text-center text-sm text-gray-500 font-bold hover:text-gray-700"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* =========== SUCCESS MODAL =========== */}
            {modal === 'success' && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center relative">
                        <button onClick={() => setModal('none')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>

                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={32} className="text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Sucesso!</h3>
                        <p className="text-sm text-gray-400 mb-6">{successMessage}</p>

                        <button
                            onClick={() => setModal('none')}
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

export default SuportePage;
