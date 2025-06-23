import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrainingSession } from '@/types';
import { Hash } from 'lucide-react';

type Props = {
    lists: TrainingSession[];
};

export default function TrainingSessionTable({ lists }: Props) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <Hash size={16} />
                    </TableHead>
                    <TableHead>Entry Date</TableHead>
                    <TableHead>Entry Time</TableHead>
                    <TableHead className="text-center">Members Trained</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {lists.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No training sessions found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
