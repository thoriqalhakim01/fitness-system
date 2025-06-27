import { NavItem } from '@/types';
import { AlarmClockCheck, ArrowLeftRight, Dumbbell, LayoutGrid, MonitorCog, MonitorDot, MonitorSmartphone, SquareLibrary, Users } from 'lucide-react';

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
        icon: AlarmClockCheck,
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
];

export const trainerNavItems: NavItem[] = [
    {
        title: 'Overview',
        href: '/trainer/dashboard',
        icon: MonitorDot,
    },
    {
        title: 'Training Session',
        href: '/trainer/sessions',
        icon: Dumbbell,
    },
];

export const adminFooterItems: NavItem[] = [
    {
        title: 'Cliet Page',
        href: '/check-in',
        icon: MonitorSmartphone,
    },
];
