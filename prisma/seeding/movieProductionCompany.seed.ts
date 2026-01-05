import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

async function main() {
    const filePath = path.join(process.cwd(), 'datasets/movie_production_company.csv');
    const records: { movieId: number; companyId: number }[] = [];

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                records.push({ movieId: Number(row.movieId), companyId: Number(row.companyId) });
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

    const result = await prisma.movieProductionCompany.createMany({
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
