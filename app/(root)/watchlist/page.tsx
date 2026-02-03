'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import type { WatchlistItem } from '@/app/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function WatchlistPage() {
    const { session } = useAuth();
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return;

        async function fetchWatchlist() {
            try {
                setLoading(true);

                const res = await fetch(`${BASE_URL}/api/user/watchlists`);
                if (!res.ok) throw new Error('Failed to fetch watchlist');

                const data: WatchlistItem[] = await res.json();
                setItems(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchWatchlist();
    }, [session]);

    return (
        <div className="px-4 pt-20 md:px-8 lg:px-16">
            <h1 className="mb-16 text-center text-3xl font-bold text-white md:text-4xl lg:text-[42px]">
                Your <span className="text-primary">Watchlist</span>
            </h1>

            {!session && <p className="text-center text-gray-400">Login to create Watchlist.</p>}

            {session &&
                (loading ? (
                    <p className="text-center text-gray-400">Loading watchlist...</p>
                ) : items.length === 0 ? (
                    <p className="text-center text-gray-300">Your watchlist is empty.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => (
                            <Link
                                key={`${item.type}-${item.id}`}
                                href={`/${item.type}/${item.id}`}
                                className="rounded-xl border border-gray-700 bg-[#111] p-4 transition hover:border-red-600"
                            >
                                <h2 className="text-lg font-semibold text-white">{item.title}</h2>

                                <p className="mt-2 text-sm text-gray-400">
                                    Type: <span className="text-white capitalize">{item.type}</span>
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    Added:{' '}
                                    {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </p>
                            </Link>
                        ))}
                    </div>
                ))}
        </div>
    );
}
