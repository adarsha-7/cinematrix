'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Check, Plus, X } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function WatchlistSection({ id, type }: { id: string; type: 'movie' | 'tv-show' }) {
    const [inWatchlist, setInWatchlist] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const { session } = useAuth();

    const getWatchlistStatus = async () => {
        try {
            const queryParam =
                type === 'movie' ? `movieId=${encodeURIComponent(id)}` : `tvShowId=${encodeURIComponent(id)}`;

            const res = await fetch(`${BASE_URL}/api/user/watchlist?${queryParam}`);
            const { inWatchlist } = await res.json();

            setInWatchlist(inWatchlist);
        } catch (err) {
            console.error('Error fetching watchlist status', err);
        }
    };

    const toggleWatchlist = async () => {
        try {
            const action = inWatchlist ? 'remove' : 'add';

            if (type === 'movie') {
                await Promise.all([
                    fetch(`${BASE_URL}/api/user/watchlist?movieId=${encodeURIComponent(id)}&action=${action}`, {
                        method: 'POST',
                    }),
                    fetch(`${BASE_URL}/api/user/interaction`, {
                        method: inWatchlist ? 'DELETE' : 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            movieId: Number(id),
                            type: 'WATCHLIST',
                        }),
                    }),
                ]);
            } else {
                await fetch(`${BASE_URL}/api/user/watchlist?tvShowId=${encodeURIComponent(id)}&action=${action}`, {
                    method: 'POST',
                });
            }

            setInWatchlist(!inWatchlist);
            setOpen(false);
        } catch (err) {
            console.error('Error updating watchlist', err);
        }
    };

    useEffect(() => {
        if (session) getWatchlistStatus();
    }, [id]);

    return (
        <div>
            <h2 className="mb-3 text-2xl font-semibold">{inWatchlist ? 'In Your Watchlist' : 'Add to Watchlist'}</h2>

            {session ? (
                <button
                    onClick={() => setOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-800 px-4 py-2 hover:bg-gray-700"
                >
                    {inWatchlist ? (
                        <>
                            <Check className="h-5 w-5 text-green-400" />
                            In Watchlist
                        </>
                    ) : (
                        <>
                            <Plus className="h-5 w-5 text-gray-300" />
                            Add
                        </>
                    )}
                </button>
            ) : (
                <span>Login Required</span>
            )}

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="relative w-[320px] rounded-lg bg-neutral-900 p-6">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="mb-4 text-center text-lg font-semibold">
                            {inWatchlist ? 'Remove from Watchlist?' : 'Add to Watchlist?'}
                        </h3>

                        <button
                            onClick={toggleWatchlist}
                            className={`w-full rounded-md py-2 font-semibold transition ${
                                inWatchlist
                                    ? 'cursor-pointer bg-red-500 text-black hover:bg-red-600'
                                    : 'cursor-pointer bg-yellow-500 text-black hover:bg-yellow-600'
                            }`}
                        >
                            {inWatchlist ? 'Remove' : 'Add'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
