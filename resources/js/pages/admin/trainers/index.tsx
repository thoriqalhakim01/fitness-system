import { ExportDropdown } from '@/components/export-dropdown';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useExport } from '@/hooks/use-export';
import { usePagination } from '@/hooks/use-pagination';
import AppLayout from '@/layouts/app-layout';
import { FilterParams, Trainer, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Hash, PlusCircle, Search } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
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
    filters?: FilterParams;
};

export default function Trainers({ trainers, flash, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.search);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const applyFilters = () => {
        const params: FilterParams = {
            search: searchTerm,
        };

        router.get(route('admin.trainers.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const { handlePageChange } = usePagination({
        route: 'admin.trainers.index',
        preserveFilters: true,
        filters: { search: searchTerm },
    });

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        applyFilters();
    };

    const exportHook = useExport({
        baseRouteName: 'admin.trainers',
        filters: {
            search: searchTerm,
        },
        successMessage: 'Trainers export completed successfully!',
        errorMessage: 'Failed to export trainers data',
    });
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
                <div className="flex items-center justify-between">
                    <form onSubmit={handleSearch} className="relative max-h-9 w-full">
                        <Input
                            type="search"
                            className="ps-8 lg:w-1/3"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute top-0 left-0 flex h-9 items-center justify-start px-2">
                            <Search size={16} />
                        </div>
                    </form>
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
                <Pagination data={trainers} onPageChange={handlePageChange} />
            </div>
        </AppLayout>
    );
}
