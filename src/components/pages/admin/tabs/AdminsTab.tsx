import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, X, ShieldCheck } from 'lucide-react';

interface AdminUser {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
}

const AdminsTab: React.FC = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);

    useEffect(() => { fetchAdmins(); }, []);

    const fetchAdmins = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .in('role', ['admin', 'super_admin'])
            .order('created_at', { ascending: false });
        setAdmins(data || []);
    };

    return (
        <div>
            <div className="px-6 py-4 flex items-center justify-end border-b border-gray-50">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F04E23] text-white text-sm font-bold hover:bg-[#d63f15] transition-colors">
                    <Plus size={16} /> Cadastrar admin
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                            <th className="px-6 py-4">Admin</th>
                            <th className="px-6 py-4">E-mail</th>
                            <th className="px-6 py-4">Nível</th>
                            <th className="px-6 py-4">Criado em</th>
                            <th className="px-6 py-4 text-right w-32"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-white">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <span className="font-bold text-sm text-gray-900">{admin.full_name || '—'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-600">{admin.email}</td>
                                <td className="px-6 py-5">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 capitalize">{admin.role}</span>
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-600">
                                    {admin.created_at ? new Date(admin.created_at).toLocaleDateString('pt-BR') : '—'}
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <button className="text-[#F04E23] hover:text-[#d63f15] p-2"><Pencil size={16} /></button>
                                    <button className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                        {admins.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Nenhum administrador encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminsTab;
