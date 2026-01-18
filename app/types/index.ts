interface Movie {
    id: number;
    title: string;
    genre: string;
    rating: number;
    releaseDate: number;
    image: string;
}

interface Category {
    name: string;
    count: number;
}

interface SignupForm {
    email: string;
    password: string;
}

interface LoginForm {
    name: string;
    email: string;
    password: string;
}

interface UserProfile {
    name: string;
    email: string;
    image?: string;
}

interface MovieData {
    id: number | null;
    title: string | null;
    overview: string | null;
    tagline: string | null;
    releaseDate: string | null;
    runtime: number | null;
    voteAverage: number | null;
    voteCount: number | null;
    backdropPath: string | null;
    posterPath: string | null;
    director: string | null;
    cast:
        | {
              character: string | null;
              castOrder: number | null;
              actor: string | null;
              profilePath: string | null;
          }[]
        | null;
    genres: string[] | null;
    keywords: string[] | null;
    originalLanguages: string[] | null;
    productionCompanies: string[] | null;
    productionCountries: string[] | null;
}

interface TVShowData {
    id: number | null;

    name: string | null;
    originalName: string | null;
    overview: string | null;
    tagline: string | null;

    firstAirDate: string | null;
    lastAirDate: string | null;
    inProduction: boolean | null;

    numberOfSeasons: number | null;
    numberOfEpisodes: number | null;
    episodeRunTime: number | null;

    voteAverage: number | null;
    voteCount: number | null;
    popularity: number | null;

    adult: boolean | null;
    status: string | null;
    type: string | null;
    homepage: string | null;

    posterPath: string | null;
    backdropPath: string | null;

    createdBy: string[] | null; // ✅ FIXED

    cast:
        | {
              character: string | null;
              castOrder: number | null;
              actor: string | null;
              profilePath: string | null;
          }[]
        | null;

    genres: string[] | null;
    languages: string[] | null;
    originalLanguages: string[] | null;

    networks: string[] | null;
    originCountries: string[] | null;
    productionCompanies: string[] | null;
    productionCountries: string[] | null; // ✅ FIXED
}


export type { Movie, Category, SignupForm, LoginForm, UserProfile, MovieData ,TVShowData};
