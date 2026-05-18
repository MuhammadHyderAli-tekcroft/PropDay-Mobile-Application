import { useEffect } from 'react';
import { useRouter } from 'expo-router';

import { useAuth } from '../../../store';

export function useRequireAuth() {
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.replace('/login');
        }
    }, [token, router]);

    return { isAuthenticated: Boolean(token) };
}
