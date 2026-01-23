import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, X, Check } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    { question: "Como crio e publico uma vaga de emprego na plataforma?", answer: "Para criar uma vaga, acesse o painel 'Vagas' e clique em 'Nova Vaga'. Preencha os detalhes e clique em publicar." },
    { question: "Como funciona o pagamento recorrente e a renovação automática da vaga?", answer: "O pagamento é cobrado mensalmente. A renovação ocorre automaticamente a menos que seja cancelada." },
    { question: "Quais informações são obrigatórias para cadastrar uma vaga?", answer: "Título, descrição, requisitos, local e faixa salarial são obrigatórios." },
    { question: "É possível editar ou remover uma vaga após a publicação?", answer: "Sim, você pode editar ou pausar vagas a qualquer momento no seu painel." },
    { question: "Como a plataforma garante a segurança dos meus dados e dos candidatos?", answer: "Utilizamos criptografia de ponta a ponta e seguimos rigorosamente a LGPD para proteger todas as informações." },
];

const FAQPage: React.FC = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleSendQuestion = () => {
        setShowContactModal(false);
        setShowSuccessModal(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
            <main className="flex-1 max-w-[800px] mx-auto w-full p-6 lg:p-12">
                <button onClick={() => navigate('/app/dashboard')} className="flex items-center gap-2 text-gray-500 font-bold hover:text-[#F04E23] mb-8 transition-colors">
                    <ChevronLeft size={20} />
                    Voltar
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Dúvidas Frequentes</h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">Encontre abaixo respostas rápidas para as principais dúvidas sobre os recursos e funcionalidades da plataforma.</p>
                </div>

                <div className="space-y-4 mb-20">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-[20px] border border-gray-100 overflow-hidden transition-all hover:border-orange-100 hover:shadow-sm">
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full p-6 flex items-center justify-between text-left gap-4"
                            >
                                <span className="font-bold text-gray-800 text-lg">{faq.question}</span>
                                <div className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${openIndex === index ? 'border-[#F04E23] text-[#F04E23]' : 'border-orange-100 text-orange-400'}`}>
                                    {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                                </div>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 pt-0 text-gray-500 leading-relaxed text-[15px] animate-in slide-in-from-top-1 fade-in duration-200">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-[#F8FAFC] rounded-[32px] p-12 text-center relative overflow-hidden">
                    <div className="flex justify-center -space-x-4 mb-6">
                        <img className="w-12 h-12 rounded-full border-4 border-[#F8FAFC] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="" />
                        <img className="w-14 h-14 rounded-full border-4 border-[#F8FAFC] object-cover z-10 -mt-2" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="" />
                        <img className="w-12 h-12 rounded-full border-4 border-[#F8FAFC] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="" />
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3">Ainda precisa de ajuda?</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">Entre em contato com nosso time para que possamos lhe ajudar.</p>

                    <button
                        onClick={() => setShowContactModal(true)}
                        className="px-10 py-3.5 bg-[#F04E23] text-white font-bold rounded-xl hover:bg-[#d63f15] transition-all shadow-lg shadow-orange-500/20"
                    >
                        Entrar em contato
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-100 bg-white py-8 mt-auto">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-gray-500 font-medium">
                    <p>©atua vaga. Todos os direitos reservados.</p>
                    <div className="flex items-center gap-6">
                        <button className="hover:text-[#F04E23] transition-colors">Termos e Condições de Uso</button>
                        <button className="hover:text-[#F04E23] transition-colors">Política de Privacidade</button>
                        <button className="hover:text-[#F04E23] transition-colors text-[#F04E23] font-bold">Ajuda</button>
                    </div>
                </div>
            </footer>

            {/* Contact Modal */}
            {showContactModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-[500px] rounded-[32px] overflow-hidden shadow-2xl p-10 animate-in zoom-in-95 duration-300 relative">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-black text-gray-900 mb-3">Como podemos ajudar?</h3>
                            <p className="text-gray-500 font-medium">Preencha o seu e-mail e descreva sua dúvida para que possamos lhe ajudar.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">E-mail</label>
                                <input type="email" placeholder="aluno@gmail.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all font-medium" />
                                <p className="text-xs text-gray-400 font-bold mt-2">Deve ser o mesmo e-mail utilizado na compra.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-600 mb-2">Dúvida</label>
                                <textarea
                                    placeholder="Descreva sua dúvida..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#F04E23] focus:ring-2 focus:ring-[#F04E23]/10 outline-none transition-all h-32 resize-none font-medium"
                                ></textarea>
                            </div>

                            <div className="space-y-3 pt-2">
                                <button
                                    onClick={handleSendQuestion}
                                    className="w-full py-4 bg-[#F04E23] text-white font-black rounded-xl hover:bg-[#d63f15] transition-all shadow-lg shadow-orange-500/20"
                                >
                                    Enviar
                                </button>
                                <button
                                    onClick={() => setShowContactModal(false)}
                                    className="w-full py-3 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-[450px] rounded-[32px] overflow-hidden shadow-2xl p-10 py-12 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-[#EBFBF5] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-8">
                            <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center text-white">
                                <Check size={40} strokeWidth={4} />
                            </div>
                        </div>

                        <h3 className="text-3xl font-black text-gray-900 mb-4">Dúvida enviada!</h3>
                        <p className="text-gray-500 text-lg leading-relaxed mb-10 px-4 font-bold">
                            Em até 3 dias úteis você receberá um resposta.
                        </p>

                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                navigate('/app/dashboard');
                            }}
                            className="w-full py-4 bg-[#F04E23] text-white font-black rounded-xl hover:bg-[#d63f15] transition-all shadow-lg shadow-orange-500/20 text-lg"
                        >
                            Ir para página inicial
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FAQPage;
