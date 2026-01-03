import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

async function main() {
    const filePath = path.join(process.cwd(), 'datasets/actors.csv');

    const records: {
        adult: boolean;
        gender?: number;
        id: number;
        knownForDepartment: string;
        name: string;
        originalName: string;
        popularity?: number;
        profilePath?: string;
    }[] = [];

    await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                records.push({
                    id: Number(row.id),
                    adult: row.adult === 'True',
                    gender: row.gender ? Number(row.gender) : undefined,
                    knownForDepartment: row.known_for_department,
                    name: row.name,
                    originalName: row.original_name,
                    popularity: row.popularity ? Number(row.popularity) : undefined,
                    profilePath: row.profile_path || undefined,
                });
            })
            .on('end', () => {
                console.log(`Parsed ${records.length} rows from CSV.`);
                resolve();
            })
            .on('error', reject);
    });

    if (records.length === 0) {
        console.log('No data to insert.');
        return;
    }

    const result = await prisma.person.createMany({
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
