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

export type { Movie, Category, SignupForm, LoginForm, UserProfile };
