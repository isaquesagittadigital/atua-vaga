import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Admin Pages
import AdminDashboard from '../components/pages/admin/Dashboard';
import FinanceiroPage from '../components/pages/admin/FinanceiroPage';
import GerenciamentoPage from '../components/pages/admin/GerenciamentoPage';
import CompanyDetailPage from '../components/pages/admin/CompanyDetailPage';
import CandidateDetailPage from '../components/pages/admin/CandidateDetailPage';
import NotificacoesPage from '../components/pages/admin/NotificacoesPage';
import NotificacoesEnviadasPage from '../components/pages/admin/NotificacoesEnviadasPage';
import SuportePage from '../components/pages/admin/SuportePage';

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="financeiro" element={<FinanceiroPage />} />
            <Route path="gerenciamento" element={<GerenciamentoPage />} />
            <Route path="gerenciamento/empresa/:id" element={<CompanyDetailPage />} />
            <Route path="gerenciamento/candidato/:id" element={<CandidateDetailPage />} />
            <Route path="notificacoes" element={<NotificacoesPage />} />
            <Route path="notificacoes/enviadas" element={<NotificacoesEnviadasPage />} />
            <Route path="suporte" element={<SuportePage />} />
        </Routes>
    );
};


export default AdminRoutes;
