import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const mapMovie = (movie: any) => ({
    id: movie.id,
    title: movie.title,
    releaseDate: movie.releaseDate,
    voteAverage: movie.voteAverage,
    voteCount: movie.voteCount,
    posterPath: movie.posterPath,
    genres: movie.genres.map((g: any) => g.genre.name),
    type: 'movie',
});

const mapTVShow = (tvShow: any) => ({
    id: tvShow.id,
    title: tvShow.name,
    releaseDate: tvShow.firstAirDate,
    voteAverage: tvShow.voteAverage,
    voteCount: tvShow.voteCount,
    posterPath: tvShow.posterPath,
    genres: tvShow.genres?.map((g: any) => g.genre.name) || [],
    type: 'tv show',
});

async function getMovies(query: string) {
    const movies = await prisma.movie.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { tagline: { contains: query, mode: 'insensitive' } },
                { overview: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { voteCount: 'desc' },
        select: {
            id: true,
            title: true,
            releaseDate: true,
            voteAverage: true,
            voteCount: true,
            posterPath: true,
            genres: { select: { genre: { select: { name: true } } } },
        },
    });

    return movies.map(mapMovie);
}

async function getTVShows(query: string) {
    const tvShows = await prisma.tVShow.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { tagline: { contains: query, mode: 'insensitive' } },
                { overview: { contains: query, mode: 'insensitive' } },
            ],
        },
        orderBy: { voteCount: 'desc' },
        select: {
            id: true,
            name: true,
            firstAirDate: true,
            voteAverage: true,
            voteCount: true,
            posterPath: true,
            genres: { select: { genre: { select: { name: true } } } },
        },
    });

    return tvShows.map(mapTVShow);
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query');
    const page = Number(searchParams.get('page'));

    if (!query || !page || page <= 0) {
        return NextResponse.json({ message: 'Missing or invalid query parameter' }, { status: 400 });
    }

    try {
        // Fetch all matching movies and TV shows
        const [movies, tvShows] = await Promise.all([getMovies(query), getTVShows(query)]);

        // Merge and sort by vote count descending
        const allResults = [...movies, ...tvShows].sort((a, b) => b.voteCount - a.voteCount);

        // Pagination logic
        const pageSize = 50;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedResults = allResults.slice(start, end);

        const total = allResults.length;

        return NextResponse.json(
            {
                data: paginatedResults,
                total,
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
                },
            },
        );
    } catch (err) {
        console.error('Error fetching movies and TV shows:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
