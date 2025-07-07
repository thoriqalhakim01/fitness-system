import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import EditTrainerForm from './_components/edit-trainer-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainers',
        href: '/dashboard/trainer',
    },
    {
        title: 'Edit',
        href: '',
    },
];

type Props = {
    trainer: Trainer;
    error?: string;
};

export default function EditTrainer({ trainer, error }: Props) {
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainers" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Modify Trainer</h1>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('admin.trainers.index')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto w-full max-w-lg">
                    <EditTrainerForm trainer={trainer} />
                </div>
            </div>
        </AppLayout>
    );
}
