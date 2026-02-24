import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const avatarColors = ['#F04E23', '#10B981', '#8B5CF6', '#3B82F6', '#F59E0B', '#EC4899', '#EF4444'];

const EmpresasTab: React.FC = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('companies')
            .select('*, profiles:owner_id(full_name, phone, updated_at)')
            .order('created_at', { ascending: false });

        setCompanies(data || []);
        setLoading(false);
    };

    // Mock data to fill table while real data is sparse
    const mockCompanies = [
        { id: '1', name: 'Talent Management', resp: 'Joaquim Vinícius', phone: '11 99999-9999', updated: '01/01/2025', apps: 20, lastAccess: '01/01/2025' },
        { id: '2', name: 'Tech Solutions', resp: 'Alice Jennifer', phone: '11 99999-9999', updated: '01/01/2025', apps: 20, lastAccess: '01/01/2025' },
        { id: '3', name: 'Digital Corp', resp: 'Vitória Francisca', phone: '11 99999-9999', updated: '01/01/2025', apps: 20, lastAccess: '01/01/2025' },
        { id: '4', name: 'Innovation Hub', resp: 'Raimundo Caleb', phone: '11 99999-9999', updated: '01/01/2025', apps: 20, lastAccess: '01/01/2025' },
        { id: '5', name: 'StartupOne', resp: 'Victor Matheus', phone: '11 99999-9999', updated: '01/01/2025', apps: 20, lastAccess: '01/01/2025' },
        { id: '6', name: 'GrowthLabs', resp: 'Yago Nascimento', phone: '11 99999-9999', updated: '01/01/2025', apps: 20, lastAccess: '01/01/2025' },
        { id: '7', name: 'Creative Co', resp: 'Marina Ramos', phone: '11 99999-9999', updated: '01/01/2025', apps: 20, lastAccess: '01/01/2025' },
    ];

    const displayData = companies.length > 0
        ? companies.map((c, i) => ({
            id: c.id,
            name: c.name,
            resp: c.profiles?.full_name || '—',
            phone: c.profiles?.phone || '—',
            updated: c.updated_at ? new Date(c.updated_at).toLocaleDateString('pt-BR') : '—',
            apps: 0,
            lastAccess: c.profiles?.updated_at ? new Date(c.profiles.updated_at).toLocaleDateString('pt-BR') : '—',
        }))
        : mockCompanies;

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-100">
                            <th className="px-6 py-4">Empresa</th>
                            <th className="px-6 py-4">Responsável</th>
                            <th className="px-6 py-4">Telefone</th>
                            <th className="px-6 py-4">Data da última atualização</th>
                            <th className="px-6 py-4">Qtd. de aplicações</th>
                            <th className="px-6 py-4">Último acesso</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map((c, i) => (
                            <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs" style={{ backgroundColor: avatarColors[i % avatarColors.length] }}>
                                            {c.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-sm text-gray-900">{c.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-sm text-gray-600">{c.resp}</td>
                                <td className="px-6 py-5 text-sm text-gray-600">{c.phone}</td>
                                <td className="px-6 py-5 text-sm text-gray-600">{c.updated}</td>
                                <td className="px-6 py-5 text-sm text-gray-600 text-center">{c.apps}</td>
                                <td className="px-6 py-5 text-sm text-gray-600">{c.lastAccess}</td>
                                <td className="px-6 py-5">
                                    <button
                                        onClick={() => navigate(`/admin/gerenciamento/empresa/${c.id}`)}
                                        className="text-[#F04E23] text-sm font-bold hover:underline"
                                    >
                                        Ver detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
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
        </div>
    );
};

export default EmpresasTab;
