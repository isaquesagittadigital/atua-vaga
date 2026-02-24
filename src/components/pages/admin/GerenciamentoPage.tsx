import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import EmpresasTab from './tabs/EmpresasTab';
import CandidatosTab from './tabs/CandidatosTab';
import CargosTab from './tabs/CargosTab';
import PlanosTab from './tabs/PlanosTab';
import AdminsTab from './tabs/AdminsTab';

const tabs = ['Empresas', 'Candidatos', 'Cargos', 'Planos', 'Admins'];

const GerenciamentoPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Empresas');

    const tabTitle = activeTab;

    return (
        <div className="p-12 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="p-6 flex flex-wrap items-center gap-6 border-b border-gray-100">
                    <h2 className="text-xl font-black text-gray-900">{tabTitle}</h2>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500">
                            Jan/2023 <ChevronDown size={14} />
                        </button>
                        <span className="text-xs text-gray-400 font-bold">até</span>
                        <button className="flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-500">
                            Dez/2023 <ChevronDown size={14} />
                        </button>
                    </div>
                </div>

                {/* Tabs + Search */}
                <div className="px-6 pt-4 flex items-center gap-6 border-b border-gray-100">
                    <div className="flex items-center gap-0">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === tab
                                        ? 'border-[#F04E23] text-gray-900'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {(activeTab === 'Empresas' || activeTab === 'Candidatos') && (
                        <div className="ml-auto relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por palavra-chave"
                                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm w-64 focus:border-[#F04E23] focus:ring-1 focus:ring-[#F04E23]/20 outline-none"
                            />
                        </div>
                    )}
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'Empresas' && <EmpresasTab />}
                    {activeTab === 'Candidatos' && <CandidatosTab />}
                    {activeTab === 'Cargos' && <CargosTab />}
                    {activeTab === 'Planos' && <PlanosTab />}
                    {activeTab === 'Admins' && <AdminsTab />}
                </div>
            </div>
        </div>
    );
};

export default GerenciamentoPage;
