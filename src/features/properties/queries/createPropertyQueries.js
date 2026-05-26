import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchAdminAreas } from '../../../api/areasApi';
import { queryKeys } from '../../../lib/queryKeys';
import { useTypesQuery } from '../../types/queries/typesQueries';
import { selectPropertyTypes } from '../../types/utils/typeListUtils';

/** Lookups for create-property wizard only (types + areas). */
export function useCreatePropertyLookups(enabled = true) {
    const { types, isPending: propertyTypesLoading } = useTypesQuery(enabled);

    const areasQuery = useQuery({
        queryKey: queryKeys.areasForCreate,
        queryFn: fetchAdminAreas,
        enabled,
        placeholderData: (previous) => previous,
    });

    const propertyTypes = useMemo(() => selectPropertyTypes(types), [types]);

    return {
        propertyTypes,
        propertyTypesLoading,
        areas: areasQuery.data ?? [],
        areasLoading: areasQuery.isPending,
    };
}
