import Navbar from '@/app/components/Navbar';
import { Star, Plus } from 'lucide-react';
import Link from 'next/link';
import type { TVShowData } from '@/app/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w1280';

export default async function TVShowDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const res = await fetch(`${BASE_URL}/api/tvShow/${id}`);
    if (!res.ok) throw new Error('Failed to fetch TV show');

    const { tvShowData }: { tvShowData: TVShowData } = await res.json();
    if (!tvShowData) throw new Error('TV show not found');

    // Normalize nullable arrays
    const createdBy = tvShowData.createdBy ?? [];
    const cast = tvShowData.cast ?? [];
    const originalLanguages = tvShowData.originalLanguages ?? [];
    const productionCompanies = tvShowData.productionCompanies ?? [];
    const productionCountries = tvShowData.productionCountries ?? [];
    const genres = tvShowData.genres ?? [];

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
                        tvShowData.backdropPath
                            ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,1)), url('${IMAGE_BASE}${tvShowData.backdropPath}')` }
                            : undefined
                    }
                >
                    <div className="absolute top-[50%] left-[1%]">
                        <div className="px-6">
                            <h1 className="text-4xl font-bold md:text-5xl">{tvShowData.name}</h1>
                            {tvShowData.tagline && <p className="mt-2 text-sm text-gray-300 italic">{tvShowData.tagline}</p>}

                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-300">
                                {tvShowData.voteAverage && (
                                    <span className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {tvShowData.voteAverage.toFixed(1)}
                                    </span>
                                )}
                                {tvShowData.firstAirDate && <span>{new Date(tvShowData.firstAirDate).getFullYear()}</span>}
                                {genres.map((g, i) => (
                                    <Link key={i} href={`/tv-shows?genre=${g}`}>
                                        <span className="rounded bg-gray-800 px-2 py-1">{g}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button className="flex items-center gap-2 rounded-md bg-gray-700 px-6 py-2 hover:bg-gray-600">
                                    <Plus size={18} /> Add to Watchlist
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Details Section */}
                <section className="mx-auto flex flex-col gap-10 px-1 py-10">
                    {/* Overview */}
                    {tvShowData.overview && (
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">Overview</h2>
                            <p className="text-base leading-relaxed text-gray-300">{tvShowData.overview}</p>
                            {createdBy.length > 0 && (
                                <p className="mt-4 text-sm text-gray-400">
                                    Created by <span className="text-white">{createdBy.join(', ')}</span>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Rate This TV Show */}
                    <div>
                        <h2 className="mb-3 text-2xl font-semibold">Rate This TV Show</h2>
                        <div className="flex gap-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <button key={i} className="hover:scale-110 transition">
                                    <Star className="h-6 w-6 text-gray-600 hover:fill-yellow-400 hover:text-yellow-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cast */}
                    {cast.length > 0 && (
                        <div>
                            <h2 className="mb-6 text-2xl font-semibold">Cast</h2>
                            <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4">
                                {cast.map((actor) => (
                                    <div key={actor.castOrder} className="min-w-[140px] text-center">
                                        <img
                                            src={actor.profilePath ? `${IMAGE_BASE}${actor.profilePath}` : '/placeholder-person.png'}
                                            className="mx-auto mb-2 h-40 w-32 rounded-md object-cover"
                                        />
                                        <p className="text-sm font-medium">{actor.actor}</p>
                                        {actor.character && <p className="text-xs text-gray-400">{actor.character}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Original Languages */}
                    {originalLanguages.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">Original Languages</h2>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {originalLanguages.map((lang, i) => (
                                    <span key={i} className="rounded bg-gray-800 px-2 py-1">{lang}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Production Companies */}
                    {productionCompanies.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">Production Companies</h2>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {productionCompanies.map((company, i) => (
                                    <span key={i} className="rounded bg-gray-800 px-2 py-1">{company}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Production Countries */}
                    {productionCountries.length > 0 && (
                        <div>
                            <h2 className="mb-3 text-2xl font-semibold">Production Countries</h2>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {productionCountries.map((country, i) => (
                                    <span key={i} className="rounded bg-gray-800 px-2 py-1">{country}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
