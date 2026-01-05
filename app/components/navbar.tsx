import { Film, Search, Bookmark, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-neutral-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-white tracking-wide">CineMatrix</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search result"
              className="w-full bg-neutral-200 text-neutral-800 placeholder:text-neutral-400 rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Watch List */}
          <button className="flex items-center gap-2 text-white hover:text-neutral-300 transition-colors">
            <Bookmark className="w-5 h-5" />
            <span>Watch list</span>
          </button>

          {/* User Profile */}
          <button className="bg-red-600 hover:bg-red-700 transition-colors rounded-full p-2.5">
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </nav>
  );
}
