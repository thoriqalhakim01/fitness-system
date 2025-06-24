import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClientLayout from '@/layouts/client-layout';
import { Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

type Props = {
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function CheckData({ flash }: Props) {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!value.trim()) return;
    };
    return (
        <ClientLayout>
            <Head title="Client" />
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
                        {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Check Data
                    </Button>
                </form>
            </div>
        </ClientLayout>
    );
}
