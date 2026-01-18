'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { useAuth } from '@/context/AuthContext';
import type { MovieData } from '../types';

import { categories } from '../data';
const genres = categories;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Moviepage() {
    const [movies, setMovies] = useState<MovieData[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [activeGenres, setActiveGenres] = useState<string[]>([]);
    const [sort, setSort] = useState<string>('popular');

    const { session } = useAuth();
    const [sessionS, setSessionS] = useState(session);
    const router = useRouter();
    const pathname = usePathname();

    // Fetch movies
    useEffect(() => {
        async function getMovies() {
            try {
                setLoadingMovies(true);
                const params = new URLSearchParams({
                    sort,
                    page: String(page),
                });

                activeGenres.forEach((genre) => {
                    params.append('genres', genre);
                });

                const res = await fetch(`${BASE_URL}/api/movies?${params.toString()}`);
                console.log(params.toString());
                const { moviesData } = await res.json();
                setMovies(moviesData);
            } catch (err) {
                console.error('Error fetching movies', err);
            } finally {
                setLoadingMovies(false);
            }
        }

        getMovies();
    }, [sessionS, sort, page, activeGenres]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        if (category) {
            const selected = category.split(',').filter((c) => genres.includes(c));
            setActiveGenres(selected);
        }
    }, []);

    const handleGenreClick = (genre: string) => {
        let updatedGenres: string[];
        if (activeGenres.includes(genre)) {
            updatedGenres = activeGenres.filter((g) => g !== genre);
        } else {
            updatedGenres = [...activeGenres, genre];
        }
        setActiveGenres(updatedGenres);

        if (updatedGenres.length === 0) {
            router.replace(pathname);
        } else {
            router.replace(`${pathname}?category=${encodeURIComponent(updatedGenres.join(','))}`);
        }
    };

    return (
        <div>
            <div className="fixed top-0 left-0 z-50 w-full">
                <Navbar />
            </div>

            <main className="mx-auto flex max-w-7xl flex-col gap-10 py-16 pt-30">
                <div className="flex flex-col gap-5">
                    <h1 className="text-center text-4xl font-bold md:text-5xl">
                        Discover Your Favorite <span className="text-primary">Movies</span> Like Never Before
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-center text-gray-400">
                        Explore from our catalogue of movies across various genres. Whether you're into heartwarming
                        dramas, thrilling sci-fi, or laugh-out-loud comedies, we've got something for every movie
                        enthusiast.
                    </p>
                </div>

                <div className="mt-10 flex flex-wrap justify-center gap-3">
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            onClick={() => handleGenreClick(genre)}
                            className={`cursor-pointer rounded-xl border-2 px-5 py-2 text-sm transition ${
                                activeGenres.includes(genre)
                                    ? 'border-primary bg-primary text-white'
                                    : 'hover:border-primary border-gray-600 text-gray-300'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                {!loadingMovies && (
                    <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {movies?.map((movie) => (
                            <div key={movie.id}>
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                )}

                {loadingMovies && (
                    <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-75 w-55 animate-pulse rounded-2xl bg-zinc-800" />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
