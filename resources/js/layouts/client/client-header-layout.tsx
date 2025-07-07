import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function ClientHeaderLayout() {
    return (
        <div className="relative h-full">
            <header className="flex h-16 w-full items-center justify-between px-4 text-sm lg:px-0">
                <div></div>
                <nav className="flex items-center justify-end gap-4">
                    <Button variant={'outline'} asChild>
                        <Link href={route('client.check-in')}>Check In</Link>
                    </Button>
                    <Button asChild>
                        <Link href={route('client.check-data')}>Check Data</Link>
                    </Button>
                </nav>
            </header>
        </div>
    );
}
