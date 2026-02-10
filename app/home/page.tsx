'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import Navbar from '../components/navbar';
import Link from 'next/link';

/* ---------- Types ---------- */
interface Movie {
    id: number;
    title: string;
    genre: string;
    rating: number;
    releaseDate: string;
    image: string;
}

interface Category {
    name: string;
    count: number;
}

/* ---------- Data ---------- */
const moviesData: {
    recommended: Movie[];
    categories: Category[];
} = {
    recommended: [
        {
            id: 1,
            title: 'Good Bad Ugly',
            genre: 'Adventure',
            rating: 8.5,
            releaseDate: '2025',
            image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
        },
        {
            id: 2,
            title: 'Dragon',
            genre: 'Drama/Romance',
            rating: 8.0,
            releaseDate: '2024',
            image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop',
        },
        {
            id: 3,
            title: 'NEEK',
            genre: 'Drama/Romance',
            rating: 8.0,
            releaseDate: '2023',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
        },
        {
            id: 4,
            title: 'Kadhalikka Neramillai',
            genre: 'Drama/Romance',
            rating: 8.0,
            releaseDate: '2022',
            image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
        },
        {
            id: 5,
            title: 'Good Bad Ugly',
            genre: 'Adventure',
            rating: 8.5,
            releaseDate: '2021',
            image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
        },
        {
            id: 6,
            title: 'Dragon',
            genre: 'Drama/Romance',
            rating: 8.0,
            releaseDate: '2020',
            image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop',
        },
        {
            id: 7,
            title: 'NEEK',
            genre: 'Drama/Romance',
            rating: 8.0,
            releaseDate: '2019',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
        },
        {
            id: 8,
            title: 'Kadhalikka Neramillai',
            genre: 'Drama/Romance',
            rating: 8.0,
            releaseDate: '2018',
            image: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop',
        },
    ],
    categories: [
        { name: 'Romance', count: 90 },
        { name: 'Action', count: 120 },
        { name: 'Drama', count: 150 },
        { name: 'Sci-Fi', count: 80 },
        { name: 'Comedy', count: 70 },
        { name: 'Horror', count: 60 },
    ],
};

/* ---------- Components ---------- */
const MovieCard = ({ movie }: { movie: Movie }) => (
    <Link href={`/movies/${movie.id}`}>
        <div className="cursor-pointer overflow-hidden rounded-xl bg-[#111] transition hover:scale-105">
            <img src={movie.image} alt={movie.title} className="h-72 w-full object-cover" />
            <div className="p-3">
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-xs text-gray-400">{movie.genre}</p>
                <div className="text-sm text-yellow-400">★ {movie.rating}</div>
            </div>
        </div>
    </Link>
);

const CategoryCard = ({ category }: { category: Category }) => (
    <div className="cursor-pointer rounded-xl border border-gray-700 bg-[#111] py-6 text-center transition hover:border-red-600">
        <h3 className="text-lg font-bold">{category.name}</h3>
        <p className="text-xs text-gray-400">{category.count} Movies</p>
    </div>
);

/* ---------- Page ---------- */
export default function Homepage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Hero */}
            <section className="px-4 py-20 text-center">
                <h1 className="text-4xl leading-tight font-bold md:text-5xl">
                    Experience <span className="text-red-600">Cinema</span> Like Never Before
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-400">
                    Join our community of film enthusiasts to discover, review, discuss, and celebrate the art of
                    cinema. From blockbuster hits to indie gems, explore stories that captivate and inspire.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <button className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 hover:bg-red-700">
                        <Play size={16} /> Movies
                    </button>
                    <button className="flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 hover:bg-red-700">
                        <Play size={16} /> TV Shows
                    </button>
                </div>
            </section>
            {/* Recommended Horizontal Scroll */}
            <section className="mx-auto max-w-7xl px-4 py-16">
                <h2 className="mb-2 text-center text-2xl font-bold">Recommended for you</h2>
                <p className="mb-8 text-center text-sm text-gray-400">Discover the Recommended Movies in Cinematrix</p>

                {/* Horizontal Poster Scroll */}
                <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-6">
                    {moviesData.recommended.map((movie) => (
                        <div key={movie.id} className="max-w-[220px] min-w-[220px] shrink-0 snap-start">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <button className="rounded border border-gray-600 px-6 py-2 transition hover:border-red-600 hover:text-red-500">
                        View All
                    </button>
                </div>
            </section>

            {/* Categories */}
            <section className="mx-auto max-w-7xl px-4 py-16">
                <h2 className="mb-2 text-center text-2xl font-bold">Movie Categories</h2>
                <p className="mb-8 text-center text-sm text-gray-400">
                    Explore our extensive collection of films organized by genre
                </p>

                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                    {moviesData.categories.map((category, index) => (
                        <CategoryCard key={index} category={category} />
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button className="rounded border border-gray-600 px-6 py-2 transition hover:border-red-600 hover:text-red-500">
                        View All
                    </button>
                </div>
            </section>

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
        </div>
    );
}
