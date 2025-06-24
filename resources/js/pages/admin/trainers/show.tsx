import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Attendance, Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { PencilLine } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import DeleteTrainer from './_components/delete-trainer';
import MembersListings from './_components/members';
import TrainerDetails from './_components/trainer-details';
import TrainingSessionTable from './_components/training-session';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainers',
        href: '/dashboard/trainers',
    },
    {
        title: 'Details',
        href: '',
    },
];

type Props = {
    trainer: Trainer;
    allAttendances?: Attendance[];
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function ShowTrainer({ trainer, allAttendances = [], flash }: Props) {
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainers" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-bold">Trainers Details</h1>
                    <div className="flex items-center gap-2">
                        <Button size={'sm'} asChild>
                            <Link href={route('admin.trainers.edit', trainer.id)}>
                                <PencilLine />
                                <span className="hidden sm:block">Edit</span>
                            </Link>
                        </Button>
                        <DeleteTrainer id={trainer.id} />
                    </div>
                </div>
                <div className="flex w-full flex-col gap-4 lg:flex-row">
                    <div className="flex flex-col gap-4 lg:w-1/3">
                        <TrainerDetails trainer={trainer} />
                    </div>
                    <Separator orientation="vertical" className="hidden lg:block" />
                    <Separator className="block lg:hidden" />
                    <Tabs defaultValue="session" className="w-full">
                        <TabsList>
                            <TabsTrigger value="session">Training Session</TabsTrigger>
                            <TabsTrigger value="members">List Members</TabsTrigger>
                        </TabsList>
                        <TabsContent value="session">
                            <TrainingSessionTable lists={trainer.training_sessions || []} attendances={allAttendances} />
                        </TabsContent>
                        <TabsContent value="members">
                            <MembersListings lists={trainer.members || []} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
