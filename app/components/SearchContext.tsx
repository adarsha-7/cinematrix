'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MovieCard from '@/app/components/MovieCard';
import TVShowCard from '@/app/components/TVShowCard';
import Pagination from '@/app/components/Pagination';

export default function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const queryParam = searchParams.get('query') || '';
    const pageParam = Number(searchParams.get('page')) || 1;

    const [query, setQuery] = useState(queryParam);
    const [page, setPage] = useState(pageParam);
    const [results, setResults] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setQuery(queryParam);
        setPage(pageParam);
        setLoading(true);

        const fetchResults = async () => {
            try {
                const res = await fetch(`/api/search?query=${encodeURIComponent(queryParam)}&page=${pageParam}`);
                const data = await res.json();

                setResults(data.data || []);
                setTotalPages(data.total ? Math.ceil(data.total / 50) : 1);
            } catch (err) {
                console.error('Error fetching search results:', err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [queryParam, pageParam]);

    const handlePageChange = (newPage: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('page', newPage.toString());
        router.push(url.toString());
    };

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
                    {results.length === 0 ? (
                        <p className="mt-12 text-center text-gray-400">No results found.</p>
                    ) : (
                        <>
                            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {results.map((item: any) =>
                                    item.type === 'movie' ? (
                                        <MovieCard key={item.id} movie={item} />
                                    ) : (
                                        <TVShowCard
                                            key={item.id}
                                            TVShow={{ ...item, name: item.title, firstAirDate: item.releaseDate }}
                                        />
                                    ),
                                )}
                            </div>

                            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
