import { Pagination } from '@/components/pagination';
import { SearchBar } from '@/components/search-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePagination } from '@/hooks/use-pagination';
import AppLayout from '@/layouts/app-layout';
import { FilterParams, Member, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronDown, Eye, FileDown, FileText, Hash, PlusCircle, Sheet } from 'lucide-react';
import { FormEvent, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '../../../types/index';
import { FilterDropdown } from './_components/filter-dropdown';
import { useFilters } from './_hooks/useFilters';
import { useExport } from '@/hooks/use-export';
import { ExportDropdown } from '@/components/export-dropdown';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Members',
        href: '/dashboard/members',
    },
];

type Props = {
    members: PaginatedResponse<Member>;
    flash?: {
        success?: string;
        error?: string;
    };
    filters?: FilterParams;
};

export default function Members({ members, flash, filters: initialFilters }: Props) {
    const { searchTerm, filters, setSearchTerm, handleFilterChange, handleSearch, handleApplyFilters, handleClearFilters } =
        useFilters(initialFilters);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const { handlePageChange } = usePagination({
        route: 'admin.members.index',
        preserveFilters: true,
        filters: {
            search: searchTerm,
            status: filters.status,
            type: filters.type,
            start_date: filters.startDate,
            end_date: filters.endDate,
        },
    });

    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleSearch();
    };

    const exportHook = useExport({
        baseRouteName: 'admin.members',
        filters: {
            search: searchTerm,
            status: filters.status,
            type: filters.type,
            start_date: filters.startDate,
            end_date: filters.endDate,
        },
        successMessage: 'Members export completed successfully!',
        errorMessage: 'Failed to export members data',
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Members" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Our Members</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('admin.members.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Add Member</span>
                        </Link>
                    </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <SearchBar
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            onSearchSubmit={handleSearchSubmit}
                            placeholder="Search members..."
                            className="lg:w-96"
                        />
                        <FilterDropdown
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onApplyFilters={handleApplyFilters}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                    <ExportDropdown {...exportHook} />
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Hash size={16} />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone number</TableHead>
                            <TableHead>Trainer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-center">Points</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono">{item.rfid_uid}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.phone}</TableCell>
                                <TableCell>{item.trainer.user.name}</TableCell>
                                <TableCell className="flex items-center gap-1">
                                    {item.is_member ? (
                                        <Badge variant="default" className="border-green-200 bg-green-100 text-green-800">
                                            Active Member
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="border-red-200 bg-red-100 text-red-800">
                                            Non-member
                                        </Badge>
                                    )}
                                    {item.status === 'active' ? (
                                        <Badge variant="default" className="border-green-200 bg-green-100 text-green-800">
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="border-red-200 bg-red-100 text-red-800">
                                            Inactive
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge>{item.points?.points}</Badge>
                                </TableCell>
                                <TableCell className="flex justify-end">
                                    <Button variant={'ghost'} size={'icon'} asChild>
                                        <Link href={route('admin.members.show', item.id)}>
                                            <Eye />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {members.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No members found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Pagination data={members} onPageChange={handlePageChange} />
            </div>
        </AppLayout>
    );
}
