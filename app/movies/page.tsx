'use client';

import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footercomponent from '../components/Footer';
import { Star } from 'lucide-react';
import moviesData from '../data/movies';
import type { Movie } from '../types';

const genres = ['All Movies', 'Drama', 'Romance', 'Sci-Fi', 'Horror', 'Comedy', 'Action'];

export default function Moviepage() {
    const [activeGenre, setActiveGenre] = useState('All Movies');
    const [showAll, setShowAll] = useState(false);

    // Correctly filter movies based on genre
    const filteredMovies: Movie[] =
        activeGenre === 'All Movies'
            ? moviesData.recommended
            : moviesData.recommended.filter((movie) => movie.genre === activeGenre);

    const displayedMovies = showAll ? filteredMovies : filteredMovies.slice(0, 12);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 z-50 w-full bg-black/80 backdrop-blur-md">
                <Navbar />
            </div>

            {/* Page Content */}
            <main className="pt-20">
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-center text-4xl font-bold md:text-5xl">
                            Discover Your Favorite <span className="text-red-600">Movie</span> Like Never Before
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-400">
                            Experience your favorite movies with fresh eyes and deeper meaning like never before.
                        </p>

                        {/* Genres */}
                        <div className="mt-10 flex flex-wrap justify-center gap-3">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => {
                                        setActiveGenre(genre);
                                        setShowAll(false);
                                    }}
                                    className={`rounded-xl border px-5 py-2 text-sm transition ${
                                        activeGenre === genre
                                            ? 'border-red-600 bg-red-600 text-white'
                                            : 'border-gray-600 text-gray-300 hover:border-white'
                                    }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>

                        {/* Movies Grid */}
                        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {displayedMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="overflow-hidden rounded-2xl bg-zinc-900 transition hover:scale-[1.03]"
                                >
                                    <img src={movie.image} alt={movie.title} className="h-64 w-full object-cover" />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold">{movie.title}</h3>
                                        <p className="text-sm text-gray-400">
                                            {movie.genre} • {movie.releaseDate}
                                        </p>
                                        <div className="mt-3 flex items-center gap-1 text-yellow-400">
                                            <Star size={16} className="fill-current" />
                                            <span className="text-sm font-medium">{movie.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* View All / Show Less Button */}
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
                    </div>
                </section>
            </main>

            <Footercomponent />
        </div>
    );
}
