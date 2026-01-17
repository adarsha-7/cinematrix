'use client';

import Link from 'next/link';
import { Film, Search, LayoutList, User } from 'lucide-react';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const { session, loading, error, refetch } = useAuth();
    const user = session?.user || null;

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
        await refetch();
    };

    return (
        <nav className="border-b border-neutral-800 bg-black">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:gap-10 lg:px-8">
                <Link href="/home" className="flex items-center gap-2">
                    <span className="bg-primary rounded p-1.5">
                        <Film className="h-5 w-5 text-white" />
                    </span>
                    <span className="hidden font-semibold tracking-wide text-white md:flex">CineMatrix</span>
                </Link>

                <div className="relative w-full max-w-md">
                    <Search className="absolute top-1/2 left-3 w-4 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search movies, TV shows..."
                        className="w-full rounded-3xl bg-neutral-200 py-2 pr-4 pl-11 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
                    />
                </div>

                <div className="flex gap-10 font-medium">
                    <Link
                        href="/watchlist"
                        className="flex items-center gap-1 whitespace-nowrap text-white transition hover:text-neutral-400"
                    >
                        <LayoutList className="h-5 w-5" />
                        <span className="hidden md:flex">Watchlist</span>
                    </Link>
                    <div className="relative">
                        <button
                            onClick={() => setOpen((prev) => !prev)}
                            className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-white transition hover:text-neutral-400"
                        >
                            {!user ? (
                                <User className="h-5 w-5" />
                            ) : (
                                <img
                                    className="h-6 min-h-6 w-6 min-w-6 rounded-full lg:h-7 lg:w-7"
                                    src={
                                        user.image ||
                                        'https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg'
                                    }
                                    alt="User Avatar"
                                />
                            )}

                            {user && <span className="hidden md:flex">{user.name.split(' ')[0]}</span>}
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-5 w-36 rounded-sm bg-neutral-900 py-1 shadow-lg ring-1 ring-neutral-800">
                                {session && (
                                    <Link
                                        href="/user-profile"
                                        className="block cursor-pointer px-4 py-2 text-sm text-white hover:bg-neutral-800"
                                        onClick={() => setOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                )}
                                {!session && (
                                    <Link
                                        href="/login"
                                        className="block cursor-pointer px-4 py-2 text-sm text-white hover:bg-neutral-800"
                                        onClick={() => setOpen(false)}
                                    >
                                        Sign in
                                    </Link>
                                )}
                                {session && (
                                    <button
                                        className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-400 hover:bg-neutral-800"
                                        onClick={() => signOut()}
                                    >
                                        Sign out
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
