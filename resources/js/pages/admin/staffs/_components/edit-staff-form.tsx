import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

type CreateForm = {
    name: string;
    email: string;
    phone: string;
};

type Props = {
    staff: User;
};

export default function EditStaffForm({ staff }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm<CreateForm>({
        name: staff.name,
        email: staff.email,
        phone: staff.phone || '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        put(route('admin.staffs.update', staff.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };
    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-1">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    autoFocus
                    tabIndex={1}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    disabled={processing}
                    placeholder="Full name"
                />
                <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="email">Email address</Label>
                <Input
                    id="email"
                    type="email"
                    tabIndex={2}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    disabled={processing}
                    placeholder="email@example.com"
                />
                <InputError message={errors.email} />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="phone_number">Phone Number</Label>
                <div className="relative">
                    <Input
                        id="phone_number"
                        type="tel"
                        tabIndex={3}
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        disabled={processing}
                        placeholder="e.g. 8123456789 (without 0)"
                        className="pl-13"
                    />
                    <div className="absolute top-0 left-0 flex h-9 items-center border-r px-2">
                        <p className="text-sm text-muted-foreground">+62</p>
                    </div>
                </div>
                <InputError message={errors.phone} className="mt-2" />
            </div>
            <Button type="submit" className="mt-2 w-full" tabIndex={6} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Save changes
            </Button>
        </form>
    );
}
