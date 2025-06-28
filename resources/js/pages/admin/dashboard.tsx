import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Transaction, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AllMembers from './_components/all-members';
import MainMetrics from './_components/main-metrics';
import RecentTransaction from './_components/recent-transaction';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Member {
    id: string;
    name: string;
    email: string;
    phone: string;
    expires_at: string;
    days_remaining: number;
    expires_status: string;
}

type Props = {
    trainers: number;
    members: number;
    monthlyRevenue: number;
    recentTransactions: Transaction[];
    expiringMembers: Member[];
    currentMonth: string;
};

export default function Dashboard({ trainers, members, monthlyRevenue, recentTransactions, expiringMembers, currentMonth }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-serif text-4xl text-balance">Fitness Business Intelligence</h1>
                        <p className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString('id-Id', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <div className="flex w-full flex-col gap-2">
                            <Button size={'sm'} asChild>
                                <Link href={route('admin.members.create')}>
                                    <Plus />
                                    New Member
                                </Link>
                            </Button>
                            <Button size={'sm'} variant={'outline'} asChild>
                                <Link href={route('admin.transactions.create')}>Record Transactions</Link>
                            </Button>
                        </div>
                    </div>
                    <MainMetrics totalTrainer={trainers} totalMembers={members} monthlyRevenue={monthlyRevenue} currentMonth={currentMonth} />
                    <div className="col-span-2 rounded-lg border"></div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    <RecentTransaction recentTransactions={recentTransactions} />
                    <AllMembers expiringMembers={expiringMembers} />
                </div>
            </div>
        </AppLayout>
    );
}
