'use client';

import Link from 'next/link';
import { Film, Search, Bookmark, User } from 'lucide-react';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const signOut = async () => {
        let toastId: string | number;
        await authClient.signOut({
            fetchOptions: {
                onRequest: () => {
                    toastId = toast.loading('Signing out...');
                    setOpen(false);
                },
                onSuccess: () => {
                    toast.success('Signed out successfully', { id: toastId, duration: 3000 });
                    router.push('/home');
                },
                onError: () => {
                    toast.error('Error signing out', { id: toastId, duration: 3000 });
                    router.push('/home');
                },
            },
        });
    };

    return (
        <nav className="border-b border-neutral-800 bg-black">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
                <Link href="/home" className="flex items-center gap-2">
                    <span className="rounded bg-red-600 p-1.5">
                        <Film className="h-5 w-5 text-white" />
                    </span>
                    <span className="hidden font-medium tracking-wide text-white md:flex">CineMatrix</span>
                </Link>

                <div className="flex flex-1 items-center justify-center gap-10 md:gap-20">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute top-1/2 left-3 w-4 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search movies, TV shows..."
                            className="w-full rounded-2xl bg-neutral-200 py-1 pr-4 pl-11 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                        />
                    </div>
                    <Link
                        href="/watchlist"
                        className="flex items-center gap-1 whitespace-nowrap text-white transition hover:text-neutral-400"
                    >
                        <Bookmark className="h-5 w-5" />
                        <span className="hidden md:flex">Watchlist</span>
                    </Link>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setOpen((p) => !p)}
                        className="cursor-pointer rounded-full bg-red-600 p-2 transition hover:bg-red-800"
                    >
                        <User className="h-4 w-4 text-white" />
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-4 w-36 rounded-md bg-neutral-900 py-0.5 shadow-lg ring-1 ring-neutral-800">
                            <Link
                                href="/user-profile"
                                className="block cursor-pointer px-4 py-2 text-sm text-white hover:bg-neutral-800"
                                onClick={() => setOpen(false)}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/login"
                                className="block cursor-pointer px-4 py-2 text-sm text-white hover:bg-neutral-800"
                                onClick={() => setOpen(false)}
                            >
                                Sign in
                            </Link>
                            <button
                                className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-400 hover:bg-neutral-800"
                                onClick={() => signOut()}
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
