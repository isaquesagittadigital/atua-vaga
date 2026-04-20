import React from 'react';
import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-[#1E293B] px-8 py-12 text-white">
                        <div className="flex items-center gap-4 mb-6">
                            <Shield className="w-8 h-8 text-[#F04E23]" />
                            <h1 className="text-3xl font-extrabold tracking-tight">Política de Privacidade</h1>
                        </div>
                        <p className="text-gray-400 max-w-2xl text-lg">
                            Sua privacidade é nossa prioridade. Entenda como protegemos e utilizamos seus dados na Atua Vaga.
                        </p>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Lock className="w-5 h-5 text-[#F04E23]" />
                                    <h2 className="text-xl font-bold text-gray-900">Segurança Máxima</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    Utilizamos tecnologias de criptografia de ponta e protocolos de segurança rigorosos para garantir que seus dados pessoais permaneçam protegidos contra acessos não autorizados.
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Eye className="w-5 h-5 text-[#F04E23]" />
                                    <h2 className="text-xl font-bold text-gray-900">Transparência</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    Acreditamos na clareza total. Você sempre saberá quais dados estamos coletando e por que precisamos deles para oferecer uma experiência personalizada.
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-slate max-w-none">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quais dados coletamos?</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Coletamos informações básicas como nome, e-mail, currículo e histórico profissional. Esses dados são fundamentais para que possamos conectar seu perfil às melhores oportunidades de mercado.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Como usamos seus dados?</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Seus dados são utilizados exclusivamente para:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8">
                                <li>Processar suas candidaturas a vagas de emprego;</li>
                                <li>Personalizar recomendações de vagas;</li>
                                <li>Melhorar continuamente as funcionalidades da plataforma;</li>
                                <li>Enviar comunicações importantes sobre sua conta.</li>
                            </ul>

                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Direitos (LGPD)</h2>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Em conformidade com a Lei Geral de Proteção de Dados, você tem o direito de solicitar o acesso, retificação ou exclusão de seus dados pessoais a qualquer momento através de nossas configurações de conta ou canal de suporte.
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

export default PrivacyPolicy;
