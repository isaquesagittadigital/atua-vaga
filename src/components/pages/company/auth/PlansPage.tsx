import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Plan {
    id: string;
    name: string;
    priceMonthly: string;
    installmentPrice: string;
    isPopular: boolean;
    features: string[];
}

const plans: Plan[] = [
    {
        id: '1',
        name: 'Comece',
        priceMonthly: '149,90',
        installmentPrice: '14,99',
        isPopular: false,
        features: [
            '1 usuário administrador',
            'Fluxo de aprovação',
            'Habilidades comportamentais vaga',
            'Teste comportamental + Fit Cultural',
            '1 vaga por mês',
            '30 dias de acompanhamento do candidato pós contratação',
            'Ranqueamento de candidatos'
        ]
    },
    {
        id: '2',
        name: 'Acelere',
        priceMonthly: '289,90',
        installmentPrice: '28,99',
        isPopular: false,
        features: [
            'Todas as funcionalidades do plano Comece',
            '2 usuários administrador',
            '10 vagas por mês',
            '90 dias de acompanhamento do candidato pós contratação',
            'Filtros de seleção básicos',
            'Dashboard e relatórios básicos'
        ]
    },
    {
        id: '3',
        name: 'Evolua',
        priceMonthly: '379,90',
        installmentPrice: '37,99',
        isPopular: true,
        features: [
            'Todas as funcionalidades dos planos Comece e Acelere',
            '5 usuários administradores',
            '20 vagas por mês',
            '180 dias de acompanhamento do candidato pós contratação',
            'Filtros de seleção avançados',
            'Dashboard e relatórios avançados',
            'Candidatos instantâneos',
            'Site de carreira',
            'Feedback personalizado do processo seletivo + NPS',
            'Permissões de filiais',
            'Criação de banco de dados exclusivos'
        ]
    },
    {
        id: '4',
        name: 'Personalizado',
        priceMonthly: '499,90',
        installmentPrice: '49,99',
        isPopular: false,
        features: [
            'Todas as funcionalidades dos planos Comece, Acelere e Evolua',
            '10 usuários administradores',
            'Vagas ilimitadas',
            '1 ano de acompanhamento do candidato pós contratação',
            'Feedback personalizado do processo seletivo + NPS + análise de sentimentos'
        ]
    }
];

const PlansPage: React.FC = () => {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = useState<'mensal' | 'trimestral' | 'semestral' | 'anual'>('mensal');

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Planos</h1>
                        <p className="text-gray-500 font-medium text-lg">Escolha o plano perfeito para sua empresa.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/company/onboarding')}
                        className="text-gray-400 font-bold hover:text-gray-600 transition-colors mt-4 md:mt-0"
                    >
                        Contratar depois
                    </button>
                </div>

                {/* Billing Selector */}
                <div className="flex justify-center md:justify-start mb-12">
                    <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
                        {['Mensal', 'Trimestral', 'Semestral', 'Anual'].map((cycle) => (
                            <button
                                key={cycle}
                                onClick={() => setBillingCycle(cycle.toLowerCase() as any)}
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                    billingCycle === cycle.toLowerCase() 
                                    ? 'bg-white shadow-md border border-gray-100 text-gray-900' 
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {cycle}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id}
                            className={`relative bg-white rounded-[32px] p-8 border-2 transition-all flex flex-col h-full ${
                                plan.isPopular 
                                ? 'border-[#F04E23] shadow-xl shadow-orange-100 ring-4 ring-orange-50' 
                                : 'border-gray-100 hover:border-gray-200 shadow-sm'
                            }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#F04E23] text-white px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-lg">
                                    O mais contratado
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-black text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">12x de</span>
                                    <div className="flex items-baseline gap-1 text-[#2563EB] mb-1">
                                        <span className="text-2xl font-black">R$</span>
                                        <span className="text-4xl font-black">{plan.installmentPrice}</span>
                                    </div>
                                    <span className="text-gray-500 font-medium text-sm">Ou R$ {plan.priceMonthly}/mês</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/auth/company/checkout', { state: { plan } })}
                                className={`w-full py-4 rounded-2xl font-black text-[15px] transition-all transform hover:-translate-y-1 mb-10 ${
                                    plan.isPopular 
                                    ? 'bg-[#F04E23] text-white shadow-lg shadow-orange-100 hover:bg-[#E03E13]' 
                                    : 'bg-orange-50 text-[#F04E23] hover:bg-orange-100 border border-orange-100'
                                }`}
                            >
                                Assinar agora
                            </button>

                            <div className="space-y-4 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                            plan.isPopular ? 'bg-orange-50 text-[#F04E23]' : 'bg-green-50 text-green-500'
                                        }`}>
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-gray-600 font-medium text-[13px] leading-snug">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlansPage;
