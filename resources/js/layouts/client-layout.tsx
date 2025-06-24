import { PropsWithChildren } from 'react';
import ClientHeaderLayout from './client/client-header-layout';

export default function ClientLayout({ children }: PropsWithChildren) {
    return (
        <div className="light flex h-screen w-full flex-1 flex-col bg-background">
            <div className="h-24z mx-auto w-full max-w-7xl px-4 lg:h-24 lg:px-0">
                <ClientHeaderLayout />
            </div>
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
                <main className="my-6 flex flex-1 flex-col space-y-8">{children}</main>
            </div>
        </div>
    );
}
