import { ALL_TYPES_LABEL, STATUS_FILTER_ORDER } from '../constants/propertyListFilters';

export function isAllTypesFilter(activeType) {
    const normalized = String(activeType ?? '')
        .trim()
        .toLowerCase();
    return normalized === 'all types' || normalized === 'all';
}

export function formatCompactGbp(amount) {
    if (!amount || amount <= 0) {
        return '£0';
    }

    if (amount >= 1000) {
        const value = amount / 1000;
        const formatted = value >= 10 ? value.toFixed(0) : value.toFixed(1);
        return `£${formatted}k`;
    }

    return `£${Math.round(amount).toLocaleString('en-GB')}`;
}

export function computeListingSummary(listings) {
    const tenanted = listings.filter((item) => item.status === 'Tenanted').length;
    const vacant = listings.filter((item) => item.status === 'Vacant').length;
    const part = listings.filter((item) => item.status === 'Part').length;
    const potentialMonthly = formatCompactGbp(
        listings.reduce((sum, item) => sum + (item.rentAmount || 0), 0)
    );

    return { tenanted, vacant, part, potentialMonthly };
}

export function buildSummarySubtitle(summary) {
    const parts = [`${summary.tenanted} tenanted`, `${summary.vacant} vacant`];

    if (summary.part > 0) {
        parts.splice(1, 0, `${summary.part} part`);
    }

    parts.push(`${summary.potentialMonthly} potential/mo`);
    return parts.join(' · ');
}

export function buildStatusFilterOptions(listings) {
    const counts = {
        All: listings.length,
        Tenanted: 0,
        Part: 0,
        Vacant: 0,
    };

    listings.forEach((item) => {
        if (counts[item.status] != null) {
            counts[item.status] += 1;
        }
    });

    return STATUS_FILTER_ORDER.map((name) => ({
        id: name,
        name,
        count: counts[name],
    }));
}

export function buildTypeFilterOptions(listings) {
    const counts = {};

    listings.forEach((item) => {
        const key = item.propertyType || 'Property';
        counts[key] = (counts[key] || 0) + 1;
    });

    const names = Object.keys(counts).sort((a, b) => a.localeCompare(b));

    return [
        { id: 'all-types', name: ALL_TYPES_LABEL, count: listings.length },
        ...names.map((name) => ({ id: name, name, count: counts[name] })),
    ];
}

export function filterPropertyListings(listings, activeStatus, activeType) {
    let result = listings;

    if (activeStatus && activeStatus !== 'All') {
        result = result.filter((item) => item.status === activeStatus);
    }

    if (activeType && !isAllTypesFilter(activeType)) {
        result = result.filter(
            (item) => (item.propertyType || item.license) === activeType
        );
    }

    return result;
}

export function formatSqft(sqft) {
    const value = Number(sqft) || 0;
    return value > 0 ? `${value.toLocaleString('en-GB')} ft²` : '';
}
