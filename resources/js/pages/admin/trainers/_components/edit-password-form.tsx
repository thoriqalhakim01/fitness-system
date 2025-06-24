import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

type Props = {
    id: string;
};

export default function EditPasswordForm({ id }: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('admin.trainers.update-password', id), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
            },
        });
    };
    return (
        <form onSubmit={updatePassword} className="space-y-6">
            <div className="grid gap-1">
                <Label htmlFor="password">New password</Label>

                <Input
                    id="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    placeholder="New password"
                />

                <InputError message={errors.password} />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="password_confirmation">Confirm password</Label>

                <Input
                    id="password_confirmation"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    type="password"
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    placeholder="Confirm password"
                />

                <InputError message={errors.password_confirmation} />
            </div>

            <Button type="submit" className="mt-2 w-full" tabIndex={6} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Save changes
            </Button>
        </form>
    );
}
