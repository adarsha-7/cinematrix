'use client';

import { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';

// Mock rating data (scale 0-10)
const mockRatings = [
  {
    id: '1',
    movie: { title: 'Inception', id: 101 },
    tvShow: null,
    rating: 9,
    createdAt: new Date('2026-01-23T10:30:00'),
  },
  {
    id: '2',
    movie: null,
    tvShow: { title: 'Breaking Bad', id: 201 },
    rating: 8,
    createdAt: new Date('2026-01-22T15:45:00'),
  },
  {
    id: '3',
    movie: { title: 'Interstellar', id: 102 },
    tvShow: null,
    rating: 10,
    createdAt: new Date('2026-01-21T12:00:00'),
  },
];

export default function RatingsPage() {
  const [ratings, setRatings] = useState(mockRatings);

  // Sort ratings by newest first
  const sortedRatings = [...ratings].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return (
    <div className="pt-20 px-4 md:px-8 lg:px-16">
      <h1 className="mb-8 text-center text-3xl font-bold text-white md:text-4xl lg:text-[42px]">
        Your <span className="text-primary">Ratings</span>
      </h1>

      {sortedRatings.length === 0 ? (
        <p className="text-center text-gray-300">You haven’t rated any movies or TV shows yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedRatings.map((rating) => (
            <div
              key={rating.id}
              className="relative rounded-xl border border-gray-700 bg-[#111] p-4 transition hover:border-red-600"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold text-white">
                  {rating.movie ? rating.movie.title : rating.tvShow?.title}
                </h2>
                <div className="flex gap-2">
                  <button
                    className="hover:text-red-500"
                    title="Delete Rating"
                    onClick={() => console.log('Delete clicked', rating.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    className="hover:text-yellow-400"
                    title="Edit Rating"
                    onClick={() => console.log('Edit clicked', rating.id)}
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-400">
                Rated: <span className="text-primary">{rating.rating}/10</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {rating.createdAt.toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
