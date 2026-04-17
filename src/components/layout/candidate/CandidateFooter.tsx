import React from 'react';

export const CandidateFooter: React.FC = () => {
    return (
        <footer className="w-full py-8 md:py-12 border-t border-gray-100 bg-[#FBFBFB] text-[13px] text-gray-500 shrink-0 px-6">
            <div className="max-w-[1480px] w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 text-center md:text-left">
                <p className="font-normal opacity-80">©atua vaga. Todos os direitos reservados.</p>
                <div className="flex items-center gap-12 mt-6 md:mt-0">
                    <a href="#" className="hover:text-gray-900 transition-colors font-medium">Termos e Condições de Uso</a>
                    <a href="#" className="hover:text-gray-900 transition-colors font-medium">Política de Privacidade</a>
                    <a href="#" className="hover:text-gray-900 transition-colors font-medium">Ajuda</a>
                </div>
            </div>
        </footer>
    );
};
