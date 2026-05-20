import api from '../services/api';

export async function fetchContacts() {
    const response = await api.get('/admin/users');
    return response.data;
}

export async function fetchcurrentUser() {
    const response = await api.get('/admin/users/current-user');
    return response.data;
}

export async function fetchContactById(id) {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
}