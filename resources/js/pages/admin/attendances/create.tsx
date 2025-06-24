import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Member, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import CreateAttendanceForm from './_components/create-attendance-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendances History',
        href: '/dashboard/attendances',
    },
    {
        title: 'Create',
        href: '/dashboard/attendances/create',
    },
];

type Props = {
    members: Member[];
    error?: string;
};

export default function CreateTrainer({ members, error }: Props) {
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendances" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Attendance</h1>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('admin.attendances.index')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto w-full max-w-lg">
                    <CreateAttendanceForm members={members} />
                </div>
            </div>
        </AppLayout>
    );
}
