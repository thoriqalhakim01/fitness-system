import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getFormatDate } from '@/lib/helpers';
import { MemberLog } from '@/types';
import { format } from 'date-fns';
import { Calendar, ChevronDown, ChevronRight, Dumbbell, Scale, StickyNote, TrendingUp, User } from 'lucide-react';
import { useState } from 'react';

type Props = {
    logs: MemberLog[];
};

export default function MemberLogs({ logs }: Props) {
    const [expandedLogs, setExpandedLogs] = useState<string[]>([]);

    const toggleLog = (logId: string) => {
        setExpandedLogs((prev) => (prev.includes(logId) ? prev.filter((id) => id !== logId) : [...prev, logId]));
    };

    if (logs.length === 0) {
        return (
            <Card>
                <CardContent className="flex h-36 flex-col items-center justify-center space-y-4">
                    <StickyNote size={48} className="text-muted-foreground" />
                    <h3 className="mb-2 text-lg font-semibold text-muted-foreground">No logs yet</h3>
                    <p className="text-center text-sm text-muted-foreground">
                        Get started with tracking your progress! Your fitness journey begins with a single log entry.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {logs.map((log) => (
                <Card key={log.id} className="overflow-hidden">
                    <Collapsible open={expandedLogs.includes(log.id)} onOpenChange={() => toggleLog(log.id)}>
                        <CollapsibleTrigger className="w-full">
                            <CardHeader className="cursor-pointer transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-semibold">{getFormatDate(log.log_date)}</span>
                                        </div>
                                        {log.weight && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Scale className="mr-1 h-3 w-3" />
                                                {log.weight}kg
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                            {log.exercises?.length || 0} exercises
                                        </Badge>
                                        {expandedLogs.includes(log.id) ? (
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>

                                {!expandedLogs.includes(log.id) && (log.notes || log.progress_notes) && (
                                    <div className="mt-2 text-left">
                                        <p className="line-clamp-2 text-sm text-muted-foreground">{log.notes || log.progress_notes}</p>
                                    </div>
                                )}
                            </CardHeader>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                            <CardContent className="pt-0">
                                <div className="space-y-6">
                                    {log.exercises && log.exercises.length > 0 && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                                                <h4 className="text-sm font-semibold">Exercises</h4>
                                            </div>
                                            <div className="grid gap-3">
                                                {log.exercises.map((exercise, index) => (
                                                    <div key={index} className="rounded-lg bg-muted/30 p-3">
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <h5 className="font-medium">{exercise.name}</h5>
                                                            {exercise.weight && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {exercise.weight}kg
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                                            <span>{exercise.sets} sets</span>
                                                            <span>•</span>
                                                            <span>{exercise.reps} reps</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {log.notes && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <StickyNote className="h-4 w-4 text-muted-foreground" />
                                                <h4 className="text-sm font-semibold">Session Notes</h4>
                                            </div>
                                            <p className="pl-6 text-sm text-muted-foreground">{log.notes}</p>
                                        </div>
                                    )}

                                    {log.progress_notes && (
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                                <h4 className="text-sm font-semibold">Progress Notes</h4>
                                            </div>
                                            <p className="pl-6 text-sm text-muted-foreground">{log.progress_notes}</p>
                                        </div>
                                    )}

                                    <div className="border-t pt-3">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <User className="h-3 w-3" />
                                            <span>Logged by {log.trainer?.name || 'Unknown Trainer'}</span>
                                            <span>•</span>
                                            <span>{format(new Date(log.created_at), "MMM dd, yyyy 'at' HH:mm")}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            ))}
        </div>
    );
}
