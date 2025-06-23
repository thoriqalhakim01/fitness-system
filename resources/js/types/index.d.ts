import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    role: string | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export interface FilterParams {
    page?: number;
    search?: string;
    status?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
    [key: string]: string | number | undefined | null;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Trainer {
    id: string;
    rfid_uid: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    user: User;
    members?: Member[];
    training_sessions?: TrainingSession[];
}

export interface Member {
    id: string;
    rfid_uid: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    registration_date: string | null;
    status: string;
    is_member: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    trainer: Trainer;
    staff: User;
    points: Point;
}

export interface TrainingSession {
    id: string;
    entry_timestamp: string;

    staff?: User;
    trainer?: Trainer;
}

export interface Point {
    id: string;
    points: number;
    expires_at: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
