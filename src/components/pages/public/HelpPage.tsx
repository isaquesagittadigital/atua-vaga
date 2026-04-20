import React from 'react';
import { HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react';

const HelpPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Como podemos ajudar?</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Estamos aqui para garantir que sua experiência na Atua Vaga seja a melhor possível.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <HelpCard 
                        icon={<MessageCircle className="w-8 h-8 text-[#F04E23]" />}
                        title="Chat ao Vivo"
                        description="Fale com um de nossos especialistas agora mesmo."
                        action="Iniciar Chat"
                    />
                    <HelpCard 
                        icon={<Mail className="w-8 h-8 text-[#F04E23]" />}
                        title="E-mail"
                        description="Envie-nos sua dúvida e responderemos em até 24h."
                        action="enviar e-mail"
                    />
                    <HelpCard 
                        icon={<Phone className="w-8 h-8 text-[#F04E23]" />}
                        title="Telefone"
                        description="Disponível de segunda a sexta, das 9h às 18h."
                        action="(11) 4004-0000"
                    />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Perguntas Frequentes</h2>
                    <div className="space-y-6">
                        <FAQItem 
                            question="Como me candidatar a uma vaga?"
                            answer="Basta criar seu perfil completo, escolher a vaga desejada e clicar no botão 'Candidatar-se'."
                        />
                        <FAQItem 
                            question="Como recuperar minha senha?"
                            answer="Na tela de login, clique em 'Esqueci minha senha' e siga as instruções enviadas por e-mail."
                        />
                        <FAQItem 
                            question="A Atua Vaga é gratuita para candidatos?"
                            answer="Sim, o uso da plataforma para busca e candidatura a vagas é totalmente gratuito para todos os candidatos."
                        />
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <button 
                        onClick={() => window.history.back()} 
                        className="text-gray-500 hover:text-gray-900 font-medium transition-colors inline-flex items-center gap-2"
                    >
                        <span>&larr;</span> Voltar para a página anterior
                    </button>
                </div>
            </div>
        </div>
    );
};

const HelpCard: React.FC<{ icon: React.ReactNode, title: string, description: string, action: string }> = ({ icon, title, description, action }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-[#F04E23]/30 transition-all group">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">{description}</p>
        <button className="text-[#F04E23] font-bold text-sm hover:underline tracking-wide uppercase">
            {action}
        </button>
    </div>
);

const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => (
    <div className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
        <h4 className="text-lg font-bold text-gray-900 mb-2">{question}</h4>
        <p className="text-gray-600 leading-relaxed">{answer}</p>
    </div>
);

export default HelpPage;
