import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Trainer } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import MemberCard from './_components/member-card';
import TrainerDetails from './_components/trainer-details';

type Props = {
    trainer: Trainer;
};

export default function Dashboard({ trainer }: Props) {
    return (
        <AppLayout>
            <Head title="Trainer" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="col-span-2 flex w-full flex-col gap-4">
                        <TrainerDetails trainer={trainer} />
                    </div>
                    <div className="col-span-3 flex w-full flex-col gap-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="font-serif">Manage Members</CardTitle>
                                        <CardDescription>Manage your gym members</CardDescription>
                                    </div>
                                    <Button size={'sm'} asChild>
                                        <Link href={route('trainer.new-member')}>
                                            <Plus />
                                            <span className="hidden sm:block">Enroll New Member</span>
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {trainer.members?.map((item) => <MemberCard key={item.id} data={item} />)}
                                    {trainer.members?.length === 0 && (
                                        <p className="col-span-4 text-center text-sm text-muted-foreground">No member found</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
