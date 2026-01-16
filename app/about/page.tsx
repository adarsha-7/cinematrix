import Navbar from '../components/Navbar';
import { Mail, Phone, Clapperboard } from 'lucide-react';

export default function AboutPage() {
    const lines = [
        'CineMatrix is your personal movie companion—browse films, rate what you watch, and keep track of your favorites with a simple, intuitive watchlist.',
        "Our smart recommendation engine combines user trends and movie features to suggest films you'll actually love, making discovering your next favorite movie effortless.",
        "Whether you're a casual viewer or a film enthusiast, CineHive brings the power of personalized recommendations and community insights right to your fingertips.",
    ];

    return (
        <div>
            <div className="fixed top-0 left-0 z-50 w-full">
                <Navbar />
            </div>

            <main className="mx-auto mt-5 max-w-6xl space-y-10 px-6 py-30">
                <section className="rounded-xl border border-gray-400/40 bg-[#111] p-8">
                    <h2 className="mb-6 text-3xl font-bold text-white">About Cinematrix</h2>

                    <div className="space-y-6 leading-relaxed text-gray-200">
                        {lines.map((text, idx) => (
                            <p key={idx} className="flex gap-2">
                                <Clapperboard className="text-primary mt-1" size={20} />
                                {text}
                            </p>
                        ))}
                    </div>
                </section>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-400/40 bg-[#111] p-8 text-center">
                        <Mail className="text-primary mx-auto mb-4" size={28} />
                        <p>cinematrix.com.np</p>
                        <p>cinematrix@gmail.com</p>
                    </div>

                    <div className="rounded-xl border border-gray-400/40 bg-[#111] p-8 text-center">
                        <Phone className="text-primary mx-auto mb-4" size={28} />
                        <p>+977 9808003690</p>
                        <p>+977 9803176487</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
