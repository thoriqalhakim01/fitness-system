import TextLink from '@/components/text-link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCurrencyFormat, getFormatDate } from '@/lib/helpers';
import { Transaction } from '@/types';
import { ArrowUpRight, Calendar } from 'lucide-react';

type Props = {
    recentTransactions: Transaction[];
};

export default function RecentTransaction({ recentTransactions }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <h2 className="font-serif font-semibold text-balance">Recent Transactions</h2>
                <TextLink href={route('admin.transactions.index')} className="group inline-flex items-center gap-1 text-xs">
                    View all
                    <ArrowUpRight
                        className="transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
                        size={12}
                    />
                </TextLink>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Calendar size={16} />
                        </TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell className="text-sm text-muted-foreground">{getFormatDate(transaction.transaction_date)}</TableCell>
                                <TableCell className="font-medium">{transaction.member.name}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{transaction.package.name}</TableCell>
                                <TableCell className="text-right font-medium">{getCurrencyFormat(transaction.amount)}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
