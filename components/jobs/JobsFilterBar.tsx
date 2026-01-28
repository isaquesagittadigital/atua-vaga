
import React from 'react';
import { Search, MapPin, Briefcase, SlidersHorizontal, ChevronDown } from 'lucide-react';

const JobsFilterBar: React.FC = () => {
    return (
        <div className="bg-black py-4 px-6 rounded-b-[32px] md:rounded-[32px] mx-auto max-w-7xl mb-8 -mt-2 relative z-20 shadow-xl">
            <h1 className="text-white text-center text-2xl font-bold mb-6">Encontre sua vaga aqui!</h1>

            <div className="relative max-w-2xl mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Pesquise pelo cargo, palavra-chave ou empresa"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#F04E23]"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar justify-center">
                {['Modelo de trabalho', 'Km de você', 'Publicação', 'Salário', 'Área', 'Contrato', 'PCD'].map((label) => (
                    <button key={label} className="bg-white text-gray-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 whitespace-nowrap active:scale-95 transition-transform">
                        {label}
                        <ChevronDown size={14} />
                    </button>
                ))}
                <button className="bg-gray-600 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-500 whitespace-nowrap">
                    Resetar filtros
                </button>
            </div>
        </div>
    );
};

export default JobsFilterBar;
