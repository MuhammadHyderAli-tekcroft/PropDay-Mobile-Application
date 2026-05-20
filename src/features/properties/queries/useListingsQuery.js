import { useQuery } from '@tanstack/react-query';

import { fetchListings } from '../../../api/listingsApi';
import { queryKeys } from '../../../lib/queryKeys';
import { normalizeListingsPayload } from './normalizeListings';

export function useListingsQuery(enabled = true) {
    const query = useQuery({
        queryKey: queryKeys.listings,
        queryFn: fetchListings,
        enabled,
        select: normalizeListingsPayload,
        placeholderData: (previousData) => previousData,
    });

    return {
        listings: query.data?.listings ?? [],
        recommended: query.data?.recommended ?? [],
        nearby: query.data?.nearby ?? [],
        categories: query.data?.categories ?? [],
        isPending: query.isPending,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
}
