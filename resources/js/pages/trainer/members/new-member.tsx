import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircle, X } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';

type Props = {
    error?: string;
};

type CreateForm = {
    name: string;
    email: string;
    phone: string;
    registration_date: string;
};

export default function CreateTrainer({ error }: Props) {
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const { data, setData, post, processing, errors, reset } = useForm<CreateForm>({
        name: '',
        email: '',
        phone: '',
        registration_date: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('trainer.handle-new-member'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Trainers" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Enroll New Member</h1>
                    <Button size={'sm'} variant={'outline'} asChild>
                        <Link href={route('trainer.dashboard')}>
                            <X />
                            <span className="hidden sm:block">Cancel</span>
                        </Link>
                    </Button>
                </div>
                <div className="mx-auto w-full max-w-lg">
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="e.g. John Doe"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                tabIndex={2}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="e.g. john.doe@example.com"
                            />
                            <InputError message={errors.email} className="mt-2" />
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

                        <div className="grid gap-1">
                            <Label htmlFor="registration_date">Registration Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="registration_date"
                                        tabIndex={4}
                                        variant={'outline'}
                                        className={cn('w-full pl-3 text-left font-normal', !data.registration_date && 'text-muted-foreground')}
                                        type="button"
                                    >
                                        {data.registration_date ? format(new Date(data.registration_date), 'PPP') : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={new Date(data.registration_date)}
                                        onSelect={(date) => {
                                            if (date) {
                                                setData('registration_date', format(date, 'yyyy-MM-dd'));
                                            }
                                        }}
                                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                        captionLayout="dropdown"
                                    />
                                </PopoverContent>
                            </Popover>
                            <InputError message={errors.registration_date} className="mt-2" />
                        </div>
                        <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Add Member
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
