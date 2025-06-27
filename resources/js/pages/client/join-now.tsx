import { Trainer } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InformationDialog from './_components/information-dialog';
import JoinNowForm from './_components/join-now-form';

type Props = {
    trainers: Trainer[];
    flash: {
        success?: string;
        error?: string;
    };
};

export default function JoinNow({ trainers, flash }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | undefined>();

    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
            setDialogOpen(true);
        }
    }, [flash]);

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSuccessMessage(undefined);
        window.history.replaceState({}, '', window.location.pathname);
    };

    const handleRegistrationSuccess = (message: string) => {
        setSuccessMessage(message);
        setDialogOpen(true);
    };
    return (
        <>
            <Head title="Join Now" />
            <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-primary-foreground lg:flex">
                    <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                        <img src="/logo-white.png" className="h-24 w-24" alt="Logo" />
                    </Link>
                    <div className="absolute inset-0 bg-primary" />
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="font-serif text-6xl text-balance">The only bad workout is the one that didn&apos;t happen.</p>
                        </blockquote>
                    </div>
                </div>
                <div className="w-full">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:max-w-sm">
                        <div className="flex flex-col gap-1 text-left">
                            <h1 className="text-2xl font-medium">Ready to Level Up?</h1>
                            <p className="text-sm text-muted-foreground">Sign up today, prove yourself tomorrow. No change happens without action!</p>
                            <JoinNowForm trainers={trainers} />
                        </div>
                    </div>
                </div>
            </div>
            <InformationDialog success={successMessage} open={dialogOpen} onClose={handleDialogClose} />
        </>
    );
}
