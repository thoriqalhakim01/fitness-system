import { getCurrencyFormat } from '@/lib/helpers';
import { AlarmClock, Dumbbell, Users } from 'lucide-react';

type Props = {
    trainers: number;
    members: number;
    todayVisits: number;
    monthlyRevenue: number;
};

export default function QuickStats({ trainers, members, todayVisits, monthlyRevenue }: Props) {
    const getCurrentMonth = () => {
        return new Date().toLocaleString('default', { month: 'long' });
    };
    return (
        <div className="flex flex-col gap-4 rounded-lg border p-4 shadow-2xs">
            <h3 className="font-semibold font-serif">Quick Stats</h3>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
                <div className="space-y-2 rounded-md border p-4 shadow-2xs">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                            <AlarmClock size={16} />
                        </div>
                        <p className="font-medium font-serif">Visited</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold">{todayVisits}</p>
                        <p className="text-sm text-muted-foreground">Today Visits</p>
                    </div>
                </div>
                <div className="space-y-2 rounded-md border p-4 shadow-2xs">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                            <Users size={16} />
                        </div>
                        <p className="font-medium font-serif">Members</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold">{members}</p>
                        <p className="text-sm text-muted-foreground">Active Members</p>
                    </div>
                </div>
                <div className="space-y-2 rounded-md border p-4 shadow-2xs">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                            <Dumbbell size={16} />
                        </div>
                        <p className="font-medium font-serif">Trainer</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold">{trainers}</p>
                        <p className="text-sm text-muted-foreground">Active Trainers</p>
                    </div>
                </div>
                <div className="space-y-2 rounded-md border p-4 shadow-2xs">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                            <Dumbbell size={16} />
                        </div>
                        <p className="font-medium font-serif">Revenue</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-bold">{getCurrencyFormat(monthlyRevenue)}</p>
                        <p className="text-sm text-muted-foreground">Month / {getCurrentMonth()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
