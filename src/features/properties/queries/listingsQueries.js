import { useQuery } from '@tanstack/react-query';

import { fetchListingById, fetchListings } from '../../../api/listingsApi';
import { queryKeys } from '../../../lib/queryKeys';
import { normalizeListingPayload, normalizeListingsPayload } from './normalizeListings';

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
        total: query.data?.total ?? 0,
        summary: query.data?.summary ?? {
            tenanted: 0,
            vacant: 0,
            part: 0,
            potentialMonthly: '£0',
        },
        statusFilters: query.data?.statusFilters ?? [],
        typeFilters: query.data?.typeFilters ?? [],
        recommended: query.data?.recommended ?? [],
        nearby: query.data?.nearby ?? [],
        categories: query.data?.categories ?? [],
        isPending: query.isPending,
        isFetching: query.isFetching,
        isRefetching: query.isRefetching,
        error: query.error,
        refetch: query.refetch,
    };
}

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
        isRefetching: query.isRefetching,
        error: query.error,
        refetch: query.refetch,
    };
}
