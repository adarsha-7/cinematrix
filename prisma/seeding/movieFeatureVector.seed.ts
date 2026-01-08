import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
    const filePath = path.join(process.cwd(), 'movie_vectors/combined_movie_vectors.json');
    const jsonData: {
        movieId: number;
        overview: string;
        tagline: string;
        genres: string;
        keywords: string;
        cast: string;
        director: string;
        runtime: string;
        voteCount: string;
        originalLanguage: string;
        combinedVector: string;
    }[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (jsonData.length === 0) {
        console.log('No data to insert.');
        return;
    }

    const records = jsonData.map((item) => ({
        movieId: item.movieId,
        overview: Buffer.from(item.overview, 'base64'),
        tagline: Buffer.from(item.tagline, 'base64'),
        genres: Buffer.from(item.genres, 'base64'),
        keywords: Buffer.from(item.keywords, 'base64'),
        cast: Buffer.from(item.cast, 'base64'),
        director: Buffer.from(item.director, 'base64'),
        runtime: Buffer.from(item.runtime, 'base64'),
        voteCount: Buffer.from(item.voteCount, 'base64'),
        originalLanguage: Buffer.from(item.originalLanguage, 'base64'),
        combinedVector: Buffer.from(item.combinedVector, 'base64'),
        modelVersion: 'v1',
    }));

    const result = await prisma.movieFeatureVector.createMany({
        data: records,
        skipDuplicates: true,
    });

    console.log(`Inserted ${result.count} rows into MovieFeatureVector.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
