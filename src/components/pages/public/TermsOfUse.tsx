import React from 'react';
import { FileText, Shield, Scale } from 'lucide-react';

const TermsOfUse: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-[#F04E23] px-8 py-12 text-white">
                        <div className="flex items-center gap-4 mb-6">
                            <Scale className="w-8 h-8" />
                            <h1 className="text-3xl font-extrabold tracking-tight">Termos e Condições de Uso</h1>
                        </div>
                        <p className="text-white/80 max-w-2xl text-lg">
                            Bem-vindo à Atua Vaga. Estes termos regem o uso de nossa plataforma e serviços.
                        </p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F04E23]/10 text-[#F04E23] text-sm">1</span>
                                Aceitação dos Termos
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Ao acessar ou utilizar a plataforma Atua Vaga, você concorda em cumprir e estar vinculado a estes Termos e Condições de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F04E23]/10 text-[#F04E23] text-sm">2</span>
                                Cadastro e Segurança
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Para utilizar certas funcionalidades, você deverá criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. A Atua Vaga reserva-se o direito de suspender contas que infrinjam nossas políticas de segurança.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F04E23]/10 text-[#F04E23] text-sm">3</span>
                                Uso da Plataforma
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                A Atua Vaga funciona como uma ponte entre candidatos e empresas. Os usuários comprometem-se a fornecer informações verídicas e a não utilizar a plataforma para fins ilícitos, spam ou qualquer atividade que prejudique outros usuários.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F04E23]/10 text-[#F04E23] text-sm">4</span>
                                Propriedade Intelectual
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Todo o conteúdo, design e software da plataforma são de propriedade exclusiva da Atua Vaga ou de seus licenciadores, protegidos por leis de direitos autorais e propriedade intelectual.
                            </p>
                        </div>

                        <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-sm text-gray-500 italic">Última atualização: 20 de Abril de 2026</p>
                            <button 
                                onClick={() => window.close()} 
                                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                            >
                                Fechar Guia
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
