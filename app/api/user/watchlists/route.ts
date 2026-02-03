import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession(req);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const watchlist = await prisma.watchlist.findUnique({
        where: { userId: session.user.id },
        include: {
            movies: {
                include: {
                    movie: { select: { id: true, title: true } },
                },
            },
            tvShows: {
                include: {
                    tvShow: { select: { id: true, name: true } },
                },
            },
        },
    });

    if (!watchlist) {
        return NextResponse.json([]);
    }

    const items = [
        ...watchlist.movies.map((m) => ({
            id: m.movie.id,
            title: m.movie.title,
            type: 'movie' as const,
            createdAt: m.createdAt,
        })),
        ...watchlist.tvShows.map((t) => ({
            id: t.tvShow.id,
            title: t.tvShow.name,
            type: 'tv' as const,
            createdAt: t.createdAt,
        })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(items);
}
