import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import AppHeaderLayout from './app/app-header-layout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { auth } = usePage<SharedData>().props;

    if (auth.role === 'trainer') {
        return (
            <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppHeaderLayout>
        );
    }

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppSidebarLayout>
    );
};
