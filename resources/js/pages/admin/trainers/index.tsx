import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainers',
        href: '/dashboard/trainers',
    },
];

type Props = {
    trainers: Trainer[];
};

export default function Trainers({ trainers }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainers" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Professional Trainers</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('admin.trainers.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Add Trainer</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
