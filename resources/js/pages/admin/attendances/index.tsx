import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { getFormatDate, getFormatTime, getStatusFromAttendableType } from '@/lib/helpers';
import { Attendance, FilterParams, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Hash, PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attendances History',
        href: '/dashboard/attendances',
    },
];

type Props = {
    attendances: PaginatedResponse<Attendance>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Attendances({ attendances, flash }: Props) {
    console.log(attendances);
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    });

    const handlePageChange = (page: number) => {
        const params: FilterParams = {
            page,
        };

        router.get(route('admin.attendances.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendances" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Attendances History</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('admin.attendances.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Add Attendance</span>
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
                            <TableHead>Trainer</TableHead>
                            <TableHead className="text-center">Entry Date</TableHead>
                            <TableHead className="text-center">Entry Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendances.data.map((attendance, index) => (
                            <TableRow key={attendance.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{attendance.attendable?.name}</TableCell>
                                <TableCell>
                                    <Badge>{getStatusFromAttendableType(attendance.attendable_type)}</Badge>
                                </TableCell>
                                <TableCell className="text-center">{getFormatDate(attendance.entry_timestamp)}</TableCell>
                                <TableCell className="text-center">{getFormatTime(attendance.entry_timestamp)}</TableCell>
                            </TableRow>
                        ))}
                        {attendances.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No attendances found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {attendances.total > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {attendances.from} to {attendances.to} of {attendances.total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(attendances.current_page - 1)}
                                disabled={attendances.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: attendances.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === attendances.current_page ? 'default' : 'outline'}
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
                                onClick={() => handlePageChange(attendances.current_page + 1)}
                                disabled={attendances.current_page === attendances.last_page}
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
