import { useCallback, useEffect, useState } from 'react';

import { fetchListings } from '../api/listingsApi';
import { extractCompanyName } from '../utils/extractCompanyName';
import { extractListingsPayload } from '../utils/extractListingsPayload';

export function useCompanyName(enabled = true) {
    const [companyName, setCompanyName] = useState(null);
    const [loading, setLoading] = useState(Boolean(enabled));
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = await fetchListings();
            const allRaw = extractListingsPayload(payload);
            setCompanyName(extractCompanyName(allRaw));
        } catch (err) {
            setError(err.response?.data?.message ?? err.message ?? 'Failed to load company.');
            setCompanyName(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (enabled) {
            load();
        }
    }, [enabled, load]);

    return { companyName, loading, error, refetch: load };
}
