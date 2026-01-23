'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Star, X } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function RateSection({ id }: { id: string }) {
    const [userRating, setUserRating] = useState<number | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [hovered, setHovered] = useState<number | null>(null);
    const [selected, setSelected] = useState<number | null>(null);

    const { session } = useAuth();

    const getRating = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/user/rating?movieId=${encodeURIComponent(id)}`);
            const { rating } = await res.json();
            if (rating !== null && rating !== undefined) {
                setUserRating(rating);
            }
        } catch (err) {
            console.error('Error fetching ratings', err);
        }
    };

    const submitRating = async () => {
        if (selected == null) return;
        try {
            await Promise.all([
                fetch(`${BASE_URL}/api/user/rating?movieId=${encodeURIComponent(id)}&rating=${selected}`, {
                    method: 'POST',
                }),
                fetch(`${BASE_URL}/api/user/interaction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        movieId: Number(id),
                        type: 'RATED',
                        value: selected,
                    }),
                }),
            ]);
            setUserRating(selected);
        } catch (err) {
            console.error('Error updating rating or recording interaction', err);
        }
    };

    useEffect(() => {
        if (session) getRating();
    }, [session, id]);

    useEffect(() => {
        if (userRating) setSelected(userRating);
    }, [userRating]);

    return (
        <div>
            <h2 className="mb-3 text-2xl font-semibold">{userRating ? 'Your Rating' : 'Rate This Movie'}</h2>

            {session ? (
                <button
                    onClick={() => setOpen(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-gray-800 px-4 py-2 hover:bg-gray-700"
                >
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    {userRating ? `${userRating} / 10` : 'Rate'}
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

                        <h3 className="mb-4 text-center text-lg font-semibold">Rate this movie</h3>

                        <div className="mb-6 flex justify-center gap-1">
                            {Array.from({ length: 10 }).map((_, i) => {
                                const value = i + 1;
                                const filled =
                                    hovered !== null ? value <= hovered : selected !== null ? value <= selected : false;

                                return (
                                    <Star
                                        key={i}
                                        className={`h-7 w-7 cursor-pointer transition ${
                                            filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                                        }`}
                                        onMouseEnter={() => setHovered(value)}
                                        onMouseLeave={() => setHovered(null)}
                                        onClick={() => setSelected(value)}
                                    />
                                );
                            })}
                        </div>

                        <button
                            disabled={!selected}
                            onClick={() => {
                                setOpen(false);
                                setHovered(null);
                                submitRating();
                            }}
                            className={`w-full rounded-md py-2 font-semibold transition ${
                                selected
                                    ? 'cursor-pointer bg-yellow-500 text-black hover:bg-yellow-600'
                                    : 'cursor-not-allowed bg-gray-700 text-gray-400'
                            }`}
                        >
                            Rate
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
