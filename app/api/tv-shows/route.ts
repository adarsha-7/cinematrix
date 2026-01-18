import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const mapTvShow = (tvShow: any) => ({
    id: tvShow.id,
    name: tvShow.name,
    overview: tvShow.overview,
    tagline: tvShow.tagline,
    firstAirDate: tvShow.firstAirDate,
    voteAverage: tvShow.voteAverage,
    voteCount: tvShow.voteCount,
    posterPath: tvShow.posterPath,
    backdropPath: tvShow.backdropPath,
    createdBy: tvShow.createdBy?.map((c: any) => c.creator.name) || [],
    cast: tvShow.cast?.map((c: any) => ({
        character: c.character,
        castOrder: c.castOrder,
        actor: c.person.name,
        profilePath: c.person.profilePath,
    })) || [],
    genres: tvShow.genres?.map((g: any) => g.genre.name) || [],
    languages: tvShow.languages?.map((l: any) => l.language.name) || [],
    spokenLanguages: tvShow.spokenLanguages?.map((l: any) => l.language.name) || [],
    originalLanguages: tvShow.originalLanguages?.map((l: any) => l.language.name) || [],
    networks: tvShow.networks?.map((n: any) => n.network.name) || [],
    productionCompanies: tvShow.productionCompanies?.map((c: any) => c.company.name) || [],
    productionCountries: tvShow.productionCountries?.map((c: any) => c.country.name) || [],
});

async function getPopularTvShows(page: number) {
    const tvShows = await prisma.tVShow.findMany({
        orderBy: { voteCount: 'desc' },
        skip: 50 * (page - 1),
        take: 50,
        select: {
            id: true,
            name: true,
            overview: true,
            tagline: true,
            firstAirDate: true,
            voteAverage: true,
            voteCount: true,
            posterPath: true,
            backdropPath: true,
            createdBy: { select: { creator: { select: { name: true } } } },
            cast: {
                orderBy: { castOrder: 'asc' },
                select: { character: true, castOrder: true, person: { select: { name: true, profilePath: true } } },
            },
            genres: { select: { genre: { select: { name: true } } } },
            languages: { select: { language: { select: { name: true } } } },
            spokenLanguages: { select: { language: { select: { name: true } } } },
            originalLanguages: { select: { language: { select: { name: true } } } },
            networks: { select: { network: { select: { name: true } } } },
            productionCompanies: { select: { company: { select: { name: true } } } },
            productionCountries: { select: { country: { select: { name: true } } } },
        },
    });

    return tvShows.map(mapTvShow);
}

export async function GET(req: NextRequest) {
    const page = Number(req.nextUrl.searchParams.get('page') || 1);
    const sort = req.nextUrl.searchParams.get('sort') || 'popular';

    try {
        const tvShowsData = await getPopularTvShows(page);
        return NextResponse.json({ tvShowsData });
    } catch (err) {
        console.error('Error fetching TV shows:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}