import React, { useState } from 'react';
import {
    LineChart, Line, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip,
    CartesianGrid, Cell
} from 'recharts';
import { ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// --- MOCK DATA ---
const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const sparklineData = [
    { value: 10 }, { value: 25 }, { value: 18 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }
];

const barChartData = months.map((month) => ({
    name: month,
    primary: Math.floor(Math.random() * 400) + 100,
    secondary: Math.floor(Math.random() * 300) + 50,
}));

// --- COMPONENTS ---

const MetricCard: React.FC<{ title: string; value: string; delta: string; positive?: boolean }> = ({
    title, value, delta, positive = true
}) => (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between h-44">
        <div>
            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-tight mb-4">{title}</h3>
            <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black text-gray-900 leading-none">{value}</span>
                <span className={`text-xs font-bold flex items-center gap-1 ${positive ? 'text-[#10B981]' : 'text-red-500'}`}>
                    {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {delta}
                </span>
            </div>
        </div>
        <div className="h-10 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={positive ? "#10B981" : "#EF4444"}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const PlanCard: React.FC<{ title: string; prev: string; current: string; delta: string; positive?: boolean }> = ({
    title, prev, current, delta, positive = true
}) => (
    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between h-44">
        <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-tight mb-2">{title}</h3>
            <p className="text-[10px] text-gray-400 font-bold mb-1">Anterior: {prev}</p>
            <div className="flex items-baseline gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">Atual:</span>
                    <span className="text-4xl font-black text-gray-900 leading-none">{current}</span>
                </div>
                <span className={`text-xs font-bold flex items-center gap-1 ${positive ? 'text-[#10B981]' : 'text-red-500'}`}>
                    {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {delta}
                </span>
            </div>
        </div>
        <div className="h-10 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={positive ? "#10B981" : "#EF4444"}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex justify-between items-center mb-6 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 shadow-sm">
                Jan/2023 <ChevronDown size={14} />
            </div>
            <span className="text-xs text-gray-400 font-bold">até</span>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 shadow-sm">
                Dez/2023 <ChevronDown size={14} />
            </div>
        </div>
    </div>
);

const ChartBox: React.FC<{ title: string; data: any[]; primaryKey: string; secondaryKey: string }> = ({
    title, data, primaryKey, secondaryKey
}) => (
    <div className="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-10">
            <h3 className="text-lg font-black text-gray-900">{title}</h3>
            <div className="flex items-center gap-1 bg-gray-50/50 px-3 py-1.5 rounded-lg text-[10px] font-bold text-gray-400">
                Jan/2023 <ChevronDown size={12} /> até Dez/2023 <ChevronDown size={12} />
            </div>
        </div>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip
                        cursor={{ fill: '#F8FAFC' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey={primaryKey} fill="#38BDF8" radius={[4, 4, 0, 0]} barSize={12} />
                    <Bar dataKey={secondaryKey} fill="#F04E23" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    return (
        <div className="p-12 max-w-[1600px] mx-auto min-h-screen">

            {/* Indicadores Section */}
            <SectionHeader title="Indicadores" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Vagas ativas" value="32" delta="40%" />
                <MetricCard title="Vagas fechadas" value="48" delta="40%" />
                <MetricCard title="Contratados" value="5" delta="40%" />
                <MetricCard title="Empresas cadastradas" value="5" delta="40%" />
                <MetricCard title="Candidatos cadastrados" value="5" delta="40%" />
                <MetricCard title="Empresas ativas" value="5" delta="40%" />
                <MetricCard title="Candidatos ativos" value="22" delta="40%" />
            </div>

            {/* Planos Section */}
            <SectionHeader title="Planos" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PlanCard title="Qtd. de empresas (Comece)" prev="50" current="63" delta="13 / 26%" />
                <PlanCard title="Qtd. de empresas (Acelere)" prev="100" current="300" delta="200 / 200%" />
                <PlanCard title="Qtd. de empresas (Evolua)" prev="50" current="43" delta="7 / 14%" positive={false} />
            </div>

            {/* Charts Section */}
            <div className="mt-16 space-y-8 pb-12">
                <ChartBox
                    title="% Vagas cadastradas vs Contratados"
                    data={barChartData}
                    primaryKey="primary"
                    secondaryKey="secondary"
                />
                <ChartBox
                    title="Empresas cadastradas vs Empresas ativas"
                    data={barChartData}
                    primaryKey="primary"
                    secondaryKey="secondary"
                />
                <ChartBox
                    title="Candidatos cadastrados vs Candidatos ativos"
                    data={barChartData}
                    primaryKey="primary"
                    secondaryKey="secondary"
                />
                <ChartBox
                    title="Vagas fechadas vs Contratados"
                    data={barChartData}
                    primaryKey="primary"
                    secondaryKey="secondary"
                />
            </div>
        </div>
    );
};

export default Dashboard;
