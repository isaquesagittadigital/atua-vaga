import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Candidate Pages
import Dashboard from '../components/pages/candidate/Dashboard';
import JobsPage from '../components/pages/candidate/JobsPage';
import MyJobsPage from '../components/pages/candidate/MyJobsPage';
import ProfessionalRegistrationPage from '../components/pages/candidate/registration/ProfessionalRegistrationPage';
import ProfilePage from '../components/pages/candidate/ProfilePage';
import BehavioralTestPage from '../components/pages/candidate/BehavioralTestPage';
import BehavioralResultPage from '../components/pages/candidate/BehavioralResultPage';
import NotificationsPage from '../components/pages/candidate/NotificationsPage';
import FAQPage from '../components/pages/candidate/FAQPage';
import CompanyProfilePage from '../components/pages/candidate/CompanyProfilePage';

const CandidateRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="jobs" element={<JobsPage onNavigate={() => { }} />} />
            <Route path="my-jobs" element={<MyJobsPage />} />
            <Route path="profile" element={<ProfilePage onNavigate={() => { }} />} />
            <Route path="behavioral-test/:testId" element={<BehavioralTestPage onNavigate={() => { }} />} />
            <Route path="behavioral-result" element={<BehavioralResultPage onNavigate={() => { }} />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="faq" element={<FAQPage onNavigate={() => { }} />} />
            <Route path="company-profile" element={<CompanyProfilePage onNavigate={() => { }} />} />
            <Route path="professional-registration" element={<ProfessionalRegistrationPage />} />
        </Routes>
    );
};

export default CandidateRoutes;
