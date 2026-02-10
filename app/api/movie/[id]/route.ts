import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: NextRequest,
    {
        params,
    }: {
        params: Promise<{ id: string }>;
    },
) {
    const { id } = await params;

    const parsedId = Number(id);
    const idNumber = parsedId;

    const isValidNumber = typeof idNumber === 'number';

    if (!id || typeof id !== 'string' || !idNumber || !isValidNumber) {
        return NextResponse.json({ message: 'Invalid or missing id parameter' }, { status: 400 });
    }

    const movie = await prisma.movie.findUnique({
        where: { id: idNumber },
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
            imdbId: true,
            director: {
                select: {
                    person: {
                        select: { name: true },
                    },
                },
            },
            cast: {
                orderBy: { castOrder: 'asc' },
                select: {
                    character: true,
                    castOrder: true,
                    person: {
                        select: { name: true, profilePath: true },
                    },
                },
            },
            genres: {
                select: {
                    genre: { select: { name: true } },
                },
            },
            keywords: {
                select: {
                    keyword: { select: { name: true } },
                },
            },
            originalLanguages: {
                select: {
                    language: { select: { code: true, name: true } },
                },
            },
            productionCompanies: {
                select: {
                    company: { select: { name: true } },
                },
            },
            productionCountries: {
                select: {
                    country: { select: { name: true } },
                },
            },
        },
    });

    if (!movie) {
        return NextResponse.json({ message: 'Movie not found' }, { status: 404 });
    }

    const movieData = {
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
        imdbId: movie.imdbId,

        director: movie.director[0]?.person.name ?? null,

        cast: movie.cast.map((c) => ({
            character: c.character,
            castOrder: c.castOrder,
            actor: c.person.name,
            profilePath: c.person.profilePath,
        })),

        genres: movie.genres.map((g) => g.genre.name),

        keywords: movie.keywords.map((k) => k.keyword.name),

        originalLanguages: movie.originalLanguages.map((l) => l.language.name),

        productionCompanies: movie.productionCompanies.map((c) => c.company.name),

        productionCountries: movie.productionCountries.map((c) => c.country.name),
    };

    return NextResponse.json({ movieData });
}
