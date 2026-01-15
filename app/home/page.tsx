'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

import Navbar from '../components/Navbar';
import Footercomponent from '../components/Footer';
import MovieCard from '../components/MovieCard';
import CategoryCard from '../components/CategoryCard';

import moviesData from '../data/movies';

export default function Homepage() {
    const [showAll, setShowAll] = useState(false);

    return (
        <div className="min-h-screen text-white">
            <div className="fixed top-0 left-0 z-50 w-full bg-black/80 backdrop-blur-md">
                <Navbar />
            </div>

            <main className="pt-20">
                <section className="py-20 text-center">
                    <h1 className="text-4xl font-bold md:text-5xl">
                        Experience <span className="text-red-600">Cinema</span> Like Never Before
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-400">
                        Discover, review, and celebrate cinema from blockbusters to indie gems.
                    </p>

                    <div className="mt-8 flex justify-center gap-4">
                        <Link href="/movies">
                            <button className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 hover:cursor-pointer hover:bg-red-700">
                                <Play size={16} /> Movies
                            </button>
                        </Link>

                        <Link href="/tv-shows">
                            <button className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 hover:cursor-pointer hover:bg-red-700">
                                <Play size={16} /> TV Shows
                            </button>
                        </Link>
                    </div>
                </section>

                <section className="py-16">
                    <h2 className="mb-2 text-center text-2xl font-bold">Recommended for you</h2>

                    <div
                        className={
                            showAll
                                ? 'scrollbar-hide grid grid-cols-2 gap-6 py-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                                : 'scrollbar-hide flex gap-6 overflow-x-auto py-2 pb-6'
                        }
                    >
                        {moviesData.recommended.map((movie) => (
                            <div
                                key={movie.id}
                                className={showAll ? '' : 'max-w-[220px] min-w-[220px] shrink-0 hover:cursor-pointer'}
                            >
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="rounded border border-gray-600 px-6 py-2 transition hover:cursor-pointer hover:border-red-600 hover:text-red-500"
                        >
                            {showAll ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                </section>

                <section className="py-16">
                    <h2 className="mb-8 text-center text-2xl font-bold">Movie Categories</h2>

                    <div className="grid grid-cols-2 gap-6 hover:cursor-pointer md:grid-cols-3">
                        {moviesData.categories.map((category, index) => (
                            <CategoryCard key={index} category={category} />
                        ))}
                    </div>
                </section>
            </main>

            <Footercomponent />
        </div>
    );
}
