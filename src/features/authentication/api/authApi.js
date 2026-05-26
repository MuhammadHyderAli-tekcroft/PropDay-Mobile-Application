import api from '../../../services/api';

export async function loginRequest(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
}

export async function logoutRequest() {
    const res = await api.post('/auth/logout');
    return res.data;
}