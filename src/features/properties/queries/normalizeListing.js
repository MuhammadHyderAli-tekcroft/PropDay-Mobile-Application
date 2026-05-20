import { extractObjectPayload } from '../../../utils/extractPayload';
import { mapListing } from '../utils/mapListing';

export function normalizeListingPayload(payload) {
    const raw = extractObjectPayload(payload);
    return mapListing(raw);
}
