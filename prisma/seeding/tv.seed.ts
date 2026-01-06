import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

async function main() {
    const filePath = path.join(process.cwd(), 'datasets/tv.csv');
    type TVRecord = {
        id: number;
        name: string;
        numberOfSeasons: number | null;
        numberOfEpisodes: number | null;
        voteCount: number | null;
        voteAverage: number | null;
        overview: string | null;
        adult: boolean;
        backdropPath: string | null;
        firstAirDate: Date | null;
        lastAirDate: Date | null;
        homepage: string | null;
        inProduction: boolean;
        originalName: string | null;
        popularity: number | null;
        posterPath: string | null;
        type: string | null;
        status: string | null;
        tagline: string | null;
        episodeRunTime: number | null;
    };

    const records: TVRecord[] = [];

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                records.push({
                    id: Number(row.id),
                    name: row.name,
                    numberOfSeasons: row.numberOfSeasons ? Number(row.numberOfSeasons) : null,
                    numberOfEpisodes: row.numberOfEpisodes ? Number(row.numberOfEpisodes) : null,
                    voteCount: row.voteCount ? Number(row.voteCount) : null,
                    voteAverage: row.voteAverage ? Number(row.voteAverage) : null,
                    overview: row.overview || null,
                    adult: row.adult === 'True',
                    backdropPath: row.backdropPath || null,
                    firstAirDate: row.firstAirDate ? new Date(row.firstAirDate) : null,
                    lastAirDate: row.lastAirDate ? new Date(row.lastAirDate) : null,
                    homepage: row.homepage || null,
                    inProduction: row.inProduction === 'True',
                    originalName: row.originalName || null,
                    popularity: row.popularity ? Number(row.popularity) : null,
                    posterPath: row.posterPath || null,
                    type: row.type || null,
                    status: row.status || null,
                    tagline: row.tagline || null,
                    episodeRunTime: row.episodeRunTime ? Number(row.episodeRunTime) : null,
                });
            })
            .on('end', () => {
                console.log(`Parsed ${records.length} rows from CSV.`);
                resolve();
            })
            .on('error', (err) => reject(err));
    });

    if (records.length === 0) {
        console.log('No data to insert.');
        return;
    }

    const result = await prisma.tVShow.createMany({
        data: records,
        skipDuplicates: true,
    });

    console.log(`Inserted ${result.count} rows into the database.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
