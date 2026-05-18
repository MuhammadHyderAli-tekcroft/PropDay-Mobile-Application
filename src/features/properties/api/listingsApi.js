import api from '../../../services/api';

export async function fetchListings() {
    const response = await api.get('/admin/listings/');
    return response.data;
}

export async function fetchListingById(id) {
    const response = await api.get(`/admin/listings/${id}`);
    return response.data;
}
