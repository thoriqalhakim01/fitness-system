import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Attendance } from '@/types';
import { Hash } from 'lucide-react';

type Props = {
    lists: Attendance[];
};

export default function AttendanceHistory({ lists }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Hash size={16} />
                    </TableHead>
                    <TableHead className="text-center">Entry Date</TableHead>
                    <TableHead className="text-center">Entry Time</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {lists.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                            No attendances found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
