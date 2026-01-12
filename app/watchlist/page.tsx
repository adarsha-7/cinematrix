'use client';
import Link from 'next/link';
import Navbar from '../components/navbar';
import { useEffect, useState } from 'react';
import { movies } from '../data/movies';

interface Movie {
    id: number;
    title: string;
    genre: string;
    rating: number;
    releaseDate: string;
    image: string;
}

export default function WatchListPage() {
    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedIds: number[] = JSON.parse(localStorage.getItem('watchlist') || '[]');

        const filteredMovies = movies.filter((movie) => storedIds.includes(movie.id));

        setWatchlist(filteredMovies);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center bg-black text-white">Loading...</div>;
    }
    return (
        <>
            <Navbar />

            <main className="px-10 py-12">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">My Watchlist</h1>
                        <p className="mt-2 text-gray-400">Movies you've saved to watch later.</p>
                    </div>
                    <span className="rounded-full border border-zinc-700 bg-zinc-800 px-4 py-1 text-sm">
                        {watchlist.length} {watchlist.length === 1 ? 'Movie' : 'Movies'}
                    </span>
                </header>

                {watchlist.length === 0 ? (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-800 py-20">
                        <p className="text-lg text-gray-500">Your watchlist is empty.</p>
                        <Link href="/home" className="mt-4 text-[#E11D48] hover:underline">
                            Browse movies to add them
                        </Link>
                    </div>
                ) : (
                    /* Movie Grid */
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {watchlist.map((movie) => (
                            <Link
                                key={movie.id}
                                href={`/movies/${movie.id}`}
                                className="group transition-transform hover:scale-105"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-zinc-800">
                                    <img src={movie.image} alt={movie.title} className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                                <h3 className="mt-3 line-clamp-1 text-lg font-semibold">{movie.title}</h3>
                                <p className="text-sm text-gray-400">
                                    {movie.genre} • {movie.releaseDate}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="mt-20 border-t border-gray-800 px-4 py-10">
                <div className="mx-auto grid max-w-7xl gap-8 text-sm md:grid-cols-3">
                    <div>
                        <h3 className="mb-2 font-bold">CineMatrix</h3>
                        <p className="text-gray-400">Your premier destination for cinema lovers.</p>
                    </div>

                    <div>
                        <h4 className="mb-2 font-semibold">Quick Links</h4>
                        <ul className="space-y-1 text-gray-400">
                            <li>Home</li>
                            <li>Movies</li>
                            <li>TV Shows</li>
                            <li>Submit Review</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-2 font-semibold">Categories</h4>
                        <ul className="space-y-1 text-gray-400">
                            <li>Action</li>
                            <li>Romance</li>
                            <li>Drama</li>
                            <li>Sci-Fi</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}
