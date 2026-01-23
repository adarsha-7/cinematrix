import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession(req);

    if (!session?.user?.id) {
        return NextResponse.json({ watchlist: null }, { status: 401 });
    }

    const movieId = req.nextUrl.searchParams.get('movieId');
    const tvShowId = req.nextUrl.searchParams.get('tvShowId');

    try {
        const watchlist = await prisma.watchlist.findUnique({
            where: { userId: session.user.id },
        });

        if (!watchlist) return NextResponse.json({ inWatchlist: false });

        if (movieId) {
            const exists = await prisma.watchlistMovie.findUnique({
                where: { watchlistId_movieId: { watchlistId: watchlist.id, movieId: Number(movieId) } },
            });
            return NextResponse.json({ inWatchlist: !!exists });
        } else if (tvShowId) {
            const exists = await prisma.watchlistTVShow.findUnique({
                where: { watchlistId_tvShowId: { watchlistId: watchlist.id, tvShowId: Number(tvShowId) } },
            });
            return NextResponse.json({ inWatchlist: !!exists });
        }

        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession(req);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const url = req.nextUrl;
    const movieId = url.searchParams.get('movieId');
    const tvShowId = url.searchParams.get('tvShowId');

    try {
        // Find or create the single watchlist for this user
        let watchlist = await prisma.watchlist.findUnique({
            where: { userId: session.user.id },
        });

        if (!watchlist) {
            watchlist = await prisma.watchlist.create({
                data: { userId: session.user.id, name: 'My Watchlist' },
            });
        }

        if (movieId) {
            const exists = await prisma.watchlistMovie.findUnique({
                where: { watchlistId_movieId: { watchlistId: watchlist.id, movieId: Number(movieId) } },
            });

            if (exists) {
                await prisma.watchlistMovie.delete({
                    where: { watchlistId_movieId: { watchlistId: watchlist.id, movieId: Number(movieId) } },
                });
                return NextResponse.json({ inWatchlist: false });
            } else {
                await prisma.watchlistMovie.create({
                    data: { watchlistId: watchlist.id, movieId: Number(movieId) },
                });
                return NextResponse.json({ inWatchlist: true });
            }
        } else if (tvShowId) {
            const exists = await prisma.watchlistTVShow.findUnique({
                where: { watchlistId_tvShowId: { watchlistId: watchlist.id, tvShowId: Number(tvShowId) } },
            });

            if (exists) {
                await prisma.watchlistTVShow.delete({
                    where: { watchlistId_tvShowId: { watchlistId: watchlist.id, tvShowId: Number(tvShowId) } },
                });
                return NextResponse.json({ inWatchlist: false });
            } else {
                await prisma.watchlistTVShow.create({
                    data: { watchlistId: watchlist.id, tvShowId: Number(tvShowId) },
                });
                return NextResponse.json({ inWatchlist: true });
            }
        }

        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
