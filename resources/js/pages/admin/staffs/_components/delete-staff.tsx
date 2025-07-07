import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

type Props = {
    id: string;
    isOpen?: boolean;
    onClose?: () => void;
};

type Form = {
    password: string;
};

export default function DeleteStaff({ id, isOpen, onClose }: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm<Required<Form>>({
        password: '',
    });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('admin.staffs.destroy', id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
        onClose?.();
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            closeModal();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger></DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this staff?</DialogTitle>
                <DialogDescription>
                    Once this staff is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm
                    you would like to permanently delete this staff.
                </DialogDescription>
                <form className="space-y-6" onSubmit={deleteUser}>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="sr-only">
                            Password
                        </Label>

                        <Input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            autoComplete="current-password"
                        />

                        <InputError message={errors.password} />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" className="w-full" variant={'destructive'} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
