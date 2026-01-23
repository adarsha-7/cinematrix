// app/tvshow/[id]/loading.tsx
export default function TvShowLoading() {
    return (
        <div className="animate-pulse p-6">
            <div className="mb-6 h-64 w-full rounded-2xl bg-gray-800"></div>
            <div className="mb-2 h-6 w-1/3 bg-gray-700"></div>
            <div className="mb-2 h-4 w-2/3 bg-gray-700"></div>
            <div className="mt-4 flex gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-6 w-6 rounded-full bg-gray-700"></div>
                ))}
            </div>
        </div>
    );
}
