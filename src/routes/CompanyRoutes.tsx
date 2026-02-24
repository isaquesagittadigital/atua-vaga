import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Company Pages
import CompanyDashboard from '../components/pages/company/Dashboard';
import OnboardingPage from '../components/pages/company/onboarding/OnboardingPage';
import JobsListPage from '../components/pages/company/jobs/JobsListPage';
import CreateJobPage from '../components/pages/company/jobs/create/CreateJobPage';
import JobCandidatesPage from '../components/pages/company/jobs/ranking/JobCandidatesPage';

const CompanyRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="onboarding" element={<OnboardingPage />} />
            <Route path="jobs" element={<JobsListPage />} />
            <Route path="jobs/new" element={<CreateJobPage />} />
            <Route path="jobs/:id" element={<JobCandidatesPage />} />
        </Routes>
    );
};

export default CompanyRoutes;
