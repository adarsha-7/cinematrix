import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession(req);

    if (!session?.user?.id) {
        return NextResponse.json({ rating: null }, { status: 401 });
    }

    const movieId = req.nextUrl.searchParams.get('movieId');
    const movieIdNumber = Number(movieId);

    if (!movieId || isNaN(movieIdNumber)) {
        return NextResponse.json({ message: 'Invalid movieId' }, { status: 400 });
    }

    const rating = await prisma.rating.findFirst({
        where: {
            userId: session.user.id,
            movieId: movieIdNumber,
        },
        select: {
            rating: true,
        },
    });

    return NextResponse.json({
        rating: rating?.rating ?? null,
    });
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession(req);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const movieId = Number(req.nextUrl.searchParams.get('movieId'));
    const ratingValue = Number(req.nextUrl.searchParams.get('rating'));

    if (!movieId || isNaN(movieId) || !ratingValue || isNaN(ratingValue) || ratingValue < 1 || ratingValue > 10) {
        return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    const rating = await prisma.rating.upsert({
        where: {
            userId_movieId: {
                userId: session.user.id,
                movieId,
            },
        },
        update: { rating: ratingValue },
        create: { userId: session.user.id, movieId, rating: ratingValue },
    });

    return NextResponse.json({ rating: rating.rating });
}
