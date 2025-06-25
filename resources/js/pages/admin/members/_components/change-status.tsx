import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member, SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { CircleDashed, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type Props = {
    member: Member;
};

type CreateForm = {
    staff_id: string;
    is_member: string;
    status: string;
    rfid_uid: string;
};

export default function ChangeStatus({ member }: Props) {
    const [open, setOpen] = useState(false);

    const { auth } = usePage<SharedData>().props;

    const originalRfidUid = member.rfid_uid;

    const { data, setData, put, processing, reset, errors, clearErrors } = useForm<CreateForm>({
        staff_id: auth.user.id,
        is_member: member.is_member ? '1' : '0',
        status: member.status,
        rfid_uid: member.rfid_uid,
    });

    const changeStatus: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('admin.members.change-status', member.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
        });
    };

    const isActiveMember = data.is_member === '1';

    const closeModal = () => {
        setOpen(false);
        clearErrors();
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'sm'} variant={'outline'}>
                    <CircleDashed />
                    <span className="hidden sm:block">Change Status</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Change Status</DialogTitle>
                <form className="space-y-6" onSubmit={changeStatus}>
                    <div className="grid gap-1">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            name="status"
                            value={data.status}
                            onValueChange={(value) => {
                                setData('status', value);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger id="status" tabIndex={2}>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="is_member">Membership Status</Label>
                        <Select
                            name="is_member"
                            value={data.is_member}
                            onValueChange={(value) => {
                                setData('is_member', value);
                                if (value === '0') {
                                    setData('rfid_uid', '');
                                }
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger id="is_member" tabIndex={2}>
                                <SelectValue placeholder="Select membership status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Active Member</SelectItem>
                                <SelectItem value="0">Non-Member</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.is_member} className="mt-2" />
                    </div>
                    {isActiveMember && (
                        <div className="grid gap-1">
                            <Label htmlFor="rfid_uid">RFID UID</Label>
                            <Input
                                id="rfid_uid"
                                type="text"
                                required={isActiveMember}
                                tabIndex={3}
                                value={data.rfid_uid}
                                onChange={(e) => setData('rfid_uid', e.target.value)}
                                disabled={processing || (isActiveMember && Boolean(originalRfidUid))}
                                placeholder="e.g. A1B2C3D4"
                                className={isActiveMember && originalRfidUid ? 'cursor-not-allowed' : ''}
                            />
                            <InputError message={errors.rfid_uid} className="mt-2" />
                            {isActiveMember && originalRfidUid && (
                                <p className="mt-1 text-xs text-muted-foreground">RFID UID cannot be changed for active members</p>
                            )}
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" className="w-full" tabIndex={4} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
