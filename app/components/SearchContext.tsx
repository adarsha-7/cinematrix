'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieCard from '@/app/components/MovieCard';

const mockMovies = [
    {
        id: 27205,
        title: 'Inception',
        overview: 'Cobb, a skilled thief who commits corporate espionage...',
        tagline: 'Your mind is the scene of the crime.',
        releaseDate: '2010-07-15T00:00:00.000Z',
        runtime: 148,
        voteAverage: 8.364,
        voteCount: 34495,
        backdropPath: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
        posterPath: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
        director: 'Christopher Nolan',
        cast: [],
        genres: ['Science Fiction', 'Action', 'Adventure'],
        keywords: [],
        originalLanguages: ['English'],
        productionCompanies: [],
        productionCountries: [],
    },
    {
        id: 157336,
        title: 'Interstellar',
        overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole...',
        tagline: 'Mankind was born on Earth. It was never meant to die here.',
        releaseDate: '2014-11-05T00:00:00.000Z',
        runtime: 169,
        voteAverage: 8.417,
        voteCount: 32571,
        backdropPath: '/pbrkL804c8yAv3zBZR4QPEafpAR.jpg',
        posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        director: 'Christopher Nolan',
        cast: [],
        genres: ['Drama', 'Science Fiction', 'Adventure'],
        keywords: [],
        originalLanguages: ['English'],
        productionCompanies: [],
        productionCountries: [],
    },
    {
        id: 155,
        title: 'The Dark Knight',
        overview: 'Batman raises the stakes in his war on crime...',
        tagline: 'Welcome to a world without rules.',
        releaseDate: '2008-07-16T00:00:00.000Z',
        runtime: 152,
        voteAverage: 8.512,
        voteCount: 30619,
        backdropPath: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
        posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        director: 'Christopher Nolan',
        cast: [],
        genres: ['Drama', 'Crime', 'Action', 'Thriller'],
        keywords: [],
        originalLanguages: ['English'],
        productionCompanies: [],
        productionCountries: [],
    },
];

export default function SearchContent() {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('query') || '';

    const [query, setQuery] = useState(queryParam);
    const [movies, setMovies] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setQuery(queryParam);
        setLoading(true);

        const timer = setTimeout(() => {
            setMovies(mockMovies);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [queryParam]);

    return (
        <div className="mx-auto max-w-7xl py-16">
            {loading ? (
                <div>
                    <h1 className="text-center text-4xl font-bold">Searching for "{query}"</h1>
                    <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="h-80 w-48 animate-pulse rounded-2xl bg-zinc-800" />
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className="text-center text-4xl font-bold">Search Results for "{query}"</h1>
                    {movies.length === 0 ? (
                        <p className="mt-12 text-center text-gray-400">No movies found.</p>
                    ) : (
                        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {movies.map((movie: any) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
