import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X, Check } from 'lucide-react';
import FilterMegaMenu, { FilterOption } from './FilterMegaMenu';

interface Filters {
    location: string;
    type: string[];
    salary: string;
    area: string[];
    contract: string[];
    pcd: boolean; // Toggle remains boolean
    startDate: string;
    endDate: string;
    work_schedule: string[];
    seniority: string[];
    pcd_type: string[];
}

// Filter Options are now passed as props for dynamic counts
interface JobsFilterBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    // Dynamic Options
    options: {
        area: FilterOption[];
        contract: FilterOption[];
        schedule: FilterOption[];
        seniority: FilterOption[];
        pcdType: FilterOption[];
        type: FilterOption[];
    }
}

const FilterDropdown: React.FC<{
    label: string;
    active: boolean;
    children: React.ReactNode;
}> = ({ label, active, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${active || isOpen
                    ? 'bg-[#F04E23]/10 text-[#F04E23] border-[#F04E23]'
                    : 'bg-white text-gray-700 border-transparent hover:bg-gray-50'
                    }`}
            >
                {label}
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 min-w-[280px] bg-white rounded-xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};

const JobsFilterBar: React.FC<JobsFilterBarProps> = ({ searchQuery, setSearchQuery, filters, setFilters, options }) => {

    // Helper to update array filters
    const handleArrayFilterChange = (key: keyof Filters, values: string[]) => {
        setFilters(prev => ({ ...prev, [key]: values }));
    };

    const handleFilterChange = (key: keyof Filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value === prev[key] ? '' : value }));
    };

    const resetFilters = () => {
        setFilters({
            location: '',
            type: [],
            salary: '',
            area: [],
            contract: [],
            pcd: false,
            startDate: '',
            endDate: '',
            work_schedule: [],
            seniority: [],
            pcd_type: []
        });
        setSearchQuery('');
    };

    const hasActiveFilters =
        Object.entries(filters).some(([key, val]) => {
            if (Array.isArray(val)) return val.length > 0;
            if (typeof val === 'boolean') return val;
            return val !== '';
        });

    return (
        <div className="flex flex-col items-center w-full mb-10">

            {/* Search Bar */}
            <div className="relative w-full max-w-3xl mb-8">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={22} />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquise pelo cargo, palavra-chave ou empresa"
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-none shadow-lg shadow-gray-200/50 text-gray-700 bg-white focus:ring-4 focus:ring-[#F04E23]/10 outline-none transition-all placeholder:text-gray-400 font-medium text-lg"
                />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">

                {/* 1. Modelo de Trabalho (Mega Menu style for consistency?) user request image shows Dropdown with checkboxes. We can use MegaMenu with 1 col */}
                <FilterMegaMenu
                    label="Modelo de Trabalho"
                    options={options.type}
                    selectedValues={filters.type}
                    onChange={(vals) => handleArrayFilterChange('type', vals)}
                    onClear={() => handleArrayFilterChange('type', [])}
                    columns={1}
                />

                {/* 2. Km de você (Placeholder) */}
                <FilterDropdown label="Km de você" active={!!filters.location}>
                    <div className="p-3 text-sm text-gray-500 text-center">Em breve</div>
                </FilterDropdown>

                {/* 3. Publicação (Date) - Custom */}
                <FilterDropdown label="Publicação" active={!!filters.startDate || !!filters.endDate}>
                    <div className="p-3 flex flex-col gap-2 min-w-[240px]">
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">De:</label>
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F04E23]/20 focus:border-[#F04E23]"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 mb-1 block">Até:</label>
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F04E23]/20 focus:border-[#F04E23]"
                            />
                        </div>
                    </div>
                </FilterDropdown>

                {/* 4. Salário */}
                <FilterMegaMenu
                    label="Salário"
                    options={[{ label: 'A combinar', value: 'A combinar', count: 100 }]} // Placeholder
                    selectedValues={filters.salary ? [filters.salary] : []}
                    onChange={(vals) => handleFilterChange('salary', vals[0] || '')}
                    onClear={() => handleFilterChange('salary', '')}
                    columns={1}
                />

                {/* 5. Área */}
                <FilterMegaMenu
                    label="Área"
                    options={options.area}
                    selectedValues={filters.area}
                    onChange={(vals) => handleArrayFilterChange('area', vals)}
                    onClear={() => handleArrayFilterChange('area', [])}
                />

                {/* 6. Contrato */}
                <FilterMegaMenu
                    label="Contrato"
                    options={options.contract}
                    selectedValues={filters.contract}
                    onChange={(vals) => handleArrayFilterChange('contract', vals)}
                    onClear={() => handleArrayFilterChange('contract', [])}
                />

                {/* 7. Jornada */}
                <FilterMegaMenu
                    label="Jornada"
                    options={options.schedule}
                    selectedValues={filters.work_schedule}
                    onChange={(vals) => handleArrayFilterChange('work_schedule', vals)}
                    onClear={() => handleArrayFilterChange('work_schedule', [])}
                    align="right"
                />

                {/* 8. Senioridade */}
                <FilterMegaMenu
                    label="Senioridade"
                    options={options.seniority}
                    selectedValues={filters.seniority}
                    onChange={(vals) => handleArrayFilterChange('seniority', vals)}
                    onClear={() => handleArrayFilterChange('seniority', [])}
                    align="right"
                />

                {/* 9. PCD */}
                <FilterMegaMenu
                    label="PcD"
                    options={options.pcdType}
                    selectedValues={filters.pcd_type}
                    onChange={(vals) => {
                        handleArrayFilterChange('pcd_type', vals);
                        if (vals.length > 0) setFilters(prev => ({ ...prev, pcd: true }));
                    }}
                    onClear={() => {
                        handleArrayFilterChange('pcd_type', []);
                        setFilters(prev => ({ ...prev, pcd: false }));
                    }}
                    columns={2}
                    align="right"
                />

                {/* Reset Button */}
                {(hasActiveFilters || searchQuery) && (
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-gray-500 hover:text-[#F04E23] transition-colors ml-2"
                    >
                        <X size={16} />
                        Limpar
                    </button>
                )}
            </div>
        </div>
    );
};



export default JobsFilterBar;
