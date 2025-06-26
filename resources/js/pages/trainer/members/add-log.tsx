import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Member } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import AddLogForm from '../_components/add-log-form';

type Props = {
    member: Member;
    error?: string;
};

export default function AddLog({ member, error }: Props) {
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <AppLayout>
            <Head title={`Add Log - ${member.name}`} />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Add Log Entry</h1>
                        <p className="text-muted-foreground">Member: {member.name}</p>
                    </div>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('trainer.show-member', member.id)}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <AddLogForm id={member.id} />
                </div>
            </div>
        </AppLayout>
    );
}
