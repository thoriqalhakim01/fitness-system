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
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    user: User;
    members?: Member[];
    training_sessions?: TrainingSession[];
    certifications?: Certification[];
}

export interface Member {
    id: string;
    rfid_uid: string;
    name: string;
    avatar: string;
    email: string;
    phone: string;
    birthdate: string;
    weight: number;
    height: number;
    registration_date: string;
    status: string;
    is_member: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    trainer: Trainer;
    staff: User;
    points: Point;
    attendances: Attendance[];
    logs: MemberLog[];
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

export interface Attendance {
    id: string;
    attendable_id: string;
    attendable_type: string;
    entry_timestamp: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    attendable?: Member | Trainer;

    staff?: User;

    [key: string]: string | number | null;
}

export interface Package {
    id: string;
    name: string;
    price: number;
    points: number;
    duration: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Transaction {
    id: string;
    staff_id: string;
    member_id: string;
    package_id: string;
    transaction_date: string;
    amount: number;
    points: number;
    payment_method: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    staff: User;
    member: Member;
    package: Package;
}

export interface TrainingSession {
    id: string;
    staff_id: string;
    trainer_id: string;
    entry_timestamp: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    members?: Member[];
}

export interface Certification {
    id: string;
    trainer_id: string;
    name: string;
    image: string;
    image_url: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    trainer: Trainer;
}

export interface MemberLog {
    id: string;
    member_id: string;
    trainer_id: string;
    log_date: string;
    notes?: string;
    exercises?: Exercise[];
    weight?: number;
    progress_notes?: string;
    created_at: string;
    trainer: Trainer;
}

export interface Exercise {
    name: string;
    sets: number;
    reps: number;
    weight?: number;
}
