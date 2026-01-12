import { Film, Search, Bookmark, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="border-b border-neutral-800 bg-black px-4 py-3">
            <div className="mx-auto flex max-w-full items-center justify-between gap-6">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="rounded bg-red-600 p-1.5">
                        <Film className="h-5 w-5 text-white" />
                    </div>
                    <span className="tracking-wide text-white">CineMatrix</span>
                </div>

                {/* Center Section - Search Bar and Watch List */}
                <div className="flex flex-1 items-center justify-center gap-6">
                    {/* Search Bar */}
                    <div className="w-full max-w-md">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search result"
                                className="w-full rounded-full bg-neutral-200 py-2.5 pr-4 pl-11 text-neutral-800 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-300 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Watch List */}
                    <Link href={`/watchlist`}>
                        <button className="flex items-center gap-2 whitespace-nowrap text-white transition-colors hover:text-neutral-300">
                            <Bookmark className="h-5 w-5" />
                            <span>Watchlist</span>
                        </button>
                    </Link>
                </div>

                {/* Right Section - User Profile */}
                <div className="flex items-center">
                    <button className="rounded-full bg-red-600 p-2.5 transition-colors hover:bg-red-700">
                        <User className="h-5 w-5 text-white" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
