import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    success?: string;
    open: boolean;
    onClose: () => void;
}

export default function InformationDialog({ success, open, onClose }: Props) {
    const [countdown, setCountdown] = useState(30);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        let countdownTimer: NodeJS.Timeout;

        if (open) {
            setCountdown(30);

            countdownTimer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownTimer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            timer = setTimeout(() => {
                onClose();
            }, 30000);
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (countdownTimer) clearInterval(countdownTimer);
        };
    }, [open, onClose]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                        <DialogTitle className="text-xl font-bold text-green-700">Registration Complete</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {success || 'Your registration has been submitted successfully.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 pt-4">
                    <div className="rounded-lg border border-green-500 bg-green-50 p-3 text-center">
                        <p className="text-sm font-medium text-green-800">What's Next?</p>
                        <p className="mt-1 text-xs text-green-700">
                            Please contact our staff to complete the verification process and activate your membership.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-between gap-2">
                        <div className="text-center text-sm text-muted-foreground">Auto-close in {countdown} seconds</div>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
