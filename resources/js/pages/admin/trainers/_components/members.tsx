import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Member } from '@/types';
import { Hash } from 'lucide-react';

type Props = {
    lists: Member[];
};

export default function MembersListings({ lists }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Hash size={16} />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {lists.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No members found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
