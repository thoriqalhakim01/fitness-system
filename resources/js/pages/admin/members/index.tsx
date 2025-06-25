import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { FilterParams, Member, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Eye, Hash, PlusCircle } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { PaginatedResponse } from '../../../types/index';

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
};

export default function Members({ members, flash }: Props) {
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

        router.get(route('admin.members.index'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };
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
                {members.total > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {members.from} to {members.to} of {members.total} results
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(members.current_page - 1)}
                                disabled={members.current_page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: members.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === members.current_page ? 'default' : 'outline'}
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
                                onClick={() => handlePageChange(members.current_page + 1)}
                                disabled={members.current_page === members.last_page}
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
