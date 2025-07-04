import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Member } from '@/types';
import { Link } from '@inertiajs/react';
import { ClipboardSignature } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
    member: Member;
    open: boolean;
    onClose: () => void;
};

export default function CheckDataDialog({ member, open, onClose }: Props) {
    const [countdown, setCountdown] = useState(30);
    const totalPoints = member.points?.points || 0;

    useEffect(() => {
        if (!open) return;

        setCountdown(30);
        const timer = setTimeout(onClose, 30000);
        const interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [open, onClose]);
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button>Check Data</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Member Information</DialogTitle>
                    <DialogDescription>Here's the member data for RFID: {member.rfid_uid}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>{member.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">RFID UID:</span>
                                <span>{member.rfid_uid}</span>
                            </div>
                            {member.email && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span>{member.email}</span>
                                </div>
                            )}
                            {member.phone && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span>{member.phone}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <div className="flex justify-between rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                        <p>Current Points:</p>
                        <Badge>{totalPoints}</Badge>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">Auto-close in {countdown} seconds</div>
                    <div className="flex space-x-2">
                        <Button size={'sm'} asChild>
                            <Link href={route('client.log-book', member.rfid_uid)}>
                                <ClipboardSignature />
                                Log Book
                            </Link>
                        </Button>
                        <Button variant="outline" size={'sm'} onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
