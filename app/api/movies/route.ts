import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';

const mapMovie = (movie: any) => ({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    tagline: movie.tagline,
    releaseDate: movie.releaseDate,
    runtime: movie.runtime,
    voteAverage: movie.voteAverage,
    voteCount: movie.voteCount,
    backdropPath: movie.backdropPath,
    posterPath: movie.posterPath,
    director: movie.director[0]?.person.name ?? null,
    cast: movie.cast.map((c: any) => ({
        character: c.character,
        castOrder: c.castOrder,
        actor: c.person.name,
        profilePath: c.person.profilePath,
    })),
    genres: movie.genres.map((g: any) => g.genre.name),
    keywords: movie.keywords.map((k: any) => k.keyword.name),
    originalLanguages: movie.originalLanguages.map((l: any) => l.language.name),
    productionCompanies: movie.productionCompanies.map((c: any) => c.company.name),
    productionCountries: movie.productionCountries.map((c: any) => c.country.name),
});

async function getMovies(page: number, genres: string[], sort: string) {
    const movies = await prisma.movie.findMany({
        where: genres.length ? { genres: { some: { genre: { name: { in: genres } } } } } : {},
        orderBy: (sort == 'popular' && { voteCount: 'desc' }) ||
            (sort == 'newest' && { releaseDate: 'desc' }) ||
            (sort == 'oldest' && { releaseDate: 'asc' }) || { voteCount: 'desc' },
        skip: 50 * (page - 1),
        take: 50,
        select: {
            id: true,
            title: true,
            overview: true,
            tagline: true,
            releaseDate: true,
            runtime: true,
            voteAverage: true,
            voteCount: true,
            backdropPath: true,
            posterPath: true,
            director: { select: { person: { select: { name: true } } } },
            cast: {
                orderBy: { castOrder: 'asc' },
                select: {
                    character: true,
                    castOrder: true,
                    person: { select: { name: true, profilePath: true } },
                },
            },
            genres: { select: { genre: { select: { name: true } } } },
            keywords: { select: { keyword: { select: { name: true } } } },
            originalLanguages: { select: { language: { select: { name: true } } } },
            productionCompanies: { select: { company: { select: { name: true } } } },
            productionCountries: { select: { country: { select: { name: true } } } },
        },
    });

    return movies.map(mapMovie);
}

async function getRecommendedMovies(page: number, genres: string[], hideWatched: boolean, userId: string) {
    const rec = await prisma.userMovieRecommendations.findUnique({
        where: { userId },
        select: { recommendations: true },
    });

    if (!rec || rec.recommendations.length === 0) return [];

    const pageSize = 50;
    const start = pageSize * (page - 1);
    const end = start + pageSize;

    const pagedIds = rec.recommendations.slice(start, end).map((id) => Number(id));

    if (!pagedIds.length) return [];

    const movies = await prisma.movie.findMany({
        where: {
            id: { in: pagedIds },
            ...(genres.length ? { genres: { some: { genre: { name: { in: genres } } } } } : {}),
        },
        select: {
            id: true,
            title: true,
            overview: true,
            tagline: true,
            releaseDate: true,
            runtime: true,
            voteAverage: true,
            voteCount: true,
            backdropPath: true,
            posterPath: true,
            director: { select: { person: { select: { name: true } } } },
            cast: {
                orderBy: { castOrder: 'asc' },
                select: {
                    character: true,
                    castOrder: true,
                    person: { select: { name: true, profilePath: true } },
                },
            },
            genres: { select: { genre: { select: { name: true } } } },
            keywords: { select: { keyword: { select: { name: true } } } },
            originalLanguages: { select: { language: { select: { name: true } } } },
            productionCompanies: { select: { company: { select: { name: true } } } },
            productionCountries: { select: { country: { select: { name: true } } } },
        },
    });

    // Preserve recommendation order
    const orderMap = new Map(pagedIds.map((id, i) => [id, i]));
    movies.sort((a, b) => orderMap.get(a.id)! - orderMap.get(b.id)!);

    return movies.map(mapMovie);
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sort = searchParams.get('sort');
    const hideWatched = Boolean(searchParams.get('hideWatched'));
    const page = Number(searchParams.get('page'));
    const genres = searchParams.getAll('genres');

    if (!sort || !page || page <= 0) {
        return NextResponse.json({ message: 'Missing or invalid sort/page query parameter' }, { status: 400 });
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    try {
        let moviesData: any;
        if (sort == 'recommended') {
            if (session) {
                moviesData = await getRecommendedMovies(page, genres, hideWatched, session.user.id);
            } else {
                moviesData = [];
            }
        } else {
            moviesData = await getMovies(page, genres, sort);
        }
        return NextResponse.json(
            { moviesData },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
                },
            },
        );
    } catch (err) {
        console.error('Error fetching movies:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
