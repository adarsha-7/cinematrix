import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const genres = searchParams.getAll('genres');

    try {
        const total = await prisma.tVShow.count({
            where: genres.length ? { genres: { some: { genre: { name: { in: genres } } } } } : {},
        });

        return NextResponse.json({ total }, { status: 200 });
    } catch (err) {
        console.error('Error fetching TV show count:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
