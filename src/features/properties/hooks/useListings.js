import { useCallback, useEffect, useState } from 'react';

import { fetchListings } from '../../../api/listingsApi';
import { buildFilterOptions, enrichCategoryFilterOptions } from '../../../utils/buildFilterOptions';
import { extractArrayPayload, LIST_PAYLOAD_KEYS } from '../../../utils/extractPayload';
import { getApiErrorMessage } from '../../../utils/getApiErrorMessage';
import {
    getCategoryIcon,
    isPropertyRecord,
    mapPropertyListing,
    splitListings,
} from '../utils/mapListing';

export function useListings(enabled = true) {
    const [listings, setListings] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [nearby, setNearby] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = await fetchListings();
            const allRaw = extractArrayPayload(payload, LIST_PAYLOAD_KEYS);
            const rawList = allRaw.filter(isPropertyRecord);
            const mapped = rawList.map(mapPropertyListing).filter((item) => item.id);
            const sections = splitListings(mapped);

            setListings(mapped);
            setRecommended(sections.recommended);
            setNearby(sections.nearby);
            setCategories(
                enrichCategoryFilterOptions(
                    buildFilterOptions(mapped, (item) => item.propertyType),
                    getCategoryIcon
                )
            );
        } catch (err) {
            setError(getApiErrorMessage(err, 'Failed to load properties.'));
            setListings([]);
            setRecommended([]);
            setNearby([]);
            setCategories([]);
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
        loading,
        error,
        refetch: load,
    };
}
