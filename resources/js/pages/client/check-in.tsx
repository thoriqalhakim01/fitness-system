import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientLayout from '@/layouts/client-layout';
import { Member, Trainer } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import CheckInDialog from './_components/check-in-dialog';
import ErrorDialog from './_components/error-dialog';
import { formatErrorForLogging } from './utils/error';

type Props = {
    member?: Member;
    trainer?: Trainer;
    userType?: 'member' | 'trainer';
    error?: string;
    success?: string;
    members?: Member[];
};

export default function CheckIn({ member, trainer, userType, error, success, members = [] }: Props) {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(!!member || !!trainer);
    const [showErrorDialog, setShowErrorDialog] = useState(!!error);
    const [lastScannedValue, setLastScannedValue] = useState('');

    useEffect(() => {
        if (error) {
            console.error('Check-in error:', formatErrorForLogging(error, { rfidUid: lastScannedValue }));
        }
    }, [error, lastScannedValue]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!value.trim()) return;
        performCheckIn(value.trim());
    };

    const performCheckIn = (rfidUid: string) => {
        setIsLoading(true);
        setLastScannedValue(rfidUid);

        router.get(
            `/check-in/${rfidUid}`,
            {},
            {
                onFinish: () => setIsLoading(false),
                onError: () => setIsLoading(false),
                onSuccess: () => setShowErrorDialog(false),
            },
        );
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        router.get('/check-in');
    };

    const handleCloseErrorDialog = () => {
        setShowErrorDialog(false);
        router.get('/check-in');
    };

    const handleRetry = () => {
        if (lastScannedValue) {
            performCheckIn(lastScannedValue);
        }
        setShowErrorDialog(false);
    };

    const handleSubmitTraining = async (selectedMembers: Member[]) => {
        try {
            router.post(
                route('training.start'),
                {
                    trainer_id: trainer?.id,
                    member_ids: selectedMembers.map((member) => member.id),
                },
                {
                    onSuccess: (response) => {
                        console.log(response);
                    },
                    onError: (errors) => {
                        console.error('Error starting training:', errors);
                    },
                },
            );
        } catch (error) {
            console.error('Error submitting training:', error);
            throw error;
        }
    };

    return (
        <ClientLayout>
            <Head title="Check In" />
            <div className="mx-auto w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-4">
                    <Input
                        id="rfid_uid"
                        name="rfid_uid"
                        type="text"
                        placeholder="Enter RFID UID or tap card..."
                        value={value}
                        onChange={handleChange}
                        className="w-full"
                        autoComplete="off"
                        autoFocus
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={!value.trim() || isLoading}>
                        {isLoading ? 'Checking in...' : 'Check In'}
                    </Button>
                </form>

                {(member || trainer) && (
                    <CheckInDialog
                        user={member || trainer}
                        userType={userType}
                        open={dialogOpen}
                        onClose={handleCloseDialog}
                        members={members}
                        onSubmitTraining={handleSubmitTraining}
                    />
                )}

                {error && <ErrorDialog error={error} open={showErrorDialog} onClose={handleCloseErrorDialog} onRetry={handleRetry} />}
            </div>
        </ClientLayout>
    );
}
