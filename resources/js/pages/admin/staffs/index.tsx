import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { FilterParams, User, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Hash, Lock, MoreVertical, PencilLine, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '../../../types/index';
import DeleteStaff from './_components/delete-staff';
import { usePagination } from '@/hooks/use-pagination';
import { Pagination } from '@/components/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Staffs',
        href: '/dashboard/staffs',
    },
];

type Props = {
    staffs: PaginatedResponse<User>;
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Staffs({ staffs, flash }: Props) {
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        staffId: string | null;
    }>({
        isOpen: false,
        staffId: null,
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const { handlePageChange } = usePagination({
        route: 'admin.staffs.index',
        preserveFilters: true,
    });

    const openDeleteDialog = (staffId: string) => {
        setDeleteDialog({
            isOpen: true,
            staffId,
        });
    };

    const closeDeleteDialog = () => {
        setDeleteDialog({
            isOpen: false,
            staffId: null,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staffs" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Our Staffs</h1>
                    <Button size={'sm'} asChild>
                        <Link href={route('admin.staffs.create')}>
                            <PlusCircle />
                            <span className="hidden sm:block">Add Staffs</span>
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
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {staffs.data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.phone}</TableCell>
                                <TableCell>{item.created_at}</TableCell>
                                <TableCell className="flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant={'outline'} size={'sm'}>
                                                <MoreVertical size={16} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem asChild>
                                                <Link href={route('admin.staffs.edit', item.id)}>
                                                    <PencilLine size={16} />
                                                    <span className="hidden sm:block">Edit</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={route('admin.staffs.edit-password', item.id)}>
                                                    <Lock size={16} />
                                                    <span className="hidden sm:block">Change Password</span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem variant="destructive" asChild>
                                                <button className="w-full" type="button" onClick={() => openDeleteDialog(item.id)}>
                                                    <Trash2 size={16} />
                                                    <span className="hidden sm:block">Delete</span>
                                                </button>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {staffs.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No staffs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <Pagination
                    data={staffs}
                    onPageChange={handlePageChange}
                />

                {deleteDialog.staffId && <DeleteStaff id={deleteDialog.staffId} isOpen={deleteDialog.isOpen} onClose={closeDeleteDialog} />}
            </div>
        </AppLayout>
    );
}
