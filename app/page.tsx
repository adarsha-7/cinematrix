import Aboutpage from './about/page';
import Navbar from './components/Navbar';
import CineMatrixNavbar from './components/Navbar';
import Homepage from './home/page';
import LoginupPage from './login/page';
import Moviepage from './movie/page';
import SignupPage from './signup/page';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Home() {
    const res = await fetch(`${BASE_URL}/api/about`);
    const { aboutText } = await res.json();

    return (
        <main className="flex flex-col items-center gap-10">
            <h1 className="mt-5 text-center text-3xl">Welcome To Cinematrix!</h1>
            <p className="w-100 text-center text-lg">{aboutText}</p>
        </main>
    );
}
