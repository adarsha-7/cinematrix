'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { movies } from '@/app/data/movies';
import Navbar from '@/app/components/navbar';

export default function MoviePage() {
    const params = useParams(); // 👈 FIX
    const id = Number(params.id);

    const movie = movies.find((m) => m.id === id);

    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState<{ rating: number; text: string }[]>([]);
    const [isAdded, setIsAdded] = useState(() => {
        if (typeof window != 'undefined') {
            const storedData = localStorage.getItem('watchlist');
            const savedWatchList = JSON.parse(storedData || '[]');
            return savedWatchList.includes(id);
        }
        return false;
    });

    if (!movie) {
        return <div className="flex min-h-screen items-center justify-center bg-black text-white">Movie not found</div>;
    }

    const submitReview = () => {
        if (!rating || !review) return;
        setReviews([...reviews, { rating, text: review }]);
        setRating(0);
        setReview('');
    };

    const handleToggle = () => {
        // 1. Get the current list from storage
        const savedWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        let updatedWatchlist;

        if (isAdded) {
            updatedWatchlist = savedWatchlist.filter((movieId: number) => movieId !== id);
        } else {
            updatedWatchlist = [...savedWatchlist, id];
        }

        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));

        setIsAdded(!isAdded);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="px-10 py-12">
                <div className="flex gap-10">
                    <img src={movie.image} alt={movie.title} className="w-72 rounded-xl" />

                    <div>
                        <h1 className="text-4xl font-bold">{movie.title}</h1>
                        <p className="mt-2 text-gray-400">
                            {movie.genre} • {movie.releaseDate}
                        </p>
                        <button
                            className={`flex items-center gap-2 rounded-md px-6 py-2.5 font-medium transition-all duration-200 ${
                                isAdded
                                    ? 'border border-zinc-600 bg-zinc-800 text-white'
                                    : 'bg-[#E11D48] text-white hover:bg-[#BE123C]'
                            }`}
                            onClick={handleToggle}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                            {isAdded ? 'Added to Watchlist' : 'Add to Watchlist'}
                        </button>

                        <p className="mt-4 max-w-xl text-gray-300">{movie.description}</p>
                    </div>
                </div>

                {/* Rating */}
                <div className="mt-10">
                    <h2 className="mb-3 text-2xl font-semibold">Rate this movie</h2>

                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                        >
                            ★
                        </button>
                    ))}
                    <p>({rating})</p>

                    <textarea
                        className="mt-4 block w-full max-w-xl rounded bg-zinc-900 p-4"
                        placeholder="Write your review..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                    />

                    <button onClick={submitReview} className="mt-4 rounded bg-red-600 px-6 py-2 hover:bg-red-700">
                        Submit Review
                    </button>
                </div>

                {/* Reviews */}
                <div className="mt-10">
                    <h2 className="mb-4 text-xl font-semibold">User Reviews</h2>

                    {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}

                    {reviews.map((r, i) => (
                        <div key={i} className="mb-4 rounded bg-zinc-900 p-4">
                            <div className="text-yellow-400">{'★'.repeat(r.rating)}</div>
                            <p className="text-gray-300">{r.text}</p>
                        </div>
                    ))}
                </div>
            </div>

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
