import { getCurrencyFormat } from '@/lib/helpers';
import { AlarmClockPlus, ChartLine, Dumbbell, User } from 'lucide-react';

type Props = {
    totalTrainer: number;
    totalMembers: number;
    monthlyRevenue: number;
    currentMonth: string;
};

export default function MainMetrics({ totalTrainer, totalMembers, monthlyRevenue, currentMonth }: Props) {
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="space-y-2 rounded-lg border p-2">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-muted p-1.5">
                            <ChartLine className="text-muted-foreground" size={20} strokeWidth={2.5} />
                        </div>
                        <p className="text-sm font-medium">Revenue</p>
                    </div>
                    <div>
                        <p className="text-xl font-medium">{getCurrencyFormat(monthlyRevenue)}</p>
                        <p className="text-sm text-muted-foreground">{currentMonth}</p>
                    </div>
                </div>
                <div className="space-y-2 rounded-lg border p-2">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-muted p-1.5">
                            <AlarmClockPlus className="text-muted-foreground" size={20} strokeWidth={2.5} />
                        </div>
                        <p className="text-sm font-medium">Visited</p>
                    </div>
                    <div>
                        <p className="text-xl font-medium">10</p>
                        <p className="text-sm text-muted-foreground">Daily Average</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="space-y-2 rounded-lg border p-2">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-muted p-1.5">
                            <User className="text-muted-foreground" size={20} strokeWidth={2.5} />
                        </div>
                        <p className="text-sm font-medium">Members</p>
                    </div>
                    <div>
                        <p className="text-xl font-medium">{totalMembers}</p>
                        <p className="text-sm text-muted-foreground">Active Members</p>
                    </div>
                </div>
                <div className="space-y-2 rounded-lg border p-2">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-muted p-1.5">
                            <Dumbbell className="text-muted-foreground" size={20} strokeWidth={2.5} />
                        </div>
                        <p className="text-sm font-medium">Trainer</p>
                    </div>
                    <div>
                        <p className="text-xl font-medium">{totalTrainer}</p>
                        <p className="text-sm text-muted-foreground">Active Trainers</p>
                    </div>
                </div>
            </div>
        </>
    );
}
