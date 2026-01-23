'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function MovieInteraction({ movieId }: { movieId: string }) {
    const { session } = useAuth();
    useEffect(() => {
        async function saveInteraction() {
            if (!session) return;
            try {
                await fetch(`${BASE_URL}/api/user/interaction`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ movieId: Number(movieId), type: 'CLICK' }),
                });
            } catch (err) {
                console.error('Failed to save interaction', err);
            }
        }

        saveInteraction();
    }, [session, movieId]);

    return null;
}
