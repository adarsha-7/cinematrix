import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession(req);

    if (!session?.user?.id) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const ratings = await prisma.rating.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            movie: {
                select: {
                    id: true,
                    title: true,
                },
            },
            tvShow: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const formattedRatings = ratings.map((r) => ({
        id: r.id,
        movie: r.movie ? { id: r.movie.id, title: r.movie.title } : null,
        tvShow: r.tvShow ? { id: r.tvShow.id, title: r.tvShow.name } : null,
        rating: r.rating,
        createdAt: r.createdAt,
    }));

    return NextResponse.json(formattedRatings);
}
