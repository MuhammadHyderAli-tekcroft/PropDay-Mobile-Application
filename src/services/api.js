import axios from 'axios';

let accessToken = null;
let onUnauthorized = null;
export const setAccessToken = (token) => {
    accessToken = token ?? null;
};

export const setUnauthorizedHandler = (handler) => {
    onUnauthorized = typeof handler === 'function' ? handler : null;
};

const api = axios.create({
    baseURL: 'http://192.168.1.34:8000/api',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            setAccessToken(null);
            onUnauthorized?.();
        }
        return Promise.reject(error);
    }
);

export default api;