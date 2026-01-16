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
        let toastLoadingId: string | number;
        await authClient.signOut({
            fetchOptions: {
                onRequest: () => {
                    toastLoadingId = toast.loading('Signing out...');
                    setOpen(false);
                },
                onSuccess: () => {
                    toast.success('Signed out successfully', { id: toastLoadingId });
                    router.push('/home');
                },
                onError: () => {
                    toast.error('Error signing out');
                    router.push('/home');
                },
            },
        });
    };

    return (
        <nav className="border-b border-neutral-800 bg-black">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-6 py-2">
                    {/* Logo */}
                    <Link href="/home" className="flex items-center gap-2">
                        <span className="rounded bg-red-600 p-1.5">
                            <Film className="h-5 w-5 text-white" />
                        </span>
                        <span className="font-medium tracking-wide text-white">CineMatrix</span>
                    </Link>

                    {/* Center */}
                    <div className="flex flex-1 items-center justify-center gap-4">
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
                            className="flex items-center gap-2 whitespace-nowrap text-white transition hover:text-neutral-400"
                        >
                            <Bookmark className="h-4 w-4" />
                            <span>Watchlist</span>
                        </Link>
                    </div>

                    {/* User Dropdown */}
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
            </div>
        </nav>
    );
}
