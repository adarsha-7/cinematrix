import Navbar from '../components/Navbar';
import { Mail, Phone, Clapperboard } from 'lucide-react';

export default function AboutPage() {
    return (
        <div>
            <div className="fixed top-0 left-0 z-50 w-full">
                <Navbar />
            </div>

            <main className="mx-auto mt-5 max-w-6xl space-y-10 px-6 py-16">
                <section className="rounded-xl border border-gray-400/40 bg-[#111] p-8">
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
                    </div>
                </section>
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-400/40 bg-[#111] p-8 text-center">
                        <Mail className="mx-auto mb-4 text-red-600" size={28} />
                        <p>cinematrix.co.in</p>
                        <p>cinematrix@gmail.com</p>
                    </div>

                    <div className="rounded-xl border border-gray-400/40 bg-[#111] p-8 text-center">
                        <Phone className="mx-auto mb-4 text-red-600" size={28} />
                        <p>+977 9876543210</p>
                        <p>+977 9876543219</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
