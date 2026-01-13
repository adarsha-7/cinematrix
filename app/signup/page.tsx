'use client';

import { useState, ChangeEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Film } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

interface SignupForm {
    fullname: string;
    email: string;
    password: string;
}

export default function SignupPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<SignupForm>({
        fullname: '',
        email: '',
        password: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Better Auth signup handler
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        const { fullname, email, password } = formData;

        const { data, error } = await authClient.signUp.email(
            {
                email,
                password,
                name: fullname,
                callbackURL: '/home',
            },
            {
                onRequest: () => {
                    // called before sending the request
                    setLoading(true);
                    setError(null);
                },
                onSuccess: (ctx) => {
                    // called if signup succeeds
                    setLoading(false);
                    console.log('Signup success:', ctx.data);
                    // Redirect to dashboard or show a success message
                    router.push('/home');
                },
                onError: (ctx) => {
                    // called if signup fails
                    setLoading(false);
                    console.error('Signup error:', ctx.error);
                    setError(ctx.error?.message || 'Something went wrong');
                },
            },
        );
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="flex min-h-[600px] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl">
                {/* LEFT – FORM */}
                <div className="flex w-full items-center p-12 md:w-1/2">
                    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
                        <h1 className="mb-2 text-center font-serif text-4xl font-light text-gray-800">
                            Create an Account
                        </h1>
                        <p className="mb-8 text-center text-sm text-gray-600">Signup to join our community</p>

                        {/* SOCIAL BUTTON */}
                        <div className="mb-6 flex justify-center">
                            <button
                                type="button"
                                className="flex w-40 items-center justify-center gap-2 rounded-full border-2 border-gray-300 py-3 text-sm text-gray-600 transition hover:border-gray-400"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </button>
                        </div>

                        {/* DIVIDER */}
                        <div className="mb-6 flex items-center gap-4">
                            <span className="h-px flex-1 bg-gray-300" />
                            <span className="text-sm text-gray-500">OR</span>
                            <span className="h-px flex-1 bg-gray-300" />
                        </div>

                        {/* FULL NAME */}
                        <div className="mb-5">
                            <label className="mb-2 block font-serif text-sm text-black">Fullname</label>
                            <input
                                type="text"
                                name="fullname"
                                required
                                value={formData.fullname}
                                onChange={handleChange}
                                placeholder="Enter your fullname"
                                className="w-full rounded-full border-2 border-gray-300 px-4 py-3 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="mb-5">
                            <label className="mb-2 block font-serif text-sm text-black">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email id"
                                className="w-full rounded-full border-2 border-gray-300 px-4 py-3 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="mb-8">
                            <label className="mb-2 block font-serif text-sm text-black">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full rounded-full border-2 border-gray-300 px-4 py-3 pr-12 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        {!loading && (
                            <button
                                type="submit"
                                className="mb-4 w-full cursor-pointer rounded-full bg-red-800 py-3 font-medium text-white transition hover:bg-red-900"
                            >
                                Sign up
                            </button>
                        )}
                        {loading && (
                            <button className="bg-opacity-50 mb-4 w-full rounded-full bg-red-800 py-3 font-medium text-white transition hover:bg-red-900">
                                Signing up...
                            </button>
                        )}

                        {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}

                        <p className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link href="/login">
                                <span className="cursor-pointer text-red-800 hover:underline">Log in</span>
                            </Link>
                        </p>
                    </form>
                </div>

                {/* RIGHT – HERO */}
                <div className="relative hidden w-1/2 overflow-hidden bg-black text-white md:flex">
                    <div className="absolute top-8 right-8 flex items-center gap-2">
                        <Film className="h-5 w-5 text-red-600" />
                        <span className="text-2xl font-bold">Cinematrix</span>
                    </div>

                    <div className="absolute top-1/2 right-12 -translate-y-1/2 text-right">
                        <h2 className="text-6xl font-bold">Create Your</h2>
                        <h2 className="text-6xl font-bold text-red-600">Cinematic</h2>
                        <h2 className="mb-6 text-6xl font-bold text-red-600">Journey</h2>

                        <p className="text-xl">
                            Lights Camera <span className="text-red-600">Connect</span>!!
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <span className="h-1 w-12 bg-red-600" />
                            <span className="h-1 w-12 bg-gray-600" />
                            <span className="h-1 w-12 bg-gray-600" />
                        </div>
                    </div>

                    <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400">
                        © 2025 Cinematrix. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
