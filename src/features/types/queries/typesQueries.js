import { useQuery } from '@tanstack/react-query';

import { fetchAllAdminTypes } from '../../../api/typesApi';
import { queryKeys } from '../../../lib/queryKeys';
import { buildTypeCategoryTabs } from '../utils/typeListUtils';

function mapAdminType(raw) {
    if (!raw || typeof raw !== 'object') {
        return null;
    }

    const id = raw.id ?? raw.type_id;
    if (id == null) {
        return null;
    }

    const name = String(raw.name ?? raw.title ?? raw.label ?? '').trim() || `Type ${id}`;
    const typeSlug = String(raw.type ?? raw.category ?? raw.kind ?? '')
        .trim()
        .toLowerCase();

    return {
        id: String(id),
        name,
        type: typeSlug || 'unknown',
        typeId: raw.type_id != null ? String(raw.type_id) : null,
        description: raw.description != null ? String(raw.description).trim() || null : null,
        slug: raw.slug != null ? String(raw.slug).trim() || null : null,
        parentId: raw.parent_id != null ? String(raw.parent_id) : null,
    };
}

function normalizeTypesPayload(rawList) {
    const types = (Array.isArray(rawList) ? rawList : []).map(mapAdminType).filter(Boolean);

    return {
        types,
        categories: buildTypeCategoryTabs(types),
        total: types.length,
    };
}

export function useTypesQuery(enabled = true) {
    const query = useQuery({
        queryKey: queryKeys.types,
        queryFn: fetchAllAdminTypes,
        enabled,
        select: normalizeTypesPayload,
        placeholderData: (previousData) => previousData,
    });

    return {
        types: query.data?.types ?? [],
        categories: query.data?.categories ?? [],
        total: query.data?.total ?? 0,
        isPending: query.isPending,
        isFetching: query.isFetching,
        isRefetching: query.isRefetching,
        error: query.error,
        refetch: query.refetch,
    };
}
