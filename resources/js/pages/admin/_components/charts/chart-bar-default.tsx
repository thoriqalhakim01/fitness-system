import { TrendingDown, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { getCurrencyFormat } from '@/lib/helpers';

export const description = 'A bar chart showing revenue for the last 6 months';

const chartConfig = {
    revenue: {
        label: 'Revenue',
        color: 'var(--chart-1)',
    },
} satisfies ChartConfig;

type Props = {
    data: Array<{
        month: string;
        revenue: number;
    }>;
};

export function ChartBarDefault({ data }: Props) {
    const calculateTrend = () => {
        if (data.length < 2) return { percentage: 0, isPositive: true };

        const currentMonth = data[data.length - 1]?.revenue || 0;
        const previousMonth = data[data.length - 2]?.revenue || 0;

        if (previousMonth === 0) return { percentage: 0, isPositive: true };

        const percentage = ((currentMonth - previousMonth) / previousMonth) * 100;
        return {
            percentage: Math.abs(percentage),
            isPositive: percentage >= 0,
        };
    };

    const getPeriodDescription = () => {
        if (data.length === 0) return 'No data available';

        const firstMonth = data[0]?.month;
        const lastMonth = data[data.length - 1]?.month;
        const currentYear = new Date().getFullYear();

        return `${firstMonth} - ${lastMonth} ${currentYear}`;
    };

    const trend = calculateTrend();

    return (
        <Card>
            <CardHeader>
                <CardTitle className='font-serif'>Revenue Analytics</CardTitle>
                <CardDescription>{getPeriodDescription()}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel formatter={(value) => [getCurrencyFormat(value as number), ' Revenue']} />}
                        />
                        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {trend.isPositive ? (
                        <>
                            Trending up by {trend.percentage.toFixed(1)}% this month
                            <TrendingUp className="h-4 w-4" />
                        </>
                    ) : (
                        <>
                            Trending down by {trend.percentage.toFixed(1)}% this month
                            <TrendingDown className="h-4 w-4" />
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
