
import { LayoutDashboard, Briefcase, Bookmark, User, HelpCircle, ThumbsUp } from 'lucide-react';

export const candidateNavigation = {
    main: [
        {
            label: 'Início',
            path: '/app/dashboard',
            icon: LayoutDashboard,
            id: 'dashboard'
        },
        {
            label: 'Vagas',
            path: '/app/jobs',
            icon: Briefcase,
            id: 'jobs'
        },
        {
            label: 'Minhas vagas',
            path: '/app/my-jobs',
            icon: Bookmark,
            id: 'my-jobs'
        },
    ],
    user: [
        {
            label: 'Ver perfil',
            path: '/app/profile',
            icon: User,
            action: 'navigate'
        },
        {
            label: 'Suporte',
            path: '/app/faq',
            icon: HelpCircle,
            action: 'navigate'
        },
        {
            label: 'Nossas redes sociais',
            path: '#',
            icon: ThumbsUp,
            action: 'modal'
        }
    ]
};
