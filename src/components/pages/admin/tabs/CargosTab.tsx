import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';

interface Role {
    id: string;
    name: string;
    facet: string;
}

const CargosTab: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({ name: '', facet: '' });

    useEffect(() => { fetchRoles(); }, []);

    const fetchRoles = async () => {
        setLoading(true);
        const { data } = await supabase.from('admin_roles').select('*').order('created_at');
        setRoles(data || []);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!formData.name.trim()) return;
        if (editingRole) {
            await supabase.from('admin_roles').update({ name: formData.name, facet: formData.facet }).eq('id', editingRole.id);
        } else {
            await supabase.from('admin_roles').insert({ name: formData.name, facet: formData.facet });
        }
        setModalOpen(false);
        setEditingRole(null);
        setFormData({ name: '', facet: '' });
        fetchRoles();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este cargo?')) return;
        await supabase.from('admin_roles').delete().eq('id', id);
        fetchRoles();
    };

    const openEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({ name: role.name, facet: role.facet || '' });
        setModalOpen(true);
    };

    const openCreate = () => {
        setEditingRole(null);
        setFormData({ name: '', facet: '' });
        setModalOpen(true);
    };

    const filtered = roles.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.facet || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {/* Actions bar */}
            <div className="px-6 py-4 flex items-center justify-end border-b border-gray-50">
                <div className="relative mr-auto">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por palavra-chave"
                        className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm w-72 focus:border-[#F04E23] focus:ring-1 focus:ring-[#F04E23]/20 outline-none"
                    />
                </div>
                <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F04E23] text-white text-sm font-bold hover:bg-[#d63f15] transition-colors">
                    <Plus size={16} /> Cadastrar cargo
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                            <th className="px-6 py-4 w-1/2">Cargo</th>
                            <th className="px-6 py-4 w-1/3">Faceta</th>
                            <th className="px-6 py-4 text-right w-32"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(role => (
                            <tr key={role.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-5 text-sm font-bold text-gray-900">{role.name}</td>
                                <td className="px-6 py-5 text-sm text-gray-600">{role.facet}</td>
                                <td className="px-6 py-5 text-right">
                                    <button onClick={() => openEdit(role)} className="text-[#F04E23] hover:text-[#d63f15] p-2 transition-colors">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(role.id)} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-gray-400">Nenhum cargo encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-6 text-sm">
                    <span className="text-gray-500">Total de candidatos: <span className="text-[#F04E23] font-bold">5.000</span></span>
                    <span className="text-gray-500">Total de aplicações: <span className="text-[#10B981] font-bold">500</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Página 1 de 10</span>
                    <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Anterior</button>
                    <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">Próximo</button>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900">{editingRole ? 'Editar Cargo' : 'Cadastrar Cargo'}</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Nome do Cargo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-1 focus:ring-[#F04E23]/20 outline-none"
                                    placeholder="Ex.: Gerente de Projetos"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Faceta</label>
                                <input
                                    type="text"
                                    value={formData.facet}
                                    onChange={e => setFormData({ ...formData, facet: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F04E23] focus:ring-1 focus:ring-[#F04E23]/20 outline-none"
                                    placeholder="Ex.: Liderança"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button onClick={() => setModalOpen(false)} className="px-6 py-3 text-gray-500 font-bold">Cancelar</button>
                            <button onClick={handleSave} className="px-8 py-3 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d63f15] transition-colors">
                                {editingRole ? 'Salvar' : 'Cadastrar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CargosTab;
