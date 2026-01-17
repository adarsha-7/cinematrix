import Navbar from '@/app/components/Navbar';
import { Star, Plus } from 'lucide-react';
import Link from 'next/link';
import type { MovieData } from '@/app/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w1280';

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const res = await fetch(`${BASE_URL}/api/movie/${id}`);

    if (!res.ok) {
        throw new Error('Failed to fetch movie');
    }

    const { movieData }: { movieData: MovieData } = await res.json();

    if (!movieData) {
        throw new Error('Movie not found');
    }

    return (
        <div>
            <div className="fixed top-0 left-0 z-50 w-full">
                <Navbar />
            </div>

            <main className="pt-20">
                {/* Hero Section */}
                <section
                    className="relative h-[65vh] rounded-2xl border border-neutral-900 bg-cover bg-center"
                    style={
                        movieData.backdropPath
                            ? {
                                  backgroundImage: `linear-gradient(
                                    to bottom,
                                    rgba(0,0,0,0.4),
                                    rgba(0,0,0,1)
                                  ), url('${IMAGE_BASE}${movieData.backdropPath}')`,
                              }
                            : undefined
                    }
                >
                    <div className="absolute top-[50%] left-[1%] flex items-center">
                        <div className="mx-auto w-full px-6">
                            <h1 className="text-4xl font-bold md:text-5xl">{movieData.title}</h1>

                            {movieData.tagline && (
                                <p className="mt-2 text-sm text-gray-300 italic">{movieData.tagline}</p>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                                {movieData.voteAverage && (
                                    <span className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {movieData.voteAverage.toFixed(1)}
                                    </span>
                                )}
                                {movieData.releaseDate && <span>{new Date(movieData.releaseDate).getFullYear()}</span>}
                                {movieData.runtime && <span>{movieData.runtime} min</span>}
                                {movieData.genres &&
                                    movieData.genres.map((g, index) => (
                                        <Link key={index} href={`/movies?category=${g}`}>
                                            <span className="rounded bg-gray-800 px-2 py-1">{g}</span>
                                        </Link>
                                    ))}
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button className="flex items-center gap-2 rounded-md bg-gray-700 px-6 py-2 transition hover:bg-gray-600">
                                    <Plus size={18} /> Add to Watchlist
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Details Section */}
                <section className="mx-auto flex flex-col gap-10 px-1 py-10">
                    {/* Synopsis */}
                    {movieData.overview && (
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">Synopsis</h2>
                            <p className="text-base leading-relaxed text-gray-300">{movieData.overview}</p>
                            {movieData.director && (
                                <p className="mt-4 text-sm text-gray-400">
                                    Directed by <span className="text-white">{movieData.director}</span>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Rate This Movie */}
                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">Rate This Movie</h2>
                        <div className="flex gap-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <button
                                    key={i}
                                    className="transition hover:scale-110"
                                    aria-label={`Rate ${i + 1} stars`}
                                >
                                    <Star className="h-6 w-6 text-gray-600 hover:fill-yellow-400 hover:text-yellow-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cast */}
                    {movieData.cast && (
                        <div>
                            <h2 className="mb-6 text-2xl font-semibold">Cast</h2>
                            <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4">
                                {movieData.cast.map((actor) => (
                                    <div key={actor.castOrder} className="min-w-[140px] text-center">
                                        <img
                                            src={
                                                actor.profilePath
                                                    ? `${IMAGE_BASE}${actor.profilePath}`
                                                    : '/https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133351928-stock-illustration-default-placeholder-man-and-woman.jpg'
                                            }
                                            alt={actor.actor || 'Profile Image'}
                                            className="mx-auto mb-2 h-40 w-32 rounded-md object-cover"
                                        />
                                        <p className="text-sm font-medium">{actor.actor}</p>
                                        {actor.character && <p className="text-xs text-gray-400">{actor.character}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Keywords */}
                    {movieData.keywords && movieData.keywords.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">Keywords</h2>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {movieData.keywords.map((k, i) => (
                                    <span key={i} className="rounded bg-gray-800 px-2 py-1">
                                        {k}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {movieData.originalLanguages && movieData.originalLanguages.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">Original Language(s)</h2>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {movieData.originalLanguages.map((lang, i) => (
                                    <span key={i} className="rounded bg-gray-800 px-2 py-1">
                                        {lang}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Production Companies */}
                    {movieData.productionCompanies && movieData.productionCompanies.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">Production Companies</h2>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {movieData.productionCompanies.map((company, i) => (
                                    <span key={i} className="rounded bg-gray-800 px-2 py-1">
                                        {company}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Production Countries */}
                    {movieData.productionCountries && movieData.productionCountries.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">Production Countries</h2>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {movieData.productionCountries.map((country, i) => (
                                    <span key={i} className="rounded bg-gray-800 px-2 py-1">
                                        {country}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
