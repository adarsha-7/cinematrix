'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { moviesData } from '../data/movie';
import type { Movie } from '../types';

const genres = ['All Movies', 'Drama', 'Romance', 'Sci-Fi', 'Horror', 'Comedy', 'Action'];

export default function Moviepage() {
    const [activeGenre, setActiveGenre] = useState('All Movies');
    const [showAll, setShowAll] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const category = searchParams.get('category');

        if (category && genres.includes(category)) {
            setActiveGenre(category);
        } else {
            setActiveGenre('All Movies');
        }
    }, [searchParams]);

    const filteredMovies: Movie[] =
        activeGenre === 'All Movies'
            ? moviesData.recommended
            : moviesData.recommended.filter((movie) => movie.genre === activeGenre);

    const displayedMovies = showAll ? filteredMovies : filteredMovies.slice(0, 12);

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
                            onClick={() => {
                                setShowAll(false);

                                if (genre === 'All Movies') {
                                    router.replace(pathname);
                                } else {
                                    router.replace(`${pathname}?category=${encodeURIComponent(genre)}`);
                                }
                            }}
                            className={`cursor-pointer rounded-xl border-2 px-5 py-2 text-sm transition ${
                                activeGenre === genre
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-gray-600 text-gray-300 hover:border-white'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {displayedMovies.map((movie) => (
                        <div key={movie.id}>
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                {filteredMovies.length > 12 && (
                    <div className="mt-14 flex justify-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="rounded-full border border-gray-500 px-6 py-2 transition hover:bg-white hover:text-black"
                        >
                            {showAll ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
