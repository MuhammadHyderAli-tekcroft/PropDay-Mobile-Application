import { useCallback, useEffect, useState } from 'react';

import { fetchContacts } from '../../../api/contactApi';
import { buildFilterOptions } from '../../../utils/buildFilterOptions';
import { extractArrayPayload, USER_PAYLOAD_KEYS } from '../../../utils/extractPayload';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import { mapContact } from '../utils/mapContact';

export function useContacts(enabled = true) {
    const [contacts, setContacts] = useState([]);
    const [types, setTypes] = useState([{ id: 'all', name: 'All' }]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = await fetchContacts();
            const rawList = extractArrayPayload(payload, USER_PAYLOAD_KEYS);
            const mapped = rawList.map(mapContact).filter(Boolean);

            setContacts(mapped);
            setTypes(buildFilterOptions(mapped, (contact) => contact.type));
            setTotal(payload?.meta?.total ?? mapped.length);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to load contacts.'));
            setContacts([]);
            setTypes([{ id: 'all', name: 'All' }]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (enabled) {
            load();
        }
    }, [enabled, load]);

    return {
        contacts,
        types,
        total,
        loading,
        error,
        refetch: load,
    };
}
