import Link from 'next/link';
import { Star } from 'lucide-react';
import type { TVShowData } from '../types/index';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w1280';

export default function TvShowCard({ tvShow }: { tvShow: TVShowData }) {
    const poster = tvShow.posterPath ? IMAGE_BASE + tvShow.posterPath : '/placeholder.png';
    const year = tvShow.firstAirDate ? new Date(tvShow.firstAirDate).getFullYear() : 'N/A';
    const genres = tvShow.genres?.join(', ') || 'Unknown';

    return (
        <div className="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-zinc-900 transition-transform duration-200 hover:scale-105">
            <Link href={`/tvShow/${tvShow.id}`} className="flex h-full flex-col">
                <div className="h-[330px] w-full shrink-0">
                    <img src={poster} alt={tvShow.name ?? 'TvShow Poster'} className="h-full w-full object-cover" />
                </div>

                <div className="flex h-[120px] flex-col justify-between p-3">
                    <div className="flex h-[60%] flex-col">
                        <h3 className="overflow-hidden font-semibold text-ellipsis whitespace-nowrap">
                            {tvShow.name ?? 'Untitled'}
                        </h3>
                        <p className="line-cramp-2 text-xs text-gray-400">{genres}</p>
                    </div>
                    <div className="flex h-[40%] flex-col">
                        <p className="text-xs text-gray-400">• {year}</p>
                        <div className="mt-1 flex items-center gap-1 text-yellow-400">
                            <Star size={16} className="fill-current" />
                            <span className="text-sm font-medium">{tvShow.voteAverage ?? '-'}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
