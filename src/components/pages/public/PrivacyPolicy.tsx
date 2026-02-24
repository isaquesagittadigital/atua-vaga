import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidade</h1>
                <div className="prose prose-blue">
                    <p className="mb-4">Sua privacidade é importante para nós. Esta política explica como coletamos e usamos suas informações.</p>
                    <h2 className="text-xl font-semibold mt-6 mb-3">Coleta de Dados</h2>
                    <p className="mb-4">Coletamos informações necessárias para oferecer nossos serviços e melhorar a experiência na plataforma.</p>
                    <h2 className="text-xl font-semibold mt-6 mb-3">Uso e Compartilhamento</h2>
                    <p className="mb-4">Não vendemos suas informações. Elas são usadas exclusivamente para conectar candidatos e empresas.</p>
                </div>
                <button onClick={() => window.history.back()} className="mt-8 text-blue-600 hover:text-blue-800 font-medium">
                    &larr; Voltar
                </button>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
