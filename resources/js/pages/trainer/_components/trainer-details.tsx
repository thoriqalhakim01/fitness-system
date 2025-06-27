import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trainer } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronsUpDown, Eye, PlusCircle } from 'lucide-react';
import { useState } from 'react';

type Props = {
    trainer: Trainer;
};

export default function TrainerDetails({ trainer }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageView = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <div className="relative h-28 rounded-lg bg-muted-foreground">
                <div className="absolute top-10 left-8 flex h-24 w-24 items-center justify-center rounded-full border-2 border-white bg-accent-foreground">
                    <span className="text-4xl font-bold text-accent">{trainer.user.name.slice(0, 1)}</span>
                </div>
            </div>
            <p className="mt-6 text-2xl font-semibold">{trainer.user.name}</p>
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
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {trainer.certifications?.map((item) => (
                            <div key={item.id} className="flex flex-col gap-2 rounded-lg border p-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">{item.name}</p>
                                    {item.image_url && (
                                        <Button size="sm" variant="outline" onClick={() => handleImageView(item.image_url)}>
                                            <Eye className="mr-1 h-4 w-4" />
                                            View
                                        </Button>
                                    )}
                                </div>

                                {item.image_url && (
                                    <div className="mt-2">
                                        <img
                                            src={item.image_url}
                                            alt={`Certificate: ${item.name}`}
                                            className="h-32 w-full cursor-pointer rounded-md object-cover transition-opacity hover:opacity-90"
                                            onClick={() => handleImageView(item.image_url)}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/placeholder-certificate.png';
                                                e.currentTarget.alt = 'Certificate image not available';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        {trainer.certifications?.length === 0 && (
                            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">No certification found</p>
                        )}

                        <div className="col-span-full mt-4 flex w-full justify-center">
                            <Button size={'sm'} asChild>
                                <Link href={route('trainer.add-certificate')}>
                                    <PlusCircle className="mr-1 h-4 w-4" />
                                    <span>Add Certification</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            {selectedImage && (
                <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4" onClick={closeImageModal}>
                    <div className="relative max-h-full max-w-4xl">
                        <img src={selectedImage} alt="Certificate" className="max-h-full max-w-full rounded-lg object-contain" />
                        <Button variant="secondary" size="sm" className="absolute top-2 right-2" onClick={closeImageModal}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
