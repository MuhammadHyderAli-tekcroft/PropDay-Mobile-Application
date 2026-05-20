import { useQuery } from '@tanstack/react-query';

import { fetchListingById } from '../../../api/listingsApi';
import { queryKeys } from '../../../lib/queryKeys';
import { normalizeListingPayload } from './normalizeListing';

export function useListingQuery(id, enabled = true) {
    const query = useQuery({
        queryKey: queryKeys.listing(id),
        queryFn: () => fetchListingById(id),
        enabled: enabled && Boolean(id),
        select: normalizeListingPayload,
        placeholderData: (previousData) => previousData,
    });

    return {
        listing: query.data ?? null,
        isPending: query.isPending,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
}
