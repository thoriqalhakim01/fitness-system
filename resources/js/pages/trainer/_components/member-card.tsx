import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getAge } from '@/lib/helpers';
import { Member } from '@/types';
import { Link } from '@inertiajs/react';

type Props = {
    data: Member;
};

export default function MemberCard({ data }: Props) {
    return (
        <Link href={route('trainer.show-member', data.id)} className="transition-all duration-300 ease-in-out hover:scale-105">
            <div className="flex flex-col rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
                <div className="flex h-36 flex-col items-center justify-center gap-2 pb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <p className="text-3xl font-bold">{data.name.charAt(0).toUpperCase()}</p>
                    </div>
                    <p className="font-medium">{data.name}</p>
                    {data.status === 'active' ? (
                        <Badge variant="default" className="border-green-200 bg-green-100 text-green-800">
                            Active
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="border-red-200 bg-red-100 text-red-800">
                            Inactive
                        </Badge>
                    )}
                </div>
                <Separator />
                <div className="grid grid-cols-3 pt-4">
                    <div className="flex w-full flex-col items-center justify-center gap-2">
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="text-sm font-medium">{getAge(data.birthdate)}</p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-2">
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="text-sm font-medium">
                            {data.weight}
                            <span className="text-xs">kg</span>
                        </p>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-2">
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="text-sm font-medium">
                            {data.height}
                            <span className="text-xs">cm</span>
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
