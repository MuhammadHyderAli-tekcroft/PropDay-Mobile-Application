import { buildFilterOptions, enrichCategoryFilterOptions } from '../../../utils/buildFilterOptions';
import { extractArrayPayload, extractObjectPayload, LIST_PAYLOAD_KEYS } from '../../../utils/extractPayload';
import {
    buildStatusFilterOptions,
    buildTypeFilterOptions,
    computeListingSummary,
} from '../utils/propertyListUtils';
import {
    getCategoryIcon,
    isParentPropertyRecord,
    mapPropertyListing,
    splitListings,
} from '../utils/mapListing';

export function normalizeListingPayload(payload) {
    const raw = extractObjectPayload(payload);
    return mapPropertyListing(raw);
}

export function normalizeListingsPayload(payload) {
    const allRaw = extractArrayPayload(payload, LIST_PAYLOAD_KEYS);
    const rawList = allRaw.filter(isParentPropertyRecord);
    const listingsFromParents = rawList.map(mapPropertyListing).filter((item) => item.id);

    const listings =
        listingsFromParents.length > 0
            ? listingsFromParents
            : allRaw
                  .filter((raw) => raw && typeof raw === 'object' && (raw.name || raw.title))
                  .map(mapPropertyListing)
                  .filter((item) => item.id);
    const sections = splitListings(listings);

    const summary = computeListingSummary(listings);

    return {
        listings,
        total: listings.length,
        summary,
        statusFilters: buildStatusFilterOptions(listings),
        typeFilters: buildTypeFilterOptions(listings),
        recommended: sections.recommended,
        nearby: sections.nearby,
        categories: enrichCategoryFilterOptions(
            buildFilterOptions(listings, (item) => item.propertyType),
            getCategoryIcon
        ),
    };
}
