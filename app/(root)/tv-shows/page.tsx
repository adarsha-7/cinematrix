'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import TVShowCard from '@/app/components/TVShowCard';
import Pagination from '@/app/components/Pagination';
import Select from '@/app/components/Select';
import { useAuth } from '@/context/AuthContext';
import type { TVShowData } from '@/app/types';

import { TVcategories } from '@/app/data';
const genres = TVcategories;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function TVShowpage() {
    const [TVShows, setTVShows] = useState<TVShowData[] | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loadingTVShows, setLoadingTVShows] = useState(true);
    const [activeGenres, setActiveGenres] = useState<string[]>([]);
    const [sort, setSort] = useState<string>('popular');

    const { session } = useAuth();
    const [sessionS, setSessionS] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setSessionS(session);
    }, [session]);

    useEffect(() => {
        async function getTVShows() {
            try {
                setLoadingTVShows(true);
                const params = new URLSearchParams({
                    sort,
                    page: String(page),
                });

                activeGenres.forEach((genre) => {
                    params.append('genres', genre);
                });

                const res = await fetch(`${BASE_URL}/api/tv-shows?${params.toString()}`);
                console.log(params.toString());
                const { TVShowsData } = await res.json();
                setTVShows(TVShowsData);
            } catch (err) {
                console.error('Error fetching TV shows', err);
            } finally {
                setLoadingTVShows(false);
            }
        }

        getTVShows();
    }, [sort, page, activeGenres]);

    useEffect(() => {
        async function getTotalTVShows() {
            try {
                const params = new URLSearchParams();

                activeGenres.forEach((genre) => {
                    params.append('genres', genre);
                });

                const res = await fetch(`${BASE_URL}/api/tv-shows/count?${params.toString()}`);
                const { total } = await res.json();

                setTotalPages(Math.ceil(total / 50));
                setPage(1);
            } catch (err) {
                console.error('Error fetching movie count', err);
            }
        }

        getTotalTVShows();
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
            <main className="mx-auto flex max-w-7xl flex-col py-16 pt-10">
                <div className="flex flex-col gap-3">
                    <h1 className="text-center text-4xl font-bold lg:text-[42px]">
                        Discover Your Favorite <span className="text-primary">TVShows</span> Like Never Before
                    </h1>
                    <p className="mx-auto mt-4 max-w-3xl text-center text-gray-400">
                        Explore from our catalogue of tv-shows across various genres. Whether you're into heartwarming
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

                <Select
                    options={['popular', 'newest', 'oldest']}
                    selectedOption={sort}
                    setSelectedOption={setSort}
                ></Select>

                {!loadingTVShows && (
                    <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {TVShows?.map((TVShow) => (
                            <div key={TVShow.id}>
                                <TVShowCard TVShow={TVShow} />
                            </div>
                        ))}
                    </div>
                )}

                {loadingTVShows && (
                    <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-75 w-55 animate-pulse rounded-2xl bg-zinc-800" />
                        ))}
                    </div>
                )}

                {!loadingTVShows && totalPages > 1 && (
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
