
import React from 'react';

export const CandidateFooter: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Atua Vaga. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};
