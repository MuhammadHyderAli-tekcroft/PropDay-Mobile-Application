import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { queryClient } from '../../../lib/queryClient';
import { setAccessToken, setUnauthorizedHandler } from '../../../services';
import { logoutRequest } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [showInitialSplash, setShowInitialSplash] = useState(true);
    const [showPostLoginSplash, setShowPostLoginSplash] = useState(false);
    const checking = false;

    const isSplashVisible = showInitialSplash || showPostLoginSplash;

    const completeSplash = useCallback(() => {
        setShowInitialSplash(false);
        setShowPostLoginSplash(false);
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(() => {
            setAccessToken(null);
            setToken(null);
            queryClient.clear();
        });
        return () => setUnauthorizedHandler(null);
    }, []);

    const signIn = useCallback((newToken) => {
        setAccessToken(newToken);
        setToken(newToken);
        setShowPostLoginSplash(true);
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
        queryClient.clear();
    }, [token]);

    return (
        <AuthContext.Provider
            value={{ token, signIn, signOut, checking, isSplashVisible, completeSplash }}
        >
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
