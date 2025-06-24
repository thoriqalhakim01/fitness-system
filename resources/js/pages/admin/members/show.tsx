import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Member, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PencilLine } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import AttendanceHistory from './_components/attendance-history';
import DeleteMember from './_components/delete-member';
import MemberDetails from './_components/member-details';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members',
        href: '/dashboard/members',
    },
    {
        title: 'Details',
        href: '',
    },
];

type Props = {
    member: Member;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ShowMember({ member, flash }: Props) {
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-bold">Members Details</h1>
                    <div className="flex items-center gap-2">
                        <Button size={'sm'} asChild>
                            <Link href={route('admin.members.edit', member.id)}>
                                <PencilLine />
                                <span className="hidden sm:block">Edit</span>
                            </Link>
                        </Button>
                        <DeleteMember id={member.id} />
                    </div>
                </div>
                <div className="flex w-full flex-col gap-4 lg:flex-row">
                    <div className="flex flex-col gap-4 lg:w-1/3">
                        <MemberDetails member={member} />
                    </div>
                    <Separator orientation="vertical" className="hidden lg:block" />
                    <Separator className="block lg:hidden" />
                    <div className="flex w-full flex-col gap-2">
                        <h2 className="text-lg font-medium">Attendance History</h2>
                        <AttendanceHistory lists={member.attendances || []} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
