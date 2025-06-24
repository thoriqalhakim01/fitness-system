import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Member, Package, Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import CreateTransactionForm from './_components/create-transaction-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/dashboard/transactions',
    },
    {
        title: 'Create',
        href: '/dashboard/transactions/create',
    },
];

type Props = {
    trainers: Trainer[];
    members: Member[];
    options: Package[];
    error?: string;
};

export default function CreateTransaction({ trainers, members, options, error }: Props) {
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Record a Transaction</h1>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('admin.transactions.index')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto w-full max-w-lg">
                    <CreateTransactionForm members={members || []} options={options || []} />
                </div>
            </div>
        </AppLayout>
    );
}
