import { NavItem } from '@/types';
import { ArrowLeftRight, ChartSpline, Dumbbell, LayoutGrid, MonitorCheck, MonitorCog, MonitorSmartphone, SquareLibrary, Users } from 'lucide-react';

export const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Trainers',
        href: '/dashboard/trainers',
        icon: Dumbbell,
    },
    {
        title: 'Members',
        href: '/dashboard/members',
        icon: Users,
    },
    {
        title: 'Attendance History',
        href: '/dashboard/attendances',
        icon: Users,
    },
    {
        title: 'Packages',
        href: '/dashboard/packages',
        icon: SquareLibrary,
    },
    {
        title: 'Transactions',
        href: '/dashboard/transactions',
        icon: ArrowLeftRight,
    },
    {
        title: 'Staffs',
        href: '/dashboard/staffs',
        icon: MonitorCog,
    },
    {
        title: 'Report & Analytics',
        href: '/dashboard/report-analytics',
        icon: ChartSpline,
    },
];

export const trainerNavItems: NavItem[] = [
    {
        title: 'Members',
        href: '/trainer/members',
        icon: Users,
    },
    {
        title: 'Training Sessions',
        href: '/trainer/training-sessions',
        icon: MonitorCheck,
    },
];

export const adminFooterItems: NavItem[] = [
    {
        title: 'Cliet Page',
        href: '/check-in',
        icon: MonitorSmartphone,
    },
];
