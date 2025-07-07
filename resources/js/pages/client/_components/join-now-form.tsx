import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Trainer } from '@/types';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

type Props = {
    trainers: Trainer[];
};

type CreateForm = {
    trainer_id: string;
    name: string;
    email: string;
    phone: string;
    birthdate: string;
    weight: number | '';
    height: number | '';
};

export default function JoinNowForm({ trainers }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<CreateForm>({
        trainer_id: '',
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        weight: '',
        height: '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('client.handle-join-now'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };
    return (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
                <Label htmlFor="birthdate">Birthdate</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="birthdate"
                            tabIndex={5}
                            variant={'outline'}
                            className={cn('w-full pl-3 text-left font-normal', !data.birthdate && 'text-muted-foreground')}
                            type="button"
                        >
                            {data.birthdate ? format(new Date(data.birthdate), 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={new Date(data.birthdate)}
                            onSelect={(date) => {
                                if (date) {
                                    setData('birthdate', format(date, 'yyyy-MM-dd'));
                                }
                            }}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                        />
                    </PopoverContent>
                </Popover>
                <InputError message={errors.birthdate} className="mt-2" />
            </div>

            <div className="grid gap-1">
                <Label htmlFor="trainer_id">Trainers</Label>
                <Select
                    name="trainer_id"
                    value={data.trainer_id}
                    onValueChange={(value) => {
                        setData('trainer_id', value);
                    }}
                    disabled={processing}
                >
                    <SelectTrigger id="trainer_id" tabIndex={5}>
                        <SelectValue placeholder="Select trainers" />
                    </SelectTrigger>
                    <SelectContent>
                        {trainers.map((trainer) => (
                            <SelectItem key={trainer.id} value={trainer.id.toString()}>
                                {trainer.name}
                            </SelectItem>
                        ))}
                        {trainers.length === 0 && <SelectItem value="0">No trainers found</SelectItem>}
                    </SelectContent>
                </Select>
                <InputError message={errors.trainer_id} className="mt-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                    <Label htmlFor="weight">Weight</Label>
                    <div className="relative">
                        <Input
                            id="weight"
                            type="text"
                            tabIndex={6}
                            value={data.weight}
                            onChange={(e) => setData('weight', parseFloat(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 80"
                        />
                        <div className="absolute top-0 right-0 flex h-9 items-center border-l px-2">
                            <p className="text-sm text-muted-foreground">kg</p>
                        </div>
                    </div>
                    <InputError message={errors.weight} className="mt-2" />
                </div>
                <div className="grid gap-1">
                    <Label htmlFor="height">Height</Label>
                    <div className="relative">
                        <Input
                            id="height"
                            type="text"
                            tabIndex={6}
                            value={data.height}
                            onChange={(e) => setData('height', parseFloat(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="e.g. 170"
                        />
                        <div className="absolute top-0 right-0 flex h-9 items-center border-l px-2">
                            <p className="text-sm text-muted-foreground">cm</p>
                        </div>
                    </div>
                    <InputError message={errors.height} className="mt-2" />
                </div>
            </div>

            <Button type="submit" className="mt-2 w-full" tabIndex={7} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Join Now
            </Button>
        </form>
    );
}
