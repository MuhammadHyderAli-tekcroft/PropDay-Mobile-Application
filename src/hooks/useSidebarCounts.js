import { useQueries } from '@tanstack/react-query';

import { fetchContacts } from '../api/contactApi';
import { fetchListings } from '../api/listingsApi';
import { fetchTasks } from '../api/tasksApi';
import { normalizeContactsPayload } from '../features/contacts/queries/normalizeContacts';
import { normalizeListingsPayload } from '../features/properties/queries/normalizeListings';
import { normalizeTasksPayload } from '../features/tasks/queries/normalizeTasks';
import { queryKeys } from '../lib/queryKeys';

export function useSidebarCounts(enabled) {
    const [listingsQuery, tasksQuery, contactsQuery] = useQueries({
        queries: [
            {
                queryKey: queryKeys.listings,
                queryFn: fetchListings,
                enabled,
                select: (payload) => normalizeListingsPayload(payload).total,
            },
            {
                queryKey: queryKeys.tasks,
                queryFn: fetchTasks,
                enabled,
                select: (payload) => {
                    const { total, urgentCount } = normalizeTasksPayload(payload);
                    return {
                        count: urgentCount > 0 ? urgentCount : total,
                        type: urgentCount > 0 ? 'alert' : 'normal',
                    };
                },
            },
            {
                queryKey: queryKeys.contacts,
                queryFn: fetchContacts,
                enabled,
                select: (payload) => normalizeContactsPayload(payload).total,
            },
        ],
    });

    return {
        properties: listingsQuery.data ?? null,
        tasks: tasksQuery.data ?? null,
        contacts: contactsQuery.data ?? null,
    };
}
