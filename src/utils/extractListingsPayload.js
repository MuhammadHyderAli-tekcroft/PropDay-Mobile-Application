export function extractListingsPayload(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }
    if (Array.isArray(payload?.data)) {
        return payload.data;
    }
    if (Array.isArray(payload?.listings)) {
        return payload.listings;
    }
    if (Array.isArray(payload?.results)) {
        return payload.results;
    }
    return [];
}
