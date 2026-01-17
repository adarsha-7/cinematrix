import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const sort = searchParams.get('sort');
    const limit = Number(searchParams.get('limit'));

    if (!sort || !limit || limit <= 0) {
        return NextResponse.json({ message: 'Missing or invalid sort/limit query parameter' }, { status: 400 });
    }

    if (sort !== 'popular') {
        return NextResponse.json({ message: 'Invalid fetch options' }, { status: 400 });
    }

    if (sort == 'popular') {
        try {
            const movies = await prisma.movie.findMany({
                orderBy: { voteCount: 'desc' },
                take: limit,
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

            const movieData = movies.map(mapMovie);

            return NextResponse.json({ movieData });
        } catch (err) {
            console.error('Error fetching movies:', err);
            return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        }
    }
    return NextResponse.json({ message: 'Invalid fetch options' }, { status: 400 });
}
