'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Check, X } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function WatchlistSection({ id }: { id: string }) {
    const { session } = useAuth();
    const [inWatchlist, setInWatchlist] = useState(false);
    const [open, setOpen] = useState(false);
    const [watchlists, setWatchlists] = useState<{ id: string; name: string }[]>([]);
    const [selectedWatchlist, setSelectedWatchlist] = useState<string | null>(null);

    // Fetch user's watchlists
    const getWatchlists = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/user/watchlists`);
            const data = await res.json();
            setWatchlists(data.watchlists || []);
        } catch (err) {
            console.error('Error fetching watchlists', err);
        }
    };

    // Check if this movie is already in any watchlist
    const checkInWatchlist = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/user/watchlist/check?movieId=${id}`);
            const data = await res.json();
            setInWatchlist(data.inWatchlist || false);
        } catch (err) {
            console.error('Error checking watchlist', err);
        }
    };

    const toggleWatchlist = async () => {
        if (!selectedWatchlist) return;

        try {
            await fetch(`${BASE_URL}/api/user/watchlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    watchlistId: selectedWatchlist,
                }),
            });

            setInWatchlist(true);
            setOpen(false);
        } catch (err) {
            console.error('Error adding to watchlist', err);
        }
    };

    useEffect(() => {
        if (session) {
            getWatchlists();
            checkInWatchlist();
        }
    }, [session]);

    if (!session) return <span>Login Required</span>;

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 rounded-md bg-gray-700 px-6 py-2 transition hover:bg-gray-600"
            >
                {inWatchlist ? <Check className="h-5 w-5 text-green-400" /> : <Plus size={18} />}
                {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="relative w-[320px] rounded-lg bg-neutral-900 p-6">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 cursor-pointer text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="mb-4 text-center text-lg font-semibold">Add to Watchlist</h3>

                        <div className="flex flex-col gap-3">
                            {watchlists.length === 0 && (
                                <p className="text-center text-gray-400">No watchlists found. Create one first.</p>
                            )}

                            {watchlists.map((w) => (
                                <button
                                    key={w.id}
                                    onClick={() => setSelectedWatchlist(w.id)}
                                    className={`w-full rounded-md px-4 py-2 text-left transition ${
                                        selectedWatchlist === w.id
                                            ? 'bg-yellow-500 text-black'
                                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    {w.name}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={!selectedWatchlist}
                            onClick={toggleWatchlist}
                            className={`mt-4 w-full rounded-md py-2 font-semibold transition ${
                                selectedWatchlist
                                    ? 'cursor-pointer bg-yellow-500 text-black hover:bg-yellow-600'
                                    : 'cursor-not-allowed bg-gray-700 text-gray-400'
                            }`}
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
