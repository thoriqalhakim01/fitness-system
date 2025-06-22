import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

type CreateForm = {
    staff_id: string;
    rfid_uid: string;
    name: string;
    email: string;
    phone: string;
};

export default function CreateTrainerForm() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors } = useForm<CreateForm>({
        staff_id: auth.user.id,
        rfid_uid: '',
        name: '',
        email: '',
        phone: '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(data);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-1">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    tabIndex={1}
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. John Doe"
                />
                <InputError message={errors.name} />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    tabIndex={2}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. username@example.com"
                />
                <InputError message={errors.email} />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                    <Input
                        id="phone"
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
                <InputError message={errors.phone} />
            </div>
            <div className="grid gap-1">
                <Label htmlFor="rfid_uid">RFID UID</Label>
                <Input
                    id="rfid_uid"
                    type="text"
                    name="rfid_uid"
                    tabIndex={4}
                    value={data.rfid_uid}
                    onChange={(e) => setData('rfid_uid', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. A1B2C3E4F5"
                />
                <InputError message={errors.rfid_uid} />
            </div>
            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Create New
            </Button>
        </form>
    );
}
