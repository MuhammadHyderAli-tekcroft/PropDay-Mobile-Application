export const TYPE_CATEGORY_PROPERTY = 'property';

/** @param {string} slug */
export function formatTypeCategoryLabel(slug) {
    if (!slug || slug === 'unknown') {
        return 'Unknown';
    }

    return slug
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

/** @param {Array<{ type?: string }>} types */
export function buildTypeCategoryTabs(types) {
    const counts = new Map();

    for (const item of types) {
        const slug = item.type || 'unknown';
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }

    return [...counts.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([slug, count]) => ({
            id: slug,
            slug,
            label: formatTypeCategoryLabel(slug),
            count,
        }));
}

/** @param {Array<{ type?: string }>} types */
export function selectPropertyTypes(types) {
    return filterTypesByCategory(types, TYPE_CATEGORY_PROPERTY);
}

/** @param {Array<{ type?: string }>} types @param {string} categorySlug */
export function filterTypesByCategory(types, categorySlug) {
    if (!categorySlug) {
        return types;
    }

    const normalized = categorySlug.toLowerCase();
    return types.filter((item) => item.type === normalized);
}

/** @param {Array<{ slug: string }>} categories */
export function pickDefaultCategorySlug(categories) {
    return categories[0]?.slug ?? null;
}
