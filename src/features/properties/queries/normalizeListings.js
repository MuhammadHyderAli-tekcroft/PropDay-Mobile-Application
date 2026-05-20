import { buildFilterOptions, enrichCategoryFilterOptions } from '../../../utils/buildFilterOptions';
import { extractArrayPayload, LIST_PAYLOAD_KEYS } from '../../../utils/extractPayload';
import {
    getCategoryIcon,
    isPropertyRecord,
    mapPropertyListing,
    splitListings,
} from '../utils/mapListing';

export function normalizeListingsPayload(payload) {
    const allRaw = extractArrayPayload(payload, LIST_PAYLOAD_KEYS);
    const rawList = allRaw.filter(isPropertyRecord);
    const listings = rawList.map(mapPropertyListing).filter((item) => item.id);
    const sections = splitListings(listings);

    return {
        listings,
        recommended: sections.recommended,
        nearby: sections.nearby,
        categories: enrichCategoryFilterOptions(
            buildFilterOptions(listings, (item) => item.propertyType),
            getCategoryIcon
        ),
    };
}
