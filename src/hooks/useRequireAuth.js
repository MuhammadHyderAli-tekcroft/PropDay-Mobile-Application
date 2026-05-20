import { useAuth } from '../store';

export function useRequireAuth() {
    const { token } = useAuth();
    return { isAuthenticated: Boolean(token) };
}
