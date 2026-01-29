
import React from 'react';
import { Outlet } from 'react-router-dom';
import { CandidateHeader } from '../layout/candidate/CandidateHeader';
import { CandidateFooter } from '../layout/candidate/CandidateFooter';

export const CandidateLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
            <CandidateHeader />
            <Outlet />
            <CandidateFooter />
        </div>
    );
};
