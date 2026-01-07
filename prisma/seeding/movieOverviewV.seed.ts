import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

async function main() {
    const filePath = path.join(process.cwd(), 'movie_vectors/overview.json');
    const jsonData: { movieId: number; overview: string }[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (jsonData.length === 0) {
        console.log('No data to insert.');
        return;
    }

    // Prepare data for Prisma
    const records = jsonData.map((item) => ({
        movieId: item.movieId,
        overview: Buffer.from(item.overview, 'base64'), // convert Base64 to Buffer
    }));

    // Insert into database
    const result = await prisma.movieFeatureVector.createMany({
        data: records,
        skipDuplicates: true, // optional
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
