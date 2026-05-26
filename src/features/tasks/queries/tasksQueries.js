import { useQuery } from '@tanstack/react-query';

import { fetchTasks } from '../../../api/tasksApi';
import { queryKeys } from '../../../lib/queryKeys';
import { normalizeTasksPayload } from './normalizeTasks';

export function useTasksQuery(enabled = true) {
    const query = useQuery({
        queryKey: queryKeys.tasks,
        queryFn: fetchTasks,
        enabled,
        select: normalizeTasksPayload,
        placeholderData: (previousData) => previousData,
    });

    return {
        tasks: query.data?.tasks ?? [],
        total: query.data?.total ?? 0,
        urgentCount: query.data?.urgentCount ?? 0,
        activeCount: query.data?.activeCount ?? 0,
        isPending: query.isPending,
        isRefetching: query.isRefetching,
        error: query.error,
        refetch: query.refetch,
    };
}
