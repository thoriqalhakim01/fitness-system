import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { adminFooterItems, adminNavItems, trainerNavItems } from '@/lib/constants/menu';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { NavItem } from '../types/index';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    let navItems: NavItem[];
    let footerNavItems: NavItem[];

    switch (auth.role) {
        case 'admin':
        case 'staff':
            navItems = adminNavItems;
            footerNavItems = adminFooterItems;
            break;
        case 'trainer':
            navItems = trainerNavItems;
            footerNavItems = [];
            break;
        default:
            navItems = [];
            footerNavItems = [];
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
