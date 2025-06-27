import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import AddCertificateForm from './_components/add-certificate-form';

type Props = {
    error?: string;
};

export default function AddCertificate({ error }: Props) {
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <AppLayout>
            <Head title="Trainers" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Add Certification</h1>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('trainer.dashboard')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <AddCertificateForm />
                </div>
            </div>
        </AppLayout>
    );
}
