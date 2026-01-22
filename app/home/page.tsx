'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type { MovieData } from '../types';
import { categories } from '../data';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Homepage() {
    const [showAll, setShowAll] = useState(false);
    const [movies, setMovies] = useState<MovieData[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [loadingMovies, setLoadingMovies] = useState(true);

    const { session } = useAuth();
    const [sessionS, setSessionS] = useState(session);

    useEffect(() => {
        const timer = setTimeout(() => {
            const message = sessionStorage.getItem('toast');
            if (message) {
                toast.success(message, { duration: 3000 });
                sessionStorage.removeItem('toast');
            }
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        async function getMovies() {
            try {
                setLoadingMovies(true);
                if (session || !session) {
                    const res = await fetch(`${BASE_URL}/api/movies?sort=popular&page=${page}`);
                    const { moviesData } = await res.json();
                    setMovies(moviesData);
                }
            } catch (err) {
                console.error('Error fetching movies', err);
            } finally {
                setLoadingMovies(false);
            }
        }
        getMovies();

        // send the interaction detail in the body of the api call
        async function saveInteraction() {
            try {
                const res = await fetch(`${BASE_URL}/api/interaction`, {
                    method: 'POST',
                    body: JSON.stringify({
                        movieId: 77,
                        type: 'RATED',
                        value: 7,
                    }),
                });
            } catch (err) {
                console.log(err);
            }
        }
        saveInteraction();
    }, [sessionS, page]);

    return (
        <div>
            <div className="fixed top-0 left-0 z-50 w-full">
                <Navbar />
            </div>

            <main className="pt-20">
                <section className="relative flex h-[50vh] items-center justify-center text-center">
                    <div className="bg-liner-to-b absolute inset-0 from-black/10 via-black/5 to-transparent"></div>
                    <img src="/hero.png" alt="Hero" className="relative max-h-[100%] w-auto opacity-70" />
                    <div className="absolute px-6">
                        <h1 className="text-3xl font-bold text-white md:text-4xl lg:text-[42px]">
                            Experience <span className="text-primary">Cinema</span> Like Never Before
                        </h1>
                        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-200">
                            Discover, review, and celebrate cinema from blockbusters to indie gems.
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <Link href="/movies">
                                <button className="bg-primary hover:bg-primary-hover flex cursor-pointer items-center gap-2 rounded-md px-5 py-2 text-sm md:text-base">
                                    <Play size={16} /> Movies
                                </button>
                            </Link>
                            <Link href="/tv-shows">
                                <button className="bg-primary hover:bg-primary-hover flex cursor-pointer items-center gap-2 rounded-md px-5 py-2 text-sm md:text-base">
                                    <Play size={16} /> TV Shows
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="mb-2 text-center text-2xl font-semibold">
                        {session ? 'Recommended for you' : 'Popular Movies'}
                    </h2>

                    <div
                        className={
                            showAll
                                ? 'scrollbar-hide grid grid-cols-2 gap-6 py-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                                : 'scrollbar-hide flex gap-6 overflow-x-auto py-3 pb-6'
                        }
                    >
                        {loadingMovies &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-75 w-55 animate-pulse rounded-2xl bg-zinc-800" />
                            ))}

                        {!loadingMovies &&
                            !showAll &&
                            movies?.slice(0, 20).map((movie) => (
                                <div key={movie.id} className={showAll ? '' : 'w-60 shrink-0'}>
                                    <MovieCard movie={movie} />
                                </div>
                            ))}

                        {!loadingMovies &&
                            showAll &&
                            movies?.map((movie) => (
                                <div key={movie.id} className={showAll ? '' : 'w-60 shrink-0'}>
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                    </div>

                    <div className="mt-10 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="hover:border-primary cursor-pointer rounded border border-gray-600 px-6 py-2 transition hover:text-red-500"
                        >
                            {showAll ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                </section>

                <section className="py-16">
                    <h2 className="mb-8 text-center text-2xl font-semibold">Browse By Categories</h2>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                        {categories.map((category, index) => (
                            <Link href={`/movies?category=${encodeURIComponent(category)}`} key={index}>
                                <div className="cursor-pointer rounded-xl border border-gray-700 bg-[#111] py-6 text-center transition hover:border-red-600">
                                    <h3 className="text-lg font-normal">{category}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
