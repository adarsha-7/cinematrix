import type { Movie } from '../types/index';
import { Star } from 'lucide-react';

export default function MovieCard({ movie }: { movie: Movie }) {
    return (
        <div className="overflow-hidden rounded-xl bg-[#111] transition hover:scale-105">
            <img src={movie.image} alt={movie.title} className="h-72 w-full object-cover" />
            <div className="p-3">
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-xs text-gray-400">
                    {movie.genre} • {movie.releaseDate}
                </p>
                <div className="mt-2 flex items-center gap-1 text-yellow-400">
                    <Star size={16} className="fill-current" />
                    <span className="text-sm font-medium">{movie.rating}</span>
                </div>
            </div>
        </div>
    );
}
