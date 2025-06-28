import TextLink from '@/components/text-link';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ArrowUpRight, Clock } from 'lucide-react';

export default function AllMembers({
    expiringMembers,
}: {
    expiringMembers: {
        id: string;
        name: string;
        email: string;
        phone: string;
        expires_at: string;
        days_remaining: number;
        expires_status: string;
    }[];
}) {
    const getStatusBadge = (status: string, daysRemaining: number) => {
        if (status === 'critical') {
            return (
                <Badge variant="destructive" className="gap-1">
                    <AlertTriangle size={12} />
                    {daysRemaining} days
                </Badge>
            );
        }
        return (
            <Badge variant="secondary" className="gap-1">
                <Clock size={12} />
                {daysRemaining} days
            </Badge>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <h2 className="text-balancce font-serif text-lg">Members</h2>
                <TextLink href={route('admin.members.index')} className="group inline-flex items-center gap-1 text-sm">
                    View all
                    <ArrowUpRight
                        className="transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
                        size={16}
                    />
                </TextLink>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Member Name</TableHead>
                        <TableHead>Expires Date</TableHead>
                        <TableHead className="text-center">Tel</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expiringMembers.length > 0 ? (
                        expiringMembers.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="flex items-center gap-1 font-medium">
                                    <div></div>
                                    <div className="flex flex-col gap-1">
                                        <p>{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.email}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {getStatusBadge(item.expires_status, item.days_remaining)}
                                </TableCell>
                                <TableCell className="text-right font-medium">{item.phone}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                No members found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
