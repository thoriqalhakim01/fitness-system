import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getCurrencyFormat, getFormatDate } from '@/lib/helpers';
import { Transaction } from '@/types';
import { Eye } from 'lucide-react';

export default function ShowTransaction({ data }: { data: Transaction }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'outline'} size={'sm'}>
                    <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Detail Transaction</DialogTitle>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Transaction Date</p>
                        <p>{getFormatDate(data.transaction_date)}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Member</p>
                        <p>{data.member?.name}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Package</p>
                        <p>{data.package?.name}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Point Added</p>
                        <p>{data.points}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Amout</p>
                        <p>{getCurrencyFormat(data.amount)}</p>
                    </div>
                    <div className="grid gap-1 text-sm">
                        <p className="font-semibold">Payment Method</p>
                        <p>{data.payment_method}</p>
                    </div>
                </div>
                <div className="grid gap-1 text-sm">
                    <p className="font-semibold">Notes</p>
                    <p>{data.notes}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
