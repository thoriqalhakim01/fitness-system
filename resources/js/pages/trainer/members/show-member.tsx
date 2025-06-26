import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import AttendanceHistory from '@/pages/admin/members/_components/attendance-history';
import { Member } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import MemberDetails from '../_components/member-details';
import MemberLogs from '../_components/member-logs';

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
    });
    return (
        <AppLayout>
            <Head title="Trainers" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-bold">Members Details</h1>
                    <Button asChild>
                        <Link href={route('trainer.members.add-log', member.id)}>
                            <Plus />
                            <span className="hidden sm:block">Add Log</span>
                        </Link>
                    </Button>
                </div>
                <div className="flex w-full flex-col gap-4 lg:flex-row">
                    <div className="flex flex-col gap-4 lg:w-1/3">
                        <MemberDetails member={member} />
                    </div>
                    <Separator orientation="vertical" className="hidden lg:block" />
                    <div className="flex w-full flex-col gap-2">
                        <Tabs defaultValue="attendances" className="w-full">
                            <TabsList>
                                <TabsTrigger value="attendances">Attendances</TabsTrigger>
                                <TabsTrigger value="log">Log Book</TabsTrigger>
                            </TabsList>
                            <TabsContent value="attendances">
                                <AttendanceHistory lists={member.attendances || []} />
                            </TabsContent>
                            <TabsContent value="log">
                                <MemberLogs logs={member.logs || []} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
