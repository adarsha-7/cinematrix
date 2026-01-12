import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, Clapperboard } from 'lucide-react';

export default function Aboutpage() {
    return (
        <div className="min-h-screen bg-black font-medium text-white">
            {/* Navbar */}
            <div className="fixed top-0 left-0 z-50 w-full bg-black">
                <Navbar />
            </div>

            {/* Main Content */}
            <div className="mx-auto mt-5 max-w-6xl space-y-10 px-6 py-16">
                {/* Top Contact Cards */}
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Email Card */}
                    <div className="rounded-2xl border border-gray-400/40 bg-gray-900 p-8 text-center">
                        <Mail className="mx-auto mb-4 text-red-600" size={28} />
                        <p>cinematrix.co.in</p>
                        <p>cinematrix@gmail.com</p>
                    </div>

                    {/* Phone Card */}
                    <div className="rounded-2xl border border-gray-400/40 bg-gray-900 p-8 text-center">
                        <Phone className="mx-auto mb-4 text-red-600" size={28} />
                        <p>+977 9876543210</p>
                        <p>+977 9876543219</p>
                    </div>
                </div>

                {/* About Section */}
                <div className="rounded-2xl border border-gray-400/40 bg-gray-900 p-8">
                    <h2 className="mb-6 text-3xl font-bold text-white">About Cinematrix</h2>

                    <div className="space-y-6 leading-relaxed text-gray-200">
                        {[
                            "At Cinematrix, we believe cinema is more than just entertainment—it's an emotion, a legacy, and a powerful storytelling medium that shapes how we see the world.",
                            'Fueled by a genuine passion for films, ReelTalks is your go-to hub for discovering compelling stories, in-depth reviews, and exclusive behind-the-scenes insights that dive deeper into the soul of cinema.',
                            "Whether you're a casual viewer or a dedicated cinephile, ReelTalks brings you closer to the art of filmmaking—from celebrated blockbusters to hidden indie treasures.",
                        ].map((text, idx) => (
                            <p key={idx} className="flex gap-2">
                                <Clapperboard className="mt-1 text-red-600" size={20} />
                                {text}
                            </p>
                        ))}

                        <p className="pt-4 text-center text-white">
                            Join the conversation. Feel the reel. Live the story.
                        </p>
                    </div>

                    {/* Contact Form */}
                    <div className="mx-auto mt-10 max-w-md space-y-5">
                        <input
                            type="text"
                            placeholder="Your Name..."
                            className="w-full rounded-xl border border-gray-500/30 bg-gray-800 px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:outline-none"
                        />

                        <input
                            type="email"
                            placeholder="Email Address..."
                            className="w-full rounded-xl border border-gray-500/30 bg-gray-800 px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:outline-none"
                        />

                        <textarea
                            rows={4}
                            placeholder="Your Message..."
                            className="w-full rounded-xl border border-gray-500/30 bg-gray-800 px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-red-600 focus:outline-none"
                        />

                        <button className="w-full rounded-xl bg-red-700 py-3 transition hover:bg-red-800">
                            Send Message
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
