import { useCallback, useState } from 'react';

export function useQueryRefresh(refetch, isRefetching = false) {
    const [isPullRefreshing, setIsPullRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setIsPullRefreshing(true);
        try {
            await refetch();
        } finally {
            setIsPullRefreshing(false);
        }
    }, [refetch]);

    return {
        refreshing: isPullRefreshing || isRefetching,
        onRefresh,
    };
}
