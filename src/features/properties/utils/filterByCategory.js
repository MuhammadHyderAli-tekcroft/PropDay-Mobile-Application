/**
 * @param {import('../types/listing.types').PropertyListing[]} listings
 * @param {string|null|undefined} activeCategory
 */
export function filterByCategory(listings, activeCategory) {
    if (!activeCategory || activeCategory === 'All') {
        return listings;
    }
    return listings.filter((item) => item.propertyType === activeCategory);
}
