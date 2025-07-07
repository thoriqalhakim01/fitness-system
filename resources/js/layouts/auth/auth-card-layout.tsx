import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col">
                <Card className="rounded-xl">
                    <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                        <div className="flex h-24 w-24 items-center justify-center">
                            <img src="/logo.png" className="h-24 w-24" alt="Logo" />
                        </div>
                    </Link>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>{children}</CardContent>
                </Card>
            </div>
        </div>
    );
}
