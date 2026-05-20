export const LIST_PAYLOAD_KEYS = ['data', 'listings', 'results'];
export const USER_PAYLOAD_KEYS = ['data'];
export const LISTING_OBJECT_KEYS = ['data', 'listing'];

export function extractArrayPayload(payload, keys = LIST_PAYLOAD_KEYS) {
    if (Array.isArray(payload)) {
        return payload;
    }

    for (const key of keys) {
        const value = payload?.[key];
        if (Array.isArray(value)) {
            return value;
        }
    }

    return [];
}

export function extractObjectPayload(payload, keys = LISTING_OBJECT_KEYS) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        return null;
    }

    for (const key of keys) {
        const value = payload[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            return value;
        }
    }

    return payload;
}

export function unwrapPayloadData(payload) {
    return payload?.data ?? payload;
}
