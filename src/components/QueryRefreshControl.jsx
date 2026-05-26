import { RefreshControl } from 'react-native';

import { useQueryRefresh } from '../hooks/useQueryRefresh';

export default function QueryRefreshControl({ refetch, isRefetching = false, ...props }) {
    const { refreshing, onRefresh } = useQueryRefresh(refetch, isRefetching);

    return (
        <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#111"
            colors={['#111']}
            progressBackgroundColor="#FFFFFF"
            {...props}
        />
    );
}
