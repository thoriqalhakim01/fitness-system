import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { getCurrencyFormat } from '@/lib/helpers';
import { Package, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Hash } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import CreatePackage from './_components/create-package';
import DeletePackage from './_components/delete-package';
import EditPackage from './_components/edit-package';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Packages',
        href: '/dashboard/packages',
    },
];

type Props = {
    options: Package[];
    flash?: {
        success?: string;
        error?: string;
    };
};

export default function Packages({ options, flash }: Props) {
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    });
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Packages" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Package Listings</h1>
                    <CreatePackage />
                </div>
                <Separator />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Hash size={16} />
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-center">Price</TableHead>
                            <TableHead className="text-center">Points</TableHead>
                            <TableHead className="text-center">Duration (days)</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {options.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-mono">{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{getCurrencyFormat(item.price)}</TableCell>
                                <TableCell className="text-center">
                                    <Badge>{item.points}</Badge>
                                </TableCell>
                                <TableCell className="text-center">{item.duration}</TableCell>
                                <TableCell className="flex items-center justify-end gap-2">
                                    <EditPackage option={item} />
                                    <DeletePackage id={item.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                        {options.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No packages found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
