import { getDiffForHuman } from '@/lib/helpers';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Notification() {
    const { auth } = usePage<SharedData>().props;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={'sm'}>
                    <Bell />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="w-full space-y-2 py-2">
                    {auth.notifications.map((item) => (
                        <DropdownMenuItem key={item.notifiable_id} asChild>
                            <Link href={item.data.action_url} className="flex flex-col space-y-1">
                                <div className="flex w-full items-center justify-between">
                                    <p className="text-sm font-medium">{item.data.title}</p>
                                    <p className="text-xs text-muted-foreground">{getDiffForHuman(item.created_at)}</p>
                                </div>
                                <p className="text-xs">{item.data.message}</p>
                            </Link>
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
