import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Plan {
    id: string;
    name: string;
    price: number;
    max_jobs: number;
    max_users: number;
}

const PlanosTab: React.FC = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({ name: '', price: '', max_jobs: '', max_users: '' });

    useEffect(() => { fetchPlans(); }, []);

    const fetchPlans = async () => {
        const { data } = await supabase.from('admin_plans').select('*').order('price');
        setPlans(data || []);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return;
        const payload = {
            name: formData.name,
            price: Number(formData.price) || 0,
            max_jobs: Number(formData.max_jobs) || 10,
            max_users: Number(formData.max_users) || 5,
        };
        if (editingPlan) {
            await supabase.from('admin_plans').update(payload).eq('id', editingPlan.id);
        } else {
            await supabase.from('admin_plans').insert(payload);
        }
        setModalOpen(false);
        setEditingPlan(null);
        setFormData({ name: '', price: '', max_jobs: '', max_users: '' });
        fetchPlans();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este plano?')) return;
        await supabase.from('admin_plans').delete().eq('id', id);
        fetchPlans();
    };

    const openEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData({ name: plan.name, price: String(plan.price), max_jobs: String(plan.max_jobs), max_users: String(plan.max_users) });
        setModalOpen(true);
    };

    const planColors: Record<string, string> = { 'Comece': '#10B981', 'Acelere': '#3B82F6', 'Evolua': '#8B5CF6' };

    return (
        <div>
            <div className="px-6 py-4 flex items-center justify-end border-b border-gray-50">
                <button onClick={() => { setEditingPlan(null); setFormData({ name: '', price: '', max_jobs: '', max_users: '' }); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F04E23] text-white text-sm font-bold hover:bg-[#d63f15] transition-colors">
                    <Plus size={16} /> Cadastrar plano
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                            <th className="px-6 py-4">Plano</th>
                            <th className="px-6 py-4">Preço</th>
                            <th className="px-6 py-4">Max Vagas</th>
                            <th className="px-6 py-4">Max Usuários</th>
                            <th className="px-6 py-4 text-right w-32"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map(plan => (
                            <tr key={plan.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <span className="flex items-center gap-2 text-sm font-bold" style={{ color: planColors[plan.name] || '#64748B' }}>
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: planColors[plan.name] || '#64748B' }}></span>
                                        {plan.name}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-sm font-bold text-gray-900">R${plan.price}/mês</td>
                                <td className="px-6 py-5 text-sm text-gray-600">{plan.max_jobs}</td>
                                <td className="px-6 py-5 text-sm text-gray-600">{plan.max_users}</td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => openEdit(plan)} className="text-[#F04E23] hover:text-[#d63f15] p-2"><Pencil size={16} /></button>
                                    <button onClick={() => handleDelete(plan.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900">{editingPlan ? 'Editar Plano' : 'Cadastrar Plano'}</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Nome do Plano</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] outline-none" placeholder="Ex.: Comece" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Preço (R$/mês)</label>
                                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] outline-none" placeholder="50" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Max Vagas</label>
                                    <input type="number" value={formData.max_jobs} onChange={e => setFormData({ ...formData, max_jobs: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Max Usuários</label>
                                    <input type="number" value={formData.max_users} onChange={e => setFormData({ ...formData, max_users: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] outline-none" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button onClick={() => setModalOpen(false)} className="px-6 py-3 text-gray-500 font-bold">Cancelar</button>
                            <button onClick={handleSave} className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d63f15] transition-colors">
                                {editingPlan ? 'Salvar' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanosTab;
