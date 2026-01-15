export default function Footercomponent() {
    return (
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
    );
}
