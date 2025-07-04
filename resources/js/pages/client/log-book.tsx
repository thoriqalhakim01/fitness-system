import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientHeaderLayout from '@/layouts/client/client-header-layout';
import { Member } from '@/types';
import { Head } from '@inertiajs/react';
import MemberDetails from './_components/member-details';
import MemberLogs from './_components/member-logs';

type Props = {
    member: Member;
};

export default function LogBook({ member }: Props) {
    return (
        <>
            <Head title="Client" />
            <div className="flex min-h-screen flex-1 flex-col">
                <div className="mx-auto w-full max-w-6xl">
                    <ClientHeaderLayout />
                </div>
                <Separator />
                <main className="mx-auto mt-6 flex w-full max-w-6xl flex-col">
                    <h1 className="font-serif text-4xl font-medium">Log Book</h1>
                    <div className="flex w-full flex-col gap-4 lg:flex-row mt-6">
                        <div className="flex flex-col gap-4 lg:w-1/2">
                            <MemberDetails member={member} />
                        </div>
                        <Separator orientation="vertical" className="hidden lg:block" />
                        <div className="flex w-full flex-col gap-2">
                            <Tabs defaultValue="log" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="log">Log Book</TabsTrigger>
                                    <TabsTrigger value="attendances">Attendances</TabsTrigger>
                                </TabsList>
                                <TabsContent value="attendances">
                                    <p>Soon!</p>
                                </TabsContent>
                                <TabsContent value="log">
                                    <MemberLogs logs={member.logs || []} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
