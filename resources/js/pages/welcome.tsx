import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import WelcomeHeaderLayout from '@/layouts/client/welcome-header-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative flex h-screen w-full flex-1 flex-col">
                <div className="absolute top-0 right-0 left-0">
                    <div className="mx-auto w-full max-w-5xl">
                        <WelcomeHeaderLayout />
                    </div>
                    <Separator />
                </div>
                <main className="mx-auto flex min-h-full w-full max-w-5xl flex-1 flex-col py-16">
                    <div className="flex h-full w-full items-center justify-between gap-8">
                        <div className="flex w-full flex-1 flex-col gap-6">
                            <div className="inline-flex h-10 w-fit items-center rounded-2xl border px-4">
                                <p className="text-sm">
                                    <span className="font-medium text-primary">100+</span> Active Membership
                                </p>
                            </div>
                            <h1 className="font-serif text-6xl">
                                Make Your Body <br /> Healthy And <br /> Physical Feat.
                            </h1>
                            <p className="text-sm">
                                At Big Bear Gym we believe fitness is for everybody. Our gym is your <br />
                                dedicated space to grow, transform, and thrive.
                            </p>
                            <div className="flex items-center gap-6">
                                <Button asChild>
                                    <Link href="/join-now">Get Started</Link>
                                </Button>
                                <TextLink href={''} className="group inline-flex items-center gap-1 text-sm">
                                    Contact Our Staff
                                    <ArrowUpRight
                                        className="transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1"
                                        size={16}
                                    />
                                </TextLink>
                            </div>
                        </div>
                        <div className="w-full flex-1 pt-16">
                            <div className="relative h-full max-h-[calc(100vh-8rem)] w-full overflow-hidden rounded-lg">
                                <img src="/hero.jpg" alt="Big Bear Gym" className="h-full w-full object-cover" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
