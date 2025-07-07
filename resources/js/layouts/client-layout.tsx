import { Separator } from '@/components/ui/separator';
import { PropsWithChildren } from 'react';
import ClientHeaderLayout from './client/client-header-layout';

export default function ClientLayout({ children }: PropsWithChildren) {
    return (
        <div className="relative flex h-screen w-full flex-1 flex-col">
            <div className="absolute top-0 right-0 left-0">
                <div className="mx-auto w-full max-w-5xl">
                    <ClientHeaderLayout />
                </div>
                <Separator />
            </div>
            <main className="mx-auto flex min-h-full w-full max-w-5xl flex-1 flex-col items-center justify-center">
                <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
                    <img src="/logo.png" className="h-36 w-36" alt="Logo" />
                    <h1 className="text-center font-serif text-6xl text-balance">Make Your Body Healthy And Physical Feat.</h1>
                    {children}
                </div>
            </main>
        </div>
    );
}
