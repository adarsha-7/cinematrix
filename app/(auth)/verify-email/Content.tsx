'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Film } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (!email) router.push('/signup');
    }, [email, router]);

    // Countdown timer
    useEffect(() => {
        if (resendCooldown === 0) return;

        const interval = setInterval(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError(null);

        const { error } = await authClient.emailOtp.verifyEmail({
            email,
            otp,
        });

        setLoading(false);

        if (error) {
            setError(error.message || 'Invalid OTP');
        } else {
            sessionStorage.setItem('toast', 'Email verified successfully. Please login to continue.');
            router.push('/login');
        }
    };

    const handleResend = async () => {
        if (!email || resendCooldown > 0) return;

        setLoading(true);
        setError(null);

        const { error } = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: 'email-verification',
        });

        setLoading(false);

        if (error) {
            setError(error.message || 'Failed to resend OTP');
        } else {
            setResendCooldown(60); // ⏳ 60s lock
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="flex min-h-150 w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl">
                {/* Left */}
                <div className="flex w-full items-center p-12 md:w-1/2">
                    <form onSubmit={handleVerify} className="mx-auto w-full max-w-md">
                        <h1 className="mb-2 text-center font-serif text-4xl font-light text-gray-800">
                            Verify Your Email
                        </h1>

                        <p className="mb-8 text-center text-sm text-gray-600">
                            Enter the OTP sent to <span className="font-medium">{email}</span>
                        </p>

                        <div className="mb-8">
                            <label className="mb-2 block text-sm text-black">OTP Code</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                className="w-full rounded-full border-2 border-gray-300 px-4 py-3 text-center text-lg tracking-widest text-gray-700 focus:border-gray-400 focus:outline-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mb-4 w-full cursor-pointer rounded-3xl bg-red-800 py-3 font-medium text-white transition hover:bg-red-900 disabled:opacity-75"
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>

                        {error && <p className="mb-4 text-center text-sm text-red-700">{error}</p>}

                        <p className="text-center text-sm text-gray-500">
                            Didn’t receive the code?{' '}
                            <span
                                onClick={handleResend}
                                className={`cursor-pointer text-red-800 hover:underline ${
                                    resendCooldown > 0 && 'pointer-events-none opacity-50'
                                }`}
                            >
                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                            </span>
                        </p>
                    </form>
                </div>

                {/* Right */}
                <div className="relative hidden w-1/2 overflow-hidden bg-black text-white md:flex">
                    <div className="absolute top-8 right-8 flex items-center gap-2">
                        <Film className="text-primary h-5 w-5" />
                        <span className="text-2xl font-bold">Cinematrix</span>
                    </div>

                    <div className="absolute top-1/2 right-12 -translate-y-1/2 text-right">
                        <h2 className="text-6xl font-bold">Almost</h2>
                        <h2 className="text-primary text-6xl font-bold">There</h2>
                        <h2 className="text-primary mb-6 text-6xl font-bold">🎬</h2>

                        <p className="text-xl">
                            Verify & <span className="text-primary">Start Exploring</span>
                        </p>

                        <div className="mt-6 flex justify-end gap-2">
                            <span className="bg-primary h-1 w-12" />
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
