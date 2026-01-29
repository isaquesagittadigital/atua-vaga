import React from 'react';
import { Trophy, ChevronLeft } from 'lucide-react';

interface TestResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    testTitle: string;
    scores: Record<string, number>; // e.g., { 'Confiança': 80, 'Modéstia': 20 }
}

const TestResultModal: React.FC<TestResultModalProps> = ({ isOpen, onClose, testTitle, scores }) => {
    if (!isOpen) return null;

    // Hardcoded descriptions for now based on Image 3
    const descriptions: Record<string, string> = {
        'Confiança': 'Pessoas com alta confiança tendem a delegar com mais facilidade e trabalhar bem em equipe, mas podem ser mais vulneráveis a decepções se não forem cautelosas.',
        'Fraqueza': 'A franqueza contribui para uma comunicação clara e assertiva, sendo muito valorizada em ambientes que prezam pela objetividade e integridade.',
        'Altruísmo': 'Pessoas altruístas fortalecem o clima organizacional, contribuindo para ambientes colaborativos e empáticos.',
        'Complacência': 'Um bom nível de complacência favorece a harmonia no time, mas níveis muito altos podem dificultar o enfrentamento de situações que exigem firmeza.',
        'Modéstia': 'Pessoas modestas geralmente são bem-vistas em equipes colaborativas, pois valorizam o coletivo mais do que o ego.',
        'Empatia': 'A empatia é fundamental para o trabalho em equipe, liderança e resolução de conflitos.'
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
            <div className="max-w-[900px] mx-auto px-6 py-10">
                <button onClick={onClose} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8">
                    <ChevronLeft size={20} /> Voltar
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start mb-12 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                            {/* Avatar Placeholder */}
                            <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">José de Alencar</h1>
                            <p className="text-gray-500">Gerente de projetos</p>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-0 flex flex-col items-end">
                        <span className="text-gray-500 font-bold mb-2">Pontuação geral: <span className="text-gray-900">100% de aderência</span></span>
                        <div className="w-full max-w-[300px] h-3 bg-blue-100 rounded-full overflow-hidden flex relative">
                            <div className="bg-[#3B82F6] w-full h-full" />
                            <div className="absolute -right-2 -top-2 bg-[#3B82F6] w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-white shadow-sm">
                                <Trophy size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">{testTitle}</h2>
                <p className="text-gray-500 mb-10">Mostre aos recrutadores seu nível profissional nos testes.</p>

                <div className="space-y-12">
                    {Object.entries(scores).map(([trait, score], index) => (
                        <div key={trait}>
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{trait}</h3>
                                    <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
                                        {descriptions[trait] || 'Descrição indisponível.'}
                                    </p>
                                </div>
                                <span className="font-bold text-gray-900">{score}%</span>
                            </div>
                            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#5AB7F7] rounded-full transition-all duration-1000"
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <footer className="w-full py-10 mt-20 border-t border-gray-100 bg-white text-[13px] text-gray-400 font-bold flex flex-col md:flex-row items-center justify-between shrink-0 text-center md:text-left">
                <p>©atua vaga. Todos os direitos reservados.</p>
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10 mt-6 md:mt-0">
                    <a href="#" className="hover:text-gray-900 transition-colors">Termos e Condições de Uso</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Política de Privacidade</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Ajuda</a>
                </div>
            </footer>
        </div>
    );
};

export default TestResultModal;
