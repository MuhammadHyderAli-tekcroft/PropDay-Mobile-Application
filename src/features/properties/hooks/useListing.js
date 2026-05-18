import { useCallback, useEffect, useState } from 'react';

import { fetchListingById } from '../api/listingsApi';
import { extractListingPayload, mapListing } from '../utils/mapListing';

export function useListing(id, enabled = true) {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        if (!id) {
            setLoading(false);
            setError('Property not found.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const payload = await fetchListingById(id);
            const raw = extractListingPayload(payload);
            setListing(mapListing(raw));
        } catch (err) {
            setError(err.response?.data?.message ?? err.message ?? 'Failed to load property.');
            setListing(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (enabled && id) {
            load();
        }
    }, [enabled, id, load]);

    return { listing, loading, error, refetch: load };
}
