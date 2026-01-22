'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import Select from '../components/Select';
import { useAuth } from '@/context/AuthContext';
import type { MovieData } from '../types';

import { categories } from '../data';
import { Heading1 } from 'lucide-react';
const genres = categories;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Moviepage() {
    const [movies, setMovies] = useState<MovieData[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [activeGenres, setActiveGenres] = useState<string[]>([]);
    const [sort, setSort] = useState<string>('popular');
    const [hideWatched, setHideWatched] = useState<boolean>(false);

    const { session } = useAuth();
    const [sessionS, setSessionS] = useState(session);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        async function getMovies() {
            try {
                setLoadingMovies(true);
                const params = new URLSearchParams({
                    sort,
                    hideWatched: String(hideWatched),
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
    }, [sessionS, sort, page, hideWatched, activeGenres]);

    useEffect(() => {
        async function getTotalMovies() {
            try {
                if (sort == 'recommended') {
                    setTotalPages(Math.ceil(2000 / 50));
                } else {
                    const params = new URLSearchParams();

                    activeGenres.forEach((genre) => {
                        params.append('genres', genre);
                    });

                    const res = await fetch(`${BASE_URL}/api/movies/count?${params.toString()}`);
                    const { total } = await res.json();

                    setTotalPages(Math.ceil(total / 50));
                    setPage(1);
                }
            } catch (err) {
                console.error('Error fetching movie count', err);
            }
        }

        getTotalMovies();
    }, [activeGenres]);

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

            <main className="mx-auto flex max-w-7xl flex-col py-16 pt-30">
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
                                    : 'hover:border-primary border-gray-700 text-gray-300'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                <div className="flex h-15 items-center justify-start gap-5">
                    <Select
                        options={['recommended', 'popular', 'newest', 'oldest']}
                        selectedOption={sort}
                        setSelectedOption={setSort}
                    ></Select>
                    {movies?.length != 0 && sort == 'recommended' && (
                        <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm">
                            <span className="relative flex h-5 w-5 items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={hideWatched}
                                    onChange={(e) => setHideWatched(e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="peer-checked:border-primary peer-checked:bg-primary h-5 w-5 rounded-3xl border-2 border-gray-700 transition" />
                                <svg
                                    className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition peer-checked:opacity-100"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </span>
                            <span className="select-none">Hide Watched Movies</span>
                        </label>
                    )}
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

                {!loadingMovies && movies?.length == 0 && session && sort == 'recommended' && (
                    <p className="mt-10 mb-30 text-center text-lg">Browse or Rate Movies for Recommendations</p>
                )}

                {!loadingMovies && movies?.length == 0 && !session && sort == 'recommended' && (
                    <p className="mt-10 mb-30 text-center text-lg">Login for Recommendations</p>
                )}

                {!loadingMovies && totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => {
                            setPage(newPage);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                )}
            </main>
        </div>
    );
}
