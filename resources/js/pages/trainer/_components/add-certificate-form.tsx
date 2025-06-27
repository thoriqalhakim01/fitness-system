import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function AddCertificateForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        file: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('certification.store'), {
            forceFormData: true,
            onSuccess: () => reset(),
            onError: () => {
                const fileInput = document.getElementById('file') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('file', file);
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-1">
                <Label htmlFor="name">Certification Name</Label>
                <Input
                    id="name"
                    type="text"
                    tabIndex={1}
                    autoFocus
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    disabled={processing}
                    placeholder="e.g. CPR Certification, Personal Training Certificate"
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="file">Certificate Image</Label>
                <Input id="file" type="file" tabIndex={2} onChange={handleFileChange} disabled={processing} accept=".png,.jpg,.jpeg" />
                <p className="mt-1 text-sm text-muted-foreground">Upload PNG, JPG, or JPEG file (max 5MB)</p>
                <InputError message={errors.file} className="mt-2" />
            </div>

            {data.file && (
                <div className="grid gap-1">
                    <Label>Preview</Label>
                    <div className="flex items-center gap-2 rounded bg-muted p-2">
                        <span className="truncate text-sm">{data.file.name}</span>
                        <span className="text-xs text-muted-foreground">({(data.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                </div>
            )}

            <Button type="submit" className="mt-2 w-full" tabIndex={3} disabled={processing || !data.name || !data.file}>
                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Add Certification
            </Button>
        </form>
    );
}
