import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { SharedData, Transaction, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import QuickStats from './_components/quick-stats';
import SecondStats from './_components/second-stats';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Overview',
        href: '/dashboard',
    },
];

type Props = {
    trainers: number;
    activeMembers: number;
    todayVisits: number;
    monthlyRevenue: number;
    last6MonthsRevenue: Array<{
        month: string;
        revenue: number;
    }>;
    recentTransactions: Transaction[];
};

export default function Dashboard({ trainers, activeMembers, todayVisits, monthlyRevenue, last6MonthsRevenue, recentTransactions }: Props) {
    const { auth } = usePage<SharedData>().props;

    const getCurrentDate = () => {
        return new Date().toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Overview" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 lg:grid-cols-5">
                    <div className="flex h-full flex-col justify-between">
                        <div className="space-y-1">
                            <p className="text-sm">Hello, {auth.user.name}</p>
                            <h1 className="text-3xl font-semibold text-balance">Menage your Fitness business</h1>
                            <p className="text-xs text-muted-foreground">{getCurrentDate()}</p>
                        </div>
                        <div className="mt-4 w-full space-y-2">
                            <Button size={'sm'} className="w-full" asChild>
                                <Link href="">
                                    <Plus />
                                    New Member
                                </Link>
                            </Button>
                            <Button size={'sm'} variant={'outline'} className="w-full" asChild>
                                <Link href="">All transactions</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <QuickStats trainers={trainers} members={activeMembers} todayVisits={todayVisits} monthlyRevenue={monthlyRevenue} />
                    </div>
                </div>
                <SecondStats last6MonthsRevenue={last6MonthsRevenue} recentTransactions={recentTransactions} />
            </div>
        </AppLayout>
    );
}
