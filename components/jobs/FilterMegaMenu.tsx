import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface FilterOption {
    label: string;
    value: string;
    count: number;
}

interface FilterMegaMenuProps {
    label: string;
    options: FilterOption[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    onClear?: () => void; // Optional clear specific to this filter
    columns?: number; // Logic to split into columns, default 3
}

const FilterMegaMenu: React.FC<FilterMegaMenuProps> = ({
    label,
    options,
    selectedValues,
    onChange,
    onClear,
    columns = 3
}) => {
    const [isOpen, setIsOpen] = useState(false);
    // Local state for deferred application (to match "Aplicar Filtro" button behavior)
    const [tempSelected, setTempSelected] = useState<string[]>(selectedValues);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync local state when prop changes (e.g. global reset)
    useEffect(() => {
        setTempSelected(selectedValues);
    }, [selectedValues]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Reset temp selection to match actual engaged selection if closed without applying
                setTempSelected(selectedValues);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedValues]);

    const handleToggle = (value: string) => {
        setTempSelected(prev => {
            if (prev.includes(value)) {
                return prev.filter(v => v !== value);
            } else {
                return [...prev, value];
            }
        });
    };

    const handleApply = () => {
        onChange(tempSelected);
        setIsOpen(false);
    };

    const handleClearLocal = () => {
        setTempSelected([]);
    };

    const isActive = selectedValues.length > 0;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${isActive || isOpen
                        ? 'bg-[#F04E23]/10 text-[#F04E23] border-[#F04E23]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
            >
                {label}
                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 min-w-[800px] max-w-[90vw] bg-white rounded-xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                    {/* Grid of Options */}
                    <div className="grid gap-x-8 gap-y-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                        {options.map((option) => (
                            <label key={option.value} className="flex items-start gap-3 cursor-pointer group">
                                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${tempSelected.includes(option.value)
                                        ? 'bg-[#F04E23] border-[#F04E23] text-white'
                                        : 'border-gray-300 group-hover:border-[#F04E23] bg-white'
                                    }`}>
                                    {tempSelected.includes(option.value) && <Check size={12} strokeWidth={3} />}
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={tempSelected.includes(option.value)}
                                        onChange={() => handleToggle(option.value)}
                                    />
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                    {option.label} <span className="text-gray-400 font-medium">({option.count})</span>
                                </span>
                            </label>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleApply}
                            className="px-8 py-2.5 bg-[#F04E23] text-white text-sm font-bold rounded-full hover:bg-[#d63f15] transition-colors shadow-lg shadow-[#F04E23]/20"
                        >
                            Aplicar Filtro
                        </button>
                        <button
                            onClick={handleClearLocal}
                            className="text-sm font-medium text-gray-300 hover:text-gray-500 transition-colors"
                        >
                            Eliminar este filtro
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterMegaMenu;
