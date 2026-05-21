import api from '../services/api';

export async function fetchTasks() {
    const response = await api.get('/admin/tasks');
    return response.data;
}
