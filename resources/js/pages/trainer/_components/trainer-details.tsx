import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trainer } from '@/types';
import { ChevronsUpDown, PlusCircle } from 'lucide-react';
import { useState } from 'react';

type Props = {
    trainer: Trainer;
};

export default function TrainerDetails({ trainer }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <p className="text-2xl font-semibold">{trainer.user.name}</p>
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
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-semibold">Certifications</h4>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <ChevronsUpDown />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                        {trainer.certifications?.map((item) => (
                            <div className="flex flex-col gap-2">
                                <p>{item.name}</p>
                            </div>
                        ))}

                        {trainer.certifications?.length === 0 && (
                            <p className="col-span-2 text-center text-sm text-muted-foreground">No certification found</p>
                        )}

                        <div className="col-span-2 flex w-full justify-center">
                            <Button size={'sm'}>
                                <PlusCircle />
                                <span>Add Certification</span>
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}
