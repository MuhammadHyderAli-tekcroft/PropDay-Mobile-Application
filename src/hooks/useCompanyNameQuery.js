import { useQuery } from '@tanstack/react-query';

import { fetchcurrentUser } from '../api/contactApi';
import { queryKeys } from '../lib/queryKeys';
import { extractCompanyName } from '../utils/companyName';

export function useCompanyNameQuery(enabled = true) {
    const query = useQuery({
        queryKey: queryKeys.companyName,
        queryFn: fetchcurrentUser,
        enabled,
        select: extractCompanyName,
        staleTime: 10 * 60 * 1000,
        placeholderData: (previousData) => previousData,
    });

    return {
        companyName: query.data ?? null,
        isPending: query.isPending,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
}
