import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFormatDate } from '@/lib/helpers';
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
                </TableRow>
            </TableHeader>
            <TableBody>
                {lists.map((member, index) => (
                    <TableRow key={member.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell className="font-medium">{getFormatDate(member.registration_date)}</TableCell>
                    </TableRow>
                ))}
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
