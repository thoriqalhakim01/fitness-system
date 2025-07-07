import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { LoaderCircle, PlusCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type CreateForm = {
    name: string;
    points: number | '';
    price: number | '';
    duration: number | '';
};

export default function CreatePackage() {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<CreateForm>({
        name: '',
        points: '',
        price: '',
        duration: '',
    });

    const createPackage: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('admin.packages.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
        });
    };

    const closeModal = () => {
        setOpen(false);
        clearErrors();
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size={'sm'}>
                    <PlusCircle />
                    <span className="hidden sm:block">Create New</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Create Package</DialogTitle>
                <DialogDescription>Let's fill out to create a new package</DialogDescription>
                <form className="space-y-6" onSubmit={createPackage}>
                    <div className="grid gap-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            tabIndex={1}
                            autoFocus
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="e.g. Small package"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="points">Point Added</Label>
                        <Input
                            id="points"
                            type="text"
                            tabIndex={2}
                            value={data.points}
                            onChange={(e) => setData('points', parseInt(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 100"
                        />
                        <InputError message={errors.points} className="mt-2" />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="text"
                            tabIndex={3}
                            value={data.price}
                            onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 25000"
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="duration">Expires After (days)</Label>
                        <Input
                            id="duration"
                            type="text"
                            tabIndex={4}
                            value={data.duration}
                            onChange={(e) => setData('duration', parseFloat(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 60 (days)"
                        />
                        <InputError message={errors.duration} className="mt-2" />
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button" onClick={closeModal}>
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" className="w-full" tabIndex={5} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Create New
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
