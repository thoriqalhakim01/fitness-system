import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { FilterParams, Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, Hash, PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '../../../types/index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trainers',
        href: '/dashboard/trainers',
    },
];

type Props = {
    trainers: PaginatedResponse<Trainer>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Trainers({ trainers, flash }: Props) {
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

        router.get(route('admin.trainers.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Trainers" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Professional Trainers</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('admin.trainers.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Add Trainer</span>
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
                            <TableHead>Email</TableHead>
                            <TableHead>Phone number</TableHead>
                            <TableHead className="text-center">Members Trained</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trainers.data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono">{item.rfid_uid}</TableCell>
                                <TableCell>{item.user.name}</TableCell>
                                <TableCell>{item.user.email}</TableCell>
                                <TableCell>{item.user.phone}</TableCell>
                                <TableCell className="text-center">
                                    <Badge>{item.members?.length}</Badge>
                                </TableCell>
                                <TableCell className="flex justify-end">
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('admin.trainers.show', item.id)}>
                                            <Eye />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {trainers.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No trainers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {trainers.total > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {trainers.from} to {trainers.to} of {trainers.total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(trainers.current_page - 1)}
                                disabled={trainers.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: trainers.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === trainers.current_page ? 'default' : 'outline'}
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
                                onClick={() => handlePageChange(trainers.current_page + 1)}
                                disabled={trainers.current_page === trainers.last_page}
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
