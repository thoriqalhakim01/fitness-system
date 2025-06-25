import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import AttendanceHistory from '@/pages/admin/members/_components/attendance-history';
import { Member } from '@/types';
import { Head } from '@inertiajs/react';
import MemberDetails from '../_components/member-details';

type Props = {
    member: Member;
};

export default function ShowMember({ member }: Props) {
    console.log(member);
    return (
        <AppLayout>
            <Head title="Trainers" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Members Details</h1>
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
                                <p>Coming Soon!</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
