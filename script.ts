import { prisma } from './lib/prisma';

async function main() {
    const tvShowId = 20727;

    // Delete related entries first
    await prisma.tVShowCast.deleteMany({ where: { tvShowId } });
    await prisma.tVShowCreator.deleteMany({ where: { tvShowId } });
    await prisma.tVShowGenre.deleteMany({ where: { tvShowId } });
    await prisma.tVShowLanguage.deleteMany({ where: { tvShowId } });
    await prisma.tVShowSpokenLanguage.deleteMany({ where: { tvShowId } });
    await prisma.tVShowOriginalLanguage.deleteMany({ where: { tvShowId } });
    await prisma.tVShowProductionCompany.deleteMany({ where: { tvShowId } });
    await prisma.tVShowProductionCountry.deleteMany({ where: { tvShowId } });
    await prisma.tVShowNetwork.deleteMany({ where: { tvShowId } });
    await prisma.watchlistTVShow.deleteMany({ where: { tvShowId } });
    await prisma.rating.deleteMany({ where: { tvShowId } });
    await prisma.tVShowFeature.deleteMany({ where: { tvShowId } });

    // Finally, delete the TV show
    await prisma.tVShow.delete({
        where: { id: tvShowId },
    });

    console.log(`✅ TV show with ID ${tvShowId} and all related records have been deleted.`);
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
