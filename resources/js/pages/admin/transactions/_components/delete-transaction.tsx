import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function DeleteTransaction({ id }: { id: string }) {
    const { delete: destroy, processing } = useForm();

    const deleteTransaction: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('admin.transactions.destroy', id), {
            preserveScroll: true,
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size={'sm'}>
                    <Trash2 />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this transaction?</DialogTitle>
                <form className="space-y-6" onSubmit={deleteTransaction}>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button variant="destructive" disabled={processing}>
                            Delete transaction
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
