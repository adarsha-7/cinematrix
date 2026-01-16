'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

type AuthContextType = {
    session: any;
    loading: boolean;
    error: any;
    refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const refetch = async () => {
        setLoading(true);
        try {
            const { data, error } = await authClient.getSession();
            setSession(data);
            setError(error);
        } catch (err) {
            setError(err);
            setSession(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refetch();
    }, []);

    return <AuthContext.Provider value={{ session, loading, error, refetch }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};
