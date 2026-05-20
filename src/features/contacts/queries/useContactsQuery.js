import { useQuery } from '@tanstack/react-query';

import { fetchContacts } from '../../../api/contactApi';
import { queryKeys } from '../../../lib/queryKeys';
import { normalizeContactsPayload } from './normalizeContacts';

export function useContactsQuery(enabled = true) {
    const query = useQuery({
        queryKey: queryKeys.contacts,
        queryFn: fetchContacts,
        enabled,
        select: normalizeContactsPayload,
        placeholderData: (previousData) => previousData,
    });

    return {
        contacts: query.data?.contacts ?? [],
        types: query.data?.types ?? [{ id: 'all', name: 'All' }],
        total: query.data?.total ?? 0,
        isPending: query.isPending,
        isFetching: query.isFetching,
        error: query.error,
        refetch: query.refetch,
    };
}
