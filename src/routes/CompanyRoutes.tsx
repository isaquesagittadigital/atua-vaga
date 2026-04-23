import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Company Pages
import CompanyDashboard from '../components/pages/company/Dashboard';
import OnboardingPage from '../components/pages/company/onboarding/OnboardingPage';
import JobsListPage from '../components/pages/company/jobs/JobsListPage';
import CreateJobPage from '../components/pages/company/jobs/create/CreateJobPage';
import JobCandidatesPage from '../components/pages/company/jobs/ranking/JobCandidatesPage';
import CandidatesPage from '../components/pages/company/CandidatesPage';
import SelectionPage from '../components/pages/company/SelectionPage';

const CompanyRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="jobs" element={<JobsListPage />} />
            <Route path="jobs/new" element={<CreateJobPage />} />
            <Route path="jobs/edit/:id" element={<CreateJobPage />} />
            <Route path="jobs/:id" element={<JobCandidatesPage />} />
            <Route path="candidates" element={<CandidatesPage />} />
            <Route path="selection" element={<SelectionPage />} />
        </Routes>
    );
};

export default CompanyRoutes;
