import React, { useState } from 'react';
import {
    LineChart, Line, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip,
    CartesianGrid
} from 'recharts';
import { ChevronDown, ArrowUpRight, ArrowDownRight, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

// --- MOCK DATA ---
const sparkUp = [{ v: 10 }, { v: 20 }, { v: 15 }, { v: 30 }, { v: 25 }, { v: 40 }, { v: 55 }];
const sparkDown = [{ v: 50 }, { v: 45 }, { v: 40 }, { v: 35 }, { v: 28 }, { v: 20 }, { v: 15 }];

const companies = [
    { name: 'atua vaga', resp: 'Joaquim Vinícius', phone: '11 99999-9999', plan: 'Comece', planColor: '#10B981', valor: 'R$50/mês', status: 'Pago', statusColor: '#10B981', totalPago: 'R$5.000', totalVencer: 'R$3.000' },
    { name: 'atua vaga', resp: 'Alice Jennifer', phone: '11 99999-9999', plan: 'Acelere', planColor: '#3B82F6', valor: 'R$50/mês', status: 'Pago', statusColor: '#10B981', totalPago: 'R$7.000', totalVencer: 'R$2.000' },
    { name: 'atua vaga', resp: 'Vitória Francisca', phone: '11 99999-9999', plan: 'Evolua', planColor: '#8B5CF6', valor: 'R$50/mês', status: 'A vencer', statusColor: '#F59E0B', totalPago: 'R$0', totalVencer: 'R$4.000' },
    { name: 'atua vaga', resp: 'Raimundo Caleb', phone: '11 99999-9999', plan: 'Acelere', planColor: '#3B82F6', valor: 'R$50/mès', status: 'A vencer', statusColor: '#F59E0B', totalPago: 'R$10.000', totalVencer: 'R$0' },
    { name: 'atua vaga', resp: 'Victor Matheus', phone: '11 99999-9999', plan: 'Evolua', planColor: '#8B5CF6', valor: 'R$50/mès', status: 'A vencer', statusColor: '#F59E0B', totalPago: 'R$5.000', totalVencer: 'R$3.000' },
    { name: 'atua vaga', resp: 'Yago Nascimento', phone: '11 99999-9999', plan: 'Acelere', planColor: '#3B82F6', valor: 'R$50/mès', status: 'Vencido', statusColor: '#EF4444', totalPago: 'R$7.000', totalVencer: 'R$2.000' },
    { name: 'atua vaga', resp: 'Marina Ramos', phone: '11 99999-9999', plan: 'Evolua', planColor: '#8B5CF6', valor: 'R$50/mès', status: 'Vencido', statusColor: '#EF4444', totalPago: 'R$10.000', totalVencer: 'R$0' },
];

const avatarColors = ['#F04E23', '#10B981', '#8B5CF6', '#3B82F6', '#F59E0B', '#EC4899', '#EF4444'];

// --- SUB COMPONENTS ---
const Sparkline: React.FC<{ color: string; data?: any[] }> = ({ color, data = sparkUp }) => (
    <div className="h-10 w-24">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const MetricCard: React.FC<{ title: string; value: string; delta: string; positive?: boolean }> = ({ title, value, delta, positive = true }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between h-32">
        <div>
            <p className="text-gray-400 text-xs font-bold mb-3 uppercase">{title}</p>
            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-900">{value}</span>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {delta}
                </span>
            </div>
        </div>
        <Sparkline color={positive ? '#10B981' : '#EF4444'} data={positive ? sparkUp : sparkDown} />
    </div>
);

const DateFilter: React.FC = () => (
    <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500">
            Jan/2023 <ChevronDown size={14} />
        </button>
        <span className="text-xs text-gray-400 font-bold">até</span>
        <button className="flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500">
            Dez/2023 <ChevronDown size={14} />
        </button>
    </div>
);

// --- MAIN PAGE ---
const FinanceiroPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;

    return (
        <div className="p-12 max-w-[1600px] mx-auto">
            {/* Indicadores */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Indicadores</h2>
                <DateFilter />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <MetricCard title="Vagas ativas" value="32" delta="40%" />
                <MetricCard title="Vagas fechadas" value="48" delta="40%" />
                <MetricCard title="Contratados" value="5" delta="40%" />
                <MetricCard title="Empresas cadastradas" value="5" delta="40%" />
                <MetricCard title="Candidatos cadastrados" value="5" delta="40%" />
                <MetricCard title="Empresas ativas" value="5" delta="40%" />
            </div>

            {/* Percentuais de pagamento */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Percentuais de pagamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <MetricCard title="Pagos" value="50%" delta="40%" />
                <MetricCard title="A vencer" value="30%" delta="40%" />
                <MetricCard title="Vencidos" value="20%" delta="10%" positive={false} />
            </div>

            {/* Valores unitários */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Valores unitários</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                <MetricCard title="Valor pago" value="R$5.000,00" delta="40%" />
                <MetricCard title="Valor a vencer" value="R$2.500,00" delta="40%" />
                <MetricCard title="Valor vencido" value="R$1.500,00" delta="10%" positive={false} />
            </div>

            {/* Empresas Table */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                {/* Table Header */}
                <div className="p-6 flex flex-wrap items-center gap-4 border-b border-gray-50">
                    <h3 className="text-xl font-black text-gray-900 mr-auto">Empresas</h3>

                    <button className="flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500">
                        Status <ChevronDown size={14} />
                    </button>
                    <button className="flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500">
                        Plano <ChevronDown size={14} />
                    </button>
                    <DateFilter />

                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                        <Download size={14} /> Exportar XLSX
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F04E23] text-white text-xs font-bold hover:bg-[#d63f15] transition-colors">
                        <FileText size={14} /> Exportar PDF
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] font-bold text-gray-400 uppercase border-b border-gray-50">
                                <th className="px-6 py-4">Empresa</th>
                                <th className="px-6 py-4">Responsável</th>
                                <th className="px-6 py-4">Telefone</th>
                                <th className="px-6 py-4">Plano</th>
                                <th className="px-6 py-4">Valor</th>
                                <th className="px-6 py-4">Status ↕</th>
                                <th className="px-6 py-4">Total Pago</th>
                                <th className="px-6 py-4">Total a Vencer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map((c, i) => (
                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
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
                                    <td className="px-6 py-5">
                                        <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: c.planColor }}>
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.planColor }}></span>
                                            {c.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-gray-600">{c.valor}</td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: c.statusColor + '15', color: c.statusColor }}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-900">{c.totalPago}</td>
                                    <td className="px-6 py-5 text-sm font-bold text-gray-900">{c.totalVencer}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-5 flex items-center justify-between border-t border-gray-50">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft size={16} /> Anterior
                    </button>

                    <div className="flex items-center gap-1">
                        {[1, 2, 3, '...', 8, 9, 10].map((page, i) => (
                            <button
                                key={i}
                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${currentPage === page
                                        ? 'bg-[#F04E23] text-white shadow-lg shadow-orange-200'
                                        : typeof page === 'number'
                                            ? 'text-gray-500 hover:bg-gray-100'
                                            : 'text-gray-400 cursor-default'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Próximo <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinanceiroPage;
