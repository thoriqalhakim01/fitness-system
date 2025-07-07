import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative grid h-dvh flex-col items-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-primary-foreground lg:flex">
                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                    <img src="/logo-white.png" className="h-24 w-24" alt="Logo" />
                </Link>
                <div className="absolute inset-0 bg-primary" />
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="font-serif text-6xl text-balance">Fitness is science. Management is strategy. Success is execution.</p>
                    </blockquote>
                </div>
            </div>
            <div className="w-full">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 lg:max-w-sm">
                    <Link href={route('home')} className="flex items-center gap-2 self-center font-medium lg:hidden">
                        <img src="/logo.png" className="h-24 w-24" alt="Logo" />
                    </Link>
                    <div className="flex flex-col gap-4 text-left">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-medium">{title}</h1>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
