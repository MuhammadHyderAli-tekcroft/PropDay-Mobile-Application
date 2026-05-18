import { useCallback, useEffect, useState } from 'react';

import { fetchListings } from '../../../api/listingsApi';
import { extractCompanyName } from '../../../utils/extractCompanyName';
import { extractListingsPayload } from '../../../utils/extractListingsPayload';
import {
    buildCategoriesFromListings,
    isPropertyRecord,
    mapPropertyListing,
    splitListings,
} from '../utils/mapListing';

export function useListings(enabled = true) {
    const [listings, setListings] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [nearby, setNearby] = useState([]);
    const [categories, setCategories] = useState([]);
    const [companyName, setCompanyName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = await fetchListings();
            const allRaw = extractListingsPayload(payload);
            const rawList = allRaw.filter(isPropertyRecord);
            const mapped = rawList.map(mapPropertyListing).filter((item) => item.id);
            const sections = splitListings(mapped);

            setListings(mapped);
            setRecommended(sections.recommended);
            setNearby(sections.nearby);
            setCategories(buildCategoriesFromListings(mapped));
            setCompanyName(extractCompanyName(allRaw));
        } catch (err) {
            setError(err.response?.data?.message ?? err.message ?? 'Failed to load properties.');
            setListings([]);
            setRecommended([]);
            setNearby([]);
            setCategories([]);
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

    return {
        listings,
        recommended,
        nearby,
        categories,
        companyName,
        loading,
        error,
        refetch: load,
    };
}
