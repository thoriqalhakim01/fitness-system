import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { getCurrencyFormat } from '@/lib/helpers';
import { FilterParams, Transaction, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, Hash, PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '../../../types/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/dashboard/transactions',
    },
];

type Props = {
    transactions: PaginatedResponse<Transaction>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Transactions({ transactions, flash }: Props) {
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handlePageChange = (page: number) => {
        const params: FilterParams = {
            page,
        };

        router.get(route('admin.transactions.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="transactions" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Transaction Records</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('admin.transactions.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Create New</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Hash size={16} />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Package</TableHead>
                            <TableHead className="text-center">Amount</TableHead>
                            <TableHead className="text-center">Point Added</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono">{item.member.rfid_uid}</TableCell>
                                <TableCell>{item.member.name}</TableCell>
                                <TableCell>{item.package.name}</TableCell>
                                <TableCell className="text-center">{getCurrencyFormat(item.amount)}</TableCell>
                                <TableCell className="text-center">
                                    <Badge>{item.points}</Badge>
                                </TableCell>
                                <TableCell className="flex justify-end">
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href="">
                                            <Eye />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {transactions.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {transactions.total > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {transactions.from} to {transactions.to} of {transactions.total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(transactions.current_page - 1)}
                                disabled={transactions.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: transactions.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === transactions.current_page ? 'default' : 'outline'}
                                        size="icon"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(transactions.current_page + 1)}
                                disabled={transactions.current_page === transactions.last_page}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
