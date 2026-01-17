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

export type { Movie, Category, SignupForm, LoginForm, UserProfile, MovieData };
