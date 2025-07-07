import { ChartBarDefault } from './charts/chart-bar-default';
import RecentTransaction from './recent-transaction';

type Props = {
    last6MonthsRevenue: Array<{
        month: string;
        revenue: number;
    }>;
};

export default function SecondStats({ last6MonthsRevenue }: Props) {
    return (
        <div className="grid w-full gap-4 lg:grid-cols-5">
            <div className="col-span-2">
                <ChartBarDefault data={last6MonthsRevenue} />
            </div>
            <div className="col-span-3">
                <RecentTransaction recentTransactions={[]} />
            </div>
        </div>
    );
}
