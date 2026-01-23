import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    percentage: number;
    trend: 'up' | 'down';
    chartColor?: string; // Hex color for the mini chart
    isRed?: boolean; // For the "Tempo médio" red card variant
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, percentage, trend, chartColor = '#10B981', isRed = false }) => {
    // Simple SVG Path for a wave chart
    const wavePath = "M0,25 C10,25 15,10 25,10 C35,10 40,25 50,25 C60,25 65,5 75,5 C85,5 90,20 100,0";

    return (
        <div className={`bg-white rounded-[24px] p-6 border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-md transition-all relative overflow-hidden group ${isRed ? 'border-red-50' : ''}`}>
            <h3 className="font-bold text-gray-800 text-sm mb-4">{title}</h3>

            <div className="flex items-end gap-3 mb-2 relative z-10">
                <span className="text-4xl font-black text-gray-900">{value}</span>
                <div className={`flex items-center gap-1 text-xs font-bold mb-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {percentage}%
                </div>
            </div>

            {/* Decor chart area */}
            <div className="absolute right-0 bottom-4 w-24 h-12 opacity-80">
                <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id={`grad-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{ stopColor: chartColor, stopOpacity: 0.2 }} />
                            <stop offset="100%" style={{ stopColor: chartColor, stopOpacity: 0 }} />
                        </linearGradient>
                    </defs>
                    <path d={wavePath} fill="none" stroke={chartColor} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <path d={`${wavePath} L100,50 L0,50 Z`} fill={`url(#grad-${title})`} />
                </svg>
            </div>
        </div>
    );
};

export default MetricCard;
