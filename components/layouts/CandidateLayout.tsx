import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../layout/Navbar';

export const CandidateLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (view: string) => {
        switch (view) {
            case 'dashboard':
                navigate('/app/dashboard');
                break;
            case 'jobs':
                navigate('/app/jobs');
                break;
            case 'my-jobs':
                navigate('/app/my-jobs');
                break;
            case 'profile':
                navigate('/app/profile');
                break;
            case 'behavioral-test':
                navigate('/app/behavioral-test');
                break;
            case 'notifications':
                navigate('/app/notifications');
                break;
            case 'faq':
                navigate('/app/faq');
                break;
            case 'login':
                navigate('/auth/login');
                break;
            default:
                navigate(`/app/${view}`);
        }
    };

    // Extract current page text for Navbar highlighting
    const currentPath = location.pathname.split('/').pop() || 'dashboard';

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
            <Navbar onNavigate={handleNavigate} currentPage={currentPath} />
            <Outlet />
        </div>
    );
};
