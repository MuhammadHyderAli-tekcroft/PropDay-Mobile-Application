import { useCallback, useEffect, useState } from 'react';

import { fetchCompanyName } from '../utils/companyName';
import { getApiErrorMessage } from '../utils/getApiErrorMessage';

export function useCompanyName(enabled = true) {
    const [companyName, setCompanyName] = useState(null);
    const [loading, setLoading] = useState(Boolean(enabled));
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setCompanyName(await fetchCompanyName());
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to load company.'));
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
