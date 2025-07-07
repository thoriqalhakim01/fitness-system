import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import EditPasswordForm from './_components/edit-password-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staffs',
        href: '/dashboard/staffs',
    },
    {
        title: 'Edit Password',
        href: '',
    },
];

type Props = {
    staff: User;
    error?: string;
};

export default function EditStaffPassword({ staff, error }: Props) {
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staffs" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Change Password</h1>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('admin.staffs.index')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto w-full max-w-lg">
                    <EditPasswordForm id={staff.id} />
                </div>
            </div>
        </AppLayout>
    );
}
