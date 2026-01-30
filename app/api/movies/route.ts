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

async function getWatchedMovieIds(userId: string) {
    const rated = await prisma.rating.findMany({
        where: { userId, movieId: { not: null } },
        select: { movieId: true },
    });

    return rated.map((r) => r.movieId!);
}

async function getMovies(page: number, genres: string[], sort: string, hideWatched: boolean, userId?: string) {
    let watchedIds: number[] = [];

    if (hideWatched && userId) {
        watchedIds = await getWatchedMovieIds(userId);
    }

    const movies = await prisma.movie.findMany({
        where: {
            ...(genres.length ? { genres: { some: { genre: { name: { in: genres } } } } } : {}),
            ...(hideWatched && watchedIds.length ? { id: { notIn: watchedIds } } : {}),
        },
        orderBy: (sort === 'popular' && { voteCount: 'desc' }) ||
            (sort === 'newest' && { releaseDate: 'desc' }) ||
            (sort === 'oldest' && { releaseDate: 'asc' }) || { voteCount: 'desc' },
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

    let recommendationIds = rec.recommendations.map(Number);

    if (hideWatched) {
        const watchedIds = await getWatchedMovieIds(userId);
        const watchedSet = new Set(watchedIds);
        recommendationIds = recommendationIds.filter((id) => !watchedSet.has(id));
    }

    if (!recommendationIds.length) return [];

    const movies = await prisma.movie.findMany({
        where: {
            id: { in: recommendationIds },
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

    const orderMap = new Map(recommendationIds.map((id, i) => [id, i]));
    movies.sort((a, b) => orderMap.get(a.id)! - orderMap.get(b.id)!);

    const start = 50 * (page - 1);
    return movies.slice(start, start + 50).map(mapMovie);
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const sort = searchParams.get('sort');
    const hideWatched = searchParams.get('hideWatched') === 'true';
    const page = Number(searchParams.get('page'));
    const genres = searchParams.getAll('genres');

    if (!sort || !page || page <= 0) {
        return NextResponse.json({ message: 'Missing or invalid sort/page query parameter' }, { status: 400 });
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    try {
        let moviesData: any[] = [];

        if (sort === 'recommended') {
            moviesData = session ? await getRecommendedMovies(page, genres, hideWatched, session.user.id) : [];
            return NextResponse.json(
                { moviesData },
                {
                    headers: {
                        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=180',
                    },
                },
            );
        } else {
            moviesData = await getMovies(page, genres, sort, hideWatched, session?.user.id);
            return NextResponse.json(
                { moviesData },
                {
                    headers: {
                        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
                    },
                },
            );
        }
    } catch (err) {
        console.error('Error fetching movies:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
