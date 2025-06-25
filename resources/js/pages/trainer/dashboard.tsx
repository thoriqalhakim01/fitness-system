import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Attendance, Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import MemberCard from './_components/member-card';
import TrainingSessionTable from './_components/training-session';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainer',
        href: '/trainer/dashboard',
    },
];

type Props = {
    trainer: Trainer;
    allAttendances?: Attendance[];
};

export default function Dashboard({ trainer, allAttendances = [] }: Props) {
    console.log(trainer);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainer" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="col-span-3 flex w-full flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <h1 className="text-lg font-medium">Manage Members</h1>
                            <Button size={'sm'} asChild>
                                <Link href={route('trainer.new-member')}>
                                    <Plus />
                                    <span className="hidden sm:block">Enroll New Member</span>
                                </Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                            {trainer.members?.map((item) => <MemberCard key={item.id} data={item} />)}
                            {trainer.members?.length === 0 && <p className="col-span-4 text-center">No member found</p>}
                        </div>
                    </div>
                    <div className="col-span-2 flex flex-col gap-4 lg:w-1/2">
                        <h1 className="text-lg font-medium">Training Session</h1>
                        <TrainingSessionTable lists={trainer.training_sessions || []} attendances={allAttendances} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
