import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member, Trainer } from '@/types';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
    user: Member | Trainer | undefined;
    userType: 'member' | 'trainer' | undefined;
    open: boolean;
    onClose: () => void;
    members?: Member[];
    onSubmitTraining?: (selectedMembers: Member[]) => void;
};

export default function CheckInDialog({ user, userType, open, onClose, members = [], onSubmitTraining }: Props) {
    const [countdown, setCountdown] = useState(3);
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [isSubmittingTraining, setIsSubmittingTraining] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (userType === 'member') {
            setCountdown(3);
            const timer = setTimeout(onClose, 3000);
            const interval = setInterval(() => setCountdown((prev) => prev - 1), 1000);

            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        } else {
            setSelectedMembers([]);
        }
    }, [open, onClose, userType]);

    const handleMemberSelect = (memberId: string) => {
        const member = members.find((m) => m.id?.toString() === memberId);
        if (member && !selectedMembers.find((m) => m.id === member.id)) {
            setSelectedMembers((prev) => [...prev, member]);
        }
    };

    const handleRemoveMember = (memberId: number | string) => {
        setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
    };

    const handleSubmitTraining = async () => {
        if (selectedMembers.length === 0) return;

        setIsSubmittingTraining(true);
        try {
            if (onSubmitTraining) {
                await onSubmitTraining(selectedMembers);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting training:', error);
        } finally {
            setIsSubmittingTraining(false);
        }
    };

    const renderMemberContent = (member: Member) => (
        <>
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-800">Check-in Completed</span>
                </div>
                <span className="text-xs text-green-600">{new Date().toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                <span className="text-sm font-medium text-blue-800">Points Deducted</span>
                <Badge variant="outline" className="border-blue-300 text-blue-600">
                    -1 point
                </Badge>
            </div>

            <div className="flex justify-between rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Remaining Points</p>
                    <p className="text-2xl font-bold text-primary">{member.points?.points || 0}</p>
                </div>
                <Badge variant={(member.points?.points || 0) > 10 ? 'default' : (member.points?.points || 0) > 5 ? 'secondary' : 'destructive'}>
                    {(member.points?.points || 0) > 10 ? 'Good' : (member.points?.points || 0) > 5 ? 'Low' : 'Critical'}
                </Badge>
            </div>
        </>
    );

    const renderTrainerContent = (trainer: Trainer) => (
        <>
            <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-green-800">Trainer Check-in Completed</span>
                </div>
                <span className="text-xs text-green-600">{new Date().toLocaleString()}</span>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
                <div className="space-y-2">
                    <Label htmlFor="member-select" className="text-sm font-medium">
                        Select Members for Training
                    </Label>
                    <Select onValueChange={handleMemberSelect} value="">
                        <SelectTrigger>
                            <SelectValue placeholder="Choose members to train..." />
                        </SelectTrigger>
                        <SelectContent>
                            {members
                                .filter((member) => !selectedMembers.find((selected) => selected.id === member.id))
                                .map((member) => (
                                    <SelectItem key={member.id} value={member.id?.toString() || ''}>
                                        {member.name} - {member.rfid_uid}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedMembers.length > 0 && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Selected Members ({selectedMembers.length})</Label>
                        <div className="flex flex-wrap gap-2">
                            {selectedMembers.map((member) => (
                                <Badge key={member.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                                    {member.name}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => handleRemoveMember(member.id)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <Button onClick={handleSubmitTraining} disabled={selectedMembers.length === 0 || isSubmittingTraining} className="w-full">
                    {isSubmittingTraining
                        ? 'Starting Training...'
                        : `Start Training with ${selectedMembers.length} Member${selectedMembers.length !== 1 ? 's' : ''}`}
                </Button>
            </div>
        </>
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Check In Successful</DialogTitle>
                    <DialogDescription>
                        Welcome {userType === 'member' ? 'to the gym' : 'back'}, {user?.name}!
                    </DialogDescription>
                </DialogHeader>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            {user?.name}
                            <Badge variant="secondary">RFID: {user?.rfid_uid}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {userType === 'member' ? renderMemberContent(user as Member) : renderTrainerContent(user as Trainer)}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between pt-4">
                    {userType === 'member' ? (
                        <>
                            <div className="text-sm text-muted-foreground">Auto-close in {countdown} seconds</div>
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={onClose} className="w-full">
                            Close
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
