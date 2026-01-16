import type { Movie } from '../types/index';
import { Star } from 'lucide-react';

export default function MovieCard({ movie }: { movie: Movie }) {
    return (
        <div className="cursor-pointer overflow-hidden rounded-2xl bg-zinc-900 transition hover:scale-[1.05]">
            <img src={movie.image} alt={movie.title} className="aspect-2/3 object-cover" />
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
