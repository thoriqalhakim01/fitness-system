import { ExportDropdown } from '@/components/export-dropdown';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useExport } from '@/hooks/use-export';
import { usePagination } from '@/hooks/use-pagination';
import AppLayout from '@/layouts/app-layout';
import { getFormatDate, getFormatTime, getStatusFromAttendableType } from '@/lib/helpers';
import { Attendance, FilterParams, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Hash } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { FilterDropdown } from './_components/filter-dropdown';
import { useFilters } from './_hooks/use-filter';

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
    filters?: FilterParams;
};

export default function Attendances({ attendances, flash, filters: initialFilters }: Props) {
    const { filters, handleFilterChange, handleApplyFilters, handleClearFilters } = useFilters(initialFilters);

    const { handlePageChange } = usePagination({
        route: 'admin.attendances.index',
        preserveFilters: false,
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    });

    const exportHook = useExport({
        baseRouteName: 'admin.attendances',
        filters: {
            type: filters.type,
            start_date: filters.startDate,
            end_date: filters.endDate,
        },
        successMessage: 'Attendance export completed successfully!',
        errorMessage: 'Failed to export attendances data',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendances" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-bold">Attendances History</h1>
                <Separator />
                <div className="flex items-center justify-between">
                    <FilterDropdown
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApplyFilters={handleApplyFilters}
                        onClearFilters={handleClearFilters}
                    />
                    <ExportDropdown {...exportHook} />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-36">
                                <Hash size={16} />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Trainer</TableHead>
                            <TableHead className="text-center">Entry Date</TableHead>
                            <TableHead className="text-center">Entry Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {attendances.data.map((attendance) => (
                            <TableRow key={attendance.id}>
                                <TableCell>{attendance.attendable?.rfid_uid}</TableCell>
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
                <Pagination data={attendances} onPageChange={handlePageChange} />
            </div>
        </AppLayout>
    );
}
