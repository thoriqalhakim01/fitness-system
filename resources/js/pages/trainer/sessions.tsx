import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePagination } from '@/hooks/use-pagination';
import AppLayout from '@/layouts/app-layout';
import { getFormatDate, getFormatTime } from '@/lib/helpers';
import { Attendance, PaginatedResponse, TrainingSession } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle, ChevronDown, ChevronRight, Clock, Hash, XCircle } from 'lucide-react';
import { Fragment, useState } from 'react';

type Props = {
    trainingSessions: PaginatedResponse<TrainingSession>;
    attendances?: Attendance[];
};

export default function TrainingSessions({ trainingSessions, attendances = [] }: Props) {
    const [expandedSessions, setExpandedSessions] = useState<Set<number | string>>(new Set());

    const { handlePageChange } = usePagination({
        route: 'trainer.training-sessions',
        preserveFilters: true,
    });

    const toggleSession = (sessionId: number | string) => {
        setExpandedSessions((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(sessionId)) {
                newSet.delete(sessionId);
            } else {
                newSet.add(sessionId);
            }
            return newSet;
        });
    };

    const getMemberAttendanceForSession = (memberId: string, sessionTimestamp: string) => {
        const sessionDate = new Date(sessionTimestamp);
        const sessionStart = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
        const sessionEnd = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate(), 23, 59, 59);

        const memberAttendance = attendances.find((attendance) => {
            const attendanceDate = new Date(attendance.entry_timestamp);
            return (
                attendance.attendable_id === memberId &&
                attendance.attendable_type === 'App\\Models\\Member' &&
                attendanceDate >= sessionStart &&
                attendanceDate <= sessionEnd
            );
        });

        return {
            hasAttended: !!memberAttendance,
            attendanceTime: memberAttendance?.entry_timestamp || null,
        };
    };

    const getAttendanceStatusBadge = (hasAttended: boolean, attendanceTime: string | null) => {
        if (hasAttended && attendanceTime) {
            return (
                <div className="flex items-center justify-center gap-2">
                    <Badge variant="default" className="border-green-200 bg-green-100 text-green-800">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Present
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {getFormatTime(attendanceTime)}
                    </span>
                </div>
            );
        }

        return (
            <Badge variant="secondary" className="border-red-200 bg-red-100 text-red-800">
                <XCircle className="mr-1 h-3 w-3" />
                Absent
            </Badge>
        );
    };
    return (
        <AppLayout>
            <Head title="Trainer" />
            <div className="flex h-full flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Hash size={16} />
                            </TableHead>
                            <TableHead>Entry Date</TableHead>
                            <TableHead>Entry Time</TableHead>
                            <TableHead className="text-center">Members Trained</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trainingSessions.data?.map((item, index) => (
                            <Fragment key={item.id}>
                                <TableRow className="cursor-pointer hover:bg-muted/50">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{getFormatDate(item.entry_timestamp)}</TableCell>
                                    <TableCell>{getFormatTime(item.entry_timestamp)}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge>{item.members?.length || 0} Members</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" onClick={() => toggleSession(item.id)} className="h-8 w-8 p-0">
                                            {expandedSessions.has(item.id) ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </TableCell>
                                </TableRow>

                                {expandedSessions.has(item.id) && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="p-0">
                                            <div className="bg-muted/30 p-4">
                                                <div className="mb-3">
                                                    <h4 className="text-sm font-medium text-muted-foreground">Members who attended this session:</h4>
                                                </div>

                                                {item.members && item.members.length > 0 ? (
                                                    <div className="rounded-md border bg-background">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>
                                                                        <Hash size={16} />
                                                                    </TableHead>
                                                                    <TableHead>Name</TableHead>
                                                                    <TableHead className="text-center">Status</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {item.members.map((member, index) => {
                                                                    const { hasAttended, attendanceTime } = getMemberAttendanceForSession(
                                                                        member.id,
                                                                        item.entry_timestamp,
                                                                    );

                                                                    return (
                                                                        <TableRow key={member.id}>
                                                                            <TableCell className="py-2">{index + 1}</TableCell>
                                                                            <TableCell className="py-2">{member.name}</TableCell>
                                                                            <TableCell className="py-2 text-center">
                                                                                {getAttendanceStatusBadge(hasAttended, attendanceTime)}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                ) : (
                                                    <div className="rounded-md border bg-background p-6 text-center">
                                                        <p className="text-sm text-muted-foreground">No members attended this session.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))}
                        {trainingSessions.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No training sessions found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Pagination data={trainingSessions} onPageChange={handlePageChange} />
            </div>
        </AppLayout>
    );
}
