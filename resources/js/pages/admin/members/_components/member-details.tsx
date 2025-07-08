import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { getAge } from '@/lib/helpers';
import { Member } from '@/types';
import { ChevronsUpDown, Dot } from 'lucide-react';
import { useState } from 'react';

type Props = {
    member: Member;
};

export default function MemberDetails({ member }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (status: string) => {
        if (status === 'active') {
            return 'bg-green-100 border-green-500 text-green-500';
        }
        return 'bg-red-100 border-red-500 text-red-500';
    };
    return (
        <>
            <div className="relative h-28 rounded-lg bg-muted-foreground">
                <div className="absolute top-10 left-8 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white bg-accent-foreground">
                    <span className="text-4xl font-bold text-accent">{member.name.slice(0, 1)}</span>
                </div>
            </div>
            <div className="mt-6 inline-flex items-center gap-1">
                <span className="text-xl font-semibold">{member.name}</span>
                <Dot size={8} />
                <Badge className={`${isActive(member.status)} capitalize`}>{member.status}</Badge>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Trainer:</span>
                    <span>{member.trainer?.user.name ?? '-'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Membership type:</span>
                    <span>{member.is_member ? 'Active Member' : 'Non-member'}</span>
                </div>
                {member.is_member && (
                    <>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">RFID:</span>
                            <span className="font-mono">{member.rfid_uid}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Points:</span>
                            <Badge>{member.points?.points}</Badge>
                        </div>
                    </>
                )}
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Age:</span>
                    <span>{getAge(member.birthdate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Weight:</span>
                    <span>{member.weight ?? '-'} kg</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Height:</span>
                    <span>{member.height ?? '-'} cm</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Email:</span>
                    <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Phone:</span>
                    <span>+62{member.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Created at:</span>
                    <span>{member.registration_date}</span>
                </div>
            </div>
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-semibold">Additional information</h4>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <ChevronsUpDown />
                            <span className="sr-only">Toggle</span>
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="flex flex-col gap-2"></CollapsibleContent>
            </Collapsible>
        </>
    );
}
