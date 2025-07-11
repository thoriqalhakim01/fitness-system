import { Badge } from '@/components/ui/badge';
import { Trainer } from '@/types';
import { useState } from 'react';

type Props = {
    trainer: Trainer;
};

export default function TrainerDetails({ trainer }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div className="relative h-28 rounded-lg bg-muted-foreground">
                <div className="absolute top-10 left-8 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white bg-accent-foreground">
                    <span className="text-4xl font-bold text-accent">{trainer.user.name.slice(0, 1)}</span>
                </div>
            </div>
            <p className="mt-6 text-xl font-semibold">{trainer.user.name}</p>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Email:</span>
                    <span>{trainer.user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Phone:</span>
                    <span>+62{trainer.user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Members trained:</span>
                    <Badge>{trainer.members?.length}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Created at:</span>
                    <span>{trainer.created_at}</span>
                </div>
            </div>
        </>
    );
}
