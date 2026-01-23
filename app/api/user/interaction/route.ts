import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const REC_API_BASE_URL = process.env.REC_API_BASE_URL;
const REC_API_KEY = process.env.REC_API_KEY;

const REC_REFRESH_ON = 5;

function getInteractionWeight(type: 'CLICK' | 'WATCHLIST' | 'SEARCH' | 'RATED', value?: number): number {
    switch (type) {
        case 'RATED':
            return value ? 0.1 * value * 2.5 : 0;
        case 'WATCHLIST':
            return 1;
        case 'SEARCH':
            return 0.5;
        case 'CLICK':
            return 0.25;
        default:
            return 0;
    }
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { movieId, type, value } = await req.json();

    if (
        typeof movieId !== 'number' ||
        !type ||
        (type !== 'CLICK' && type !== 'SEARCH' && type !== 'RATED' && type !== 'WATCHLIST') ||
        (type === 'RATED' && typeof value !== 'number')
    ) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    try {
        await prisma.userInteractionMovies.deleteMany({
            where: {
                userId: session.user.id,
                movieId,
                type,
            },
        });

        await prisma.userInteractionMovies.create({
            data: {
                userId: session.user.id,
                movieId,
                type,
                value,
            },
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to store interaction' }, { status: 500 });
    }

    const weight = getInteractionWeight(type, value);
    let N = 0;
    try {
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                interactionCount: {
                    increment: weight,
                },
            },
            select: { interactionCount: true },
        });
        N = updatedUser.interactionCount;
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update interaction count' }, { status: 500 });
    }

    if (N >= REC_REFRESH_ON) {
        try {
            const res = await fetch(`${REC_API_BASE_URL}/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': REC_API_KEY || '',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                }),
            });

            if (!res.ok) {
                throw new Error('Recommendation API failed');
            }

            const { recommendations } = await res.json();

            await prisma.userMovieRecommendations.upsert({
                where: { userId: session.user.id },
                update: {
                    recommendations,
                },
                create: {
                    userId: session.user.id,
                    recommendations,
                },
            });

            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    interactionCount: {
                        decrement: REC_REFRESH_ON,
                    },
                },
            });
        } catch (err) {
            return NextResponse.json({ error: 'Failed to refresh recommendations' }, { status: 500 });
        }
    }

    return NextResponse.json({
        message: 'stored interaction successfully',
    });
}
