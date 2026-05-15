import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { setAccessToken, setUnauthorizedHandler } from '../../../services';
import { logoutRequest } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const checking = false;

    useEffect(() => {
        setUnauthorizedHandler(() => {
            setAccessToken(null);
            setToken(null);
        });
        return () => setUnauthorizedHandler(null);
    }, []);

    const signIn = useCallback((newToken) => {
        setAccessToken(newToken);
        setToken(newToken);
    }, []);

    const signOut = useCallback(async () => {
        if (token) {
            try {
                const data = await logoutRequest();
                console.log('response message from Laravel Api', data.message);
            } catch (error) {
                console.log('Backend logout failed:', error.response?.data || error.message);
            }
        }
        setAccessToken(null);
        setToken(null);
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, signIn, signOut, checking }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context == null) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
