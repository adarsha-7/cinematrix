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
    const idNumber = Number(id);

    if (!id || typeof id != 'string' || !idNumber || typeof idNumber != 'number') {
        return NextResponse.json({ message: 'Invalid or missing id parameter' }, { status: 400 });
    }

    const tvShow = await prisma.tVShow.findUnique({
        where: { id: idNumber },
        select: {
            id: true,
            name: true,
            originalName: true,
            overview: true,
            tagline: true,
            status: true,
            type: true,
            homepage: true,
            inProduction: true,

            firstAirDate: true,
            lastAirDate: true,
            episodeRunTime: true,
            numberOfSeasons: true,
            numberOfEpisodes: true,

            voteAverage: true,
            voteCount: true,
            popularity: true,
            adult: true,

            posterPath: true,
            backdropPath: true,

            createdBy: {
                select: {
                    creator: {
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

            languages: {
                select: {
                    language: { select: { name: true } },
                },
            },

            spokenLanguages: {
                select: {
                    language: { select: { name: true } },
                },
            },

            originalLanguages: {
                select: {
                    language: { select: { name: true } },
                },
            },

            networks: {
                select: {
                    network: { select: { name: true } },
                },
            },

            originCountries: {
                select: {
                    country: { select: { name: true } },
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

    if (!tvShow) {
        return NextResponse.json(
            { message: 'TV show not found' },
            { status: 404 }
        );
    }

    const tvShowData = {
        id: tvShow.id,
        name: tvShow.name,
        originalName: tvShow.originalName,
        overview: tvShow.overview,
        tagline: tvShow.tagline,

        status: tvShow.status,
        type: tvShow.type,
        homepage: tvShow.homepage,
        inProduction: tvShow.inProduction,

        firstAirDate: tvShow.firstAirDate,
        lastAirDate: tvShow.lastAirDate,
        episodeRunTime: tvShow.episodeRunTime,
        numberOfSeasons: tvShow.numberOfSeasons,
        numberOfEpisodes: tvShow.numberOfEpisodes,

        voteAverage: tvShow.voteAverage,
        voteCount: tvShow.voteCount,
        popularity: tvShow.popularity,
        adult: tvShow.adult,

        posterPath: tvShow.posterPath,
        backdropPath: tvShow.backdropPath,

        createdBy: tvShow.createdBy.map((c) => c.creator.name),

        cast: tvShow.cast.map((c) => ({
            character: c.character,
            castOrder: c.castOrder,
            actor: c.person.name,
            profilePath: c.person.profilePath,
        })),

        genres: tvShow.genres.map((g) => g.genre.name),
        languages: tvShow.languages.map((l) => l.language.name),
        spokenLanguages: tvShow.spokenLanguages.map((l) => l.language.name),
        originalLanguages: tvShow.originalLanguages.map((l) => l.language.name),

        networks: tvShow.networks.map((n) => n.network.name),
        originCountries: tvShow.originCountries.map((c) => c.country.name),
        productionCompanies: tvShow.productionCompanies.map((c) => c.company.name),
        productionCountries: tvShow.productionCountries.map((c) => c.country.name),
    };

    return NextResponse.json({ tvShowData });
}
