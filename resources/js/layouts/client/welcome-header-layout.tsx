import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

export default function WelcomeHeaderLayout() {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="flex h-16 w-full items-center justify-between text-sm lg:px-0 px-4">
            <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                <div className="flex h-12 w-12 items-center justify-center">
                    <img src="/logo.png" className="h-12 w-12" alt="Logo" />
                </div>
            </Link>
            {/* <nav className="flex items-center gap-6">
                <Button variant={'ghost'} size={'sm'} asChild>
                    <Link href={route('home')}>Home</Link>
                </Button>
                <Button variant={'ghost'} size={'sm'} asChild>
                    <Link href={route('home')}>Trainer</Link>
                </Button>
                <Button variant={'ghost'} size={'sm'} asChild>
                    <Link href={route('home')}>About Us</Link>
                </Button>
            </nav> */}
            <nav className="flex items-center justify-end gap-4">
                {auth.user ? (
                    <Link
                        href={auth.role === 'trainer' ? route('trainer.dashboard') : route('admin.dashboard.index')}
                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Button size={'sm'} variant={'outline'} asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                        <Button size={'sm'} asChild>
                            <Link href="/join-now">
                                Join Now
                                <ArrowUpRight />
                            </Link>
                        </Button>
                    </>
                )}
            </nav>
        </header>
    );
}
