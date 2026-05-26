import api from '../services/api';
import { extractArrayPayload, LIST_PAYLOAD_KEYS } from '../utils/extractPayload';

const TYPES_LIST_KEYS = [...LIST_PAYLOAD_KEYS, 'types'];

function getLastPage(payload) {
    const meta = payload?.meta ?? payload;
    const last =
        meta?.last_page ??
        meta?.lastPage ??
        meta?.pagination?.last_page ??
        meta?.pagination?.lastPage;

    const parsed = Number(last);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export async function fetchAdminTypesPage(page = 1) {
    const response = await api.get('/admin/types', { params: { page } });
    return response.data;
}

const MAX_TYPE_PAGES = 100;

/** Fetches every page from `/admin/types` and returns a flat array of raw records. */
export async function fetchAllAdminTypes() {
    const collected = [];
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage && page <= MAX_TYPE_PAGES) {
        const payload = await fetchAdminTypesPage(page);
        const pageItems = extractArrayPayload(payload, TYPES_LIST_KEYS);

        collected.push(...pageItems);
        lastPage = getLastPage(payload);

        if (pageItems.length === 0 && page >= lastPage) {
            break;
        }

        page += 1;
    }

    return collected;
}
