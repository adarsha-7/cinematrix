import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession(req);

    if (!session?.user?.id) {
        return NextResponse.json({ rating: null }, { status: 401 });
    }

    const movieId = req.nextUrl.searchParams.get('movieId');
    const tvShowId = req.nextUrl.searchParams.get('tvShowId');

    if (movieId) {
        const rating = await prisma.rating.findFirst({
            where: {
                userId: session.user.id,
                movieId: Number(movieId),
            },
            select: { rating: true },
        });
        return NextResponse.json({ rating: rating?.rating ?? null });
    } else if (tvShowId) {
        const rating = await prisma.rating.findFirst({
            where: {
                userId: session.user.id,
                tvShowId: Number(tvShowId),
            },
            select: { rating: true },
        });
        return NextResponse.json({ rating: rating?.rating ?? null });
    }

    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession(req);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const movieId = req.nextUrl.searchParams.get('movieId');
    const tvShowId = req.nextUrl.searchParams.get('tvShowId');
    const ratingValue = Number(req.nextUrl.searchParams.get('rating'));

    if (!ratingValue || isNaN(ratingValue) || ratingValue < 1 || ratingValue > 10) {
        return NextResponse.json({ message: 'Invalid rating value' }, { status: 400 });
    }

    if (movieId) {
        const rating = await prisma.rating.upsert({
            where: {
                userId_movieId: {
                    userId: session.user.id,
                    movieId: Number(movieId),
                },
            },
            update: { rating: ratingValue },
            create: {
                userId: session.user.id,
                movieId: Number(movieId),
                rating: ratingValue,
            },
        });
        return NextResponse.json({ rating: rating.rating });
    } else if (tvShowId) {
        const rating = await prisma.rating.upsert({
            where: {
                userId_tvShowId: {
                    userId: session.user.id,
                    tvShowId: Number(tvShowId),
                },
            },
            update: { rating: ratingValue },
            create: {
                userId: session.user.id,
                tvShowId: Number(tvShowId),
                rating: ratingValue,
            },
        });
        return NextResponse.json({ rating: rating.rating });
    }

    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
}
