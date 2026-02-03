'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import type { Rating } from '@/app/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function RatingsPage() {
    const { session } = useAuth();

    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loadingRatings, setLoadingRatings] = useState(true);

    useEffect(() => {
        if (!session) return;

        async function getRatings() {
            try {
                setLoadingRatings(true);

                const res = await fetch(`${BASE_URL}/api/user/ratings`, {
                    method: 'GET',
                });

                if (!res.ok) throw new Error('Failed to fetch ratings');

                const data: Rating[] = await res.json();
                setRatings(data);
            } catch (err) {
                console.error('Error fetching ratings:', err);
            } finally {
                setLoadingRatings(false);
            }
        }

        getRatings();
    }, [session]);

    const sortedRatings = useMemo(() => {
        return [...ratings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [ratings]);

    return (
        <div className="px-4 pt-20 md:px-8 lg:px-16">
            <h1 className="mb-16 text-center text-3xl font-bold text-white md:text-4xl lg:text-[42px]">
                Your <span className="text-primary">Ratings</span>
            </h1>

            {loadingRatings ? (
                <p className="text-center text-gray-400">Loading ratings...</p>
            ) : sortedRatings.length === 0 ? (
                <p className="text-center text-gray-300">You haven’t rated any movies or TV shows yet.</p>
            ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {sortedRatings.map((rating) => {
                        const media = rating.movie ?? rating.tvShow;
                        const href = rating.movie ? `/movie/${rating.movie.id}` : `/tv/${rating.tvShow!.id}`;

                        return (
                            <Link
                                href={href}
                                key={rating.id}
                                className="relative rounded-xl border border-gray-700 bg-[#111] p-4 transition hover:border-red-600"
                            >
                                <div className="flex items-start justify-between">
                                    <h2 className="text-lg font-semibold text-white">{media?.title}</h2>
                                </div>

                                <p className="mt-2 text-sm text-gray-400">
                                    Rated: <span className="text-foreground font-bold">{rating.rating}/10</span>
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {new Date(rating.createdAt).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
