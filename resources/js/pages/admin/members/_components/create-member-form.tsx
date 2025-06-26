import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SharedData, Trainer } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { FormEvent } from 'react';

type Props = {
    trainers: Trainer[];
};

type CreateForm = {
    staff_id: string;
    trainer_id: string;
    rfid_uid: string;
    name: string;
    email: string;
    phone: string;
    birthdate: string;
    weight: number | '';
    height: number | '';
    registration_date: string;
    is_member: string;
};

export default function CreateMemberForm({ trainers }: Props) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm<CreateForm>({
        staff_id: auth.user.id,
        trainer_id: '',
        rfid_uid: '',
        name: '',
        email: '',
        phone: '',
        birthdate: '',
        weight: '',
        height: '',
        registration_date: new Date().toISOString().split('T')[0],
        is_member: '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('admin.members.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const isActiveMember = data.is_member === '1';

    return (
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
                                {trainer.user.name}
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
                            type="tel"
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
                            type="string"
                            tabIndex={7}
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
                    <SelectTrigger id="is_member" tabIndex={8}>
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
                        tabIndex={9}
                        value={data.rfid_uid}
                        onChange={(e) => setData('rfid_uid', e.target.value)}
                        disabled={processing}
                        placeholder="e.g. A1B2C3D4"
                    />
                    <InputError message={errors.rfid_uid} className="mt-2" />
                </div>
            )}
            <Button type="submit" className="mt-2 w-full" tabIndex={10} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Create New
            </Button>
        </form>
    );
}
