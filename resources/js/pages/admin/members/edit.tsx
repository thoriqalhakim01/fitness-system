import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Member, Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import EditMemberForm from './_components/edit-member-form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members',
        href: '/dashboard/members',
    },
    {
        title: 'Edit',
        href: '',
    },
];

type Props = {
    member: Member;
    trainers: Trainer[];
    error?: string;
};

export default function EditMember({ member, trainers, error }: Props) {
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Modify Member</h1>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('admin.members.show', member.id)}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="mx-auto w-full max-w-lg">
                    <EditMemberForm member={member} trainers={trainers} />
                </div>
            </div>
        </AppLayout>
    );
}
