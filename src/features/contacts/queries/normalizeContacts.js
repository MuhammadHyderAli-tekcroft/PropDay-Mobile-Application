import { buildFilterOptions } from '../../../utils/buildFilterOptions';
import { extractArrayPayload, USER_PAYLOAD_KEYS } from '../../../utils/extractPayload';
import { mapContact } from '../utils/mapContact';

export function normalizeContactsPayload(payload) {
    const rawList = extractArrayPayload(payload, USER_PAYLOAD_KEYS);
    const contacts = rawList.map(mapContact).filter(Boolean);

    return {
        contacts,
        types: buildFilterOptions(contacts, (contact) => contact.type),
        total: payload?.meta?.total ?? contacts.length,
    };
}
