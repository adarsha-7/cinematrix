import Link from 'next/link';
import { Star } from 'lucide-react';
import type { TVShowData } from '../types/index';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w1280';

export default function TVShowCard({ TVShow }: { TVShow: TVShowData }) {
    const poster = TVShow.posterPath ? IMAGE_BASE + TVShow.posterPath : '/placeholder.png';
    const year = TVShow.firstAirDate ? new Date(TVShow.firstAirDate).getFullYear() : 'N/A';
    const genres = TVShow.genres?.join(', ') || 'Unknown';

    return (
        <div className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-zinc-900 transition-transform duration-200 hover:scale-105">
            <Link href={`/tv-show/${TVShow.id}`} className="flex h-full flex-col">
                <div className="h-82.5 w-full shrink-0">
                    <img src={poster} alt={TVShow.name ?? 'TVShow Poster'} className="h-full w-full object-cover" />
                </div>

                <div className="flex h-30 flex-col justify-between p-3">
                    <div className="flex h-[60%] flex-col">
                        <h3 className="overflow-hidden font-semibold text-ellipsis whitespace-nowrap">
                            {TVShow.name ?? 'Untitled'}
                        </h3>
                        <p className="line-cramp-2 text-xs text-gray-400">{genres}</p>
                    </div>
                    <div className="flex h-[40%] flex-col">
                        <p className="text-xs text-gray-400">• {year}</p>
                        <div className="mt-1 flex items-center gap-1 text-yellow-400">
                            <Star size={16} className="fill-current" />
                            <span className="text-sm font-medium">{TVShow.voteAverage?.toFixed(1) ?? '-'}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
