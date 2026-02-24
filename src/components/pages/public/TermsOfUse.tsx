import React from 'react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Termos de Uso</h1>
        <div className="prose prose-blue">
          <p className="mb-4">Bem-vindo à Atua Vaga. Ao acessar nosso sistema, você concorda com nossos termos de uso.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Aceitação dos Termos</h2>
          <p className="mb-4">O uso desta plataforma está sujeito à aceitação prévia destes termos e condições.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Responsabilidades do Usuário</h2>
          <p className="mb-4">O usuário é responsável por manter a confidencialidade de sua conta e senha.</p>
        </div>
        <button onClick={() => window.history.back()} className="mt-8 text-blue-600 hover:text-blue-800 font-medium">
          &larr; Voltar
        </button>
      </div>
    </div>
  );
};

export default TermsOfUse;
