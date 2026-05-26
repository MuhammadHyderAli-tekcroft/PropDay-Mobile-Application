import { formatUserDisplayName } from '../../../utils/formatUserDisplayName';
import { resolveMediaUrl, resolveUserAvatar } from '../../../utils/resolveMediaUrl';

const CATEGORY_ICONS = {
    residential: 'home',
    commercial: 'storefront',
    'residential block': 'business',
    mixed: 'shapes',
    industrial: 'construct',
    land: 'map',
    water: 'water',
    farmland: 'leaf',
};

const ADDRESS_FIELDS = [
    'line_one',
    'line_two',
    'add_line_1',
    'add_line_2',
    'city',
    'county',
    'state_province',
    'postcode',
    'zip_postal_code',
    'country',
];

const MAIN_IMAGE_FLAGS = new Set([true, 'true', 1, '1']);

export function formatAddress(address) {
    if (!address) {
        return '';
    }

    return typeof address === 'string'
        ? address.trim()
        : typeof address !== 'object'
          ? String(address)
          : ADDRESS_FIELDS.map((field) => address[field])
                .filter((part) => part != null && String(part).trim() !== '')
                .join(', ');
}

export function toDisplayString(value, fallback = '') {
    if (value == null || value === '') {
        return fallback;
    }

    const valueType = typeof value;

    return valueType === 'string' || valueType === 'number' || valueType === 'boolean'
        ? String(value)
        : valueType === 'object'
          ? value.name != null
              ? String(value.name)
              : formatAddress(value) || fallback
          : fallback;
}

function isMainListingImage(customProperties) {
    return (
        customProperties &&
        typeof customProperties === 'object' &&
        MAIN_IMAGE_FLAGS.has(customProperties.is_main)
    );
}

export function pickMainImageFromImages(images) {
    if (!Array.isArray(images)) {
        return null;
    }

    const mainEntry = images.find(
        (item) => item && typeof item === 'object' && isMainListingImage(item.custom_properties)
    );

    if (!mainEntry || typeof mainEntry !== 'object') {
        return null;
    }

    const url =
        (typeof mainEntry.original_url === 'string' && mainEntry.original_url) ||
        (typeof mainEntry.preview_url === 'string' && mainEntry.preview_url) ||
        (typeof mainEntry.url === 'string' && mainEntry.url) ||
        null;

    return resolveMediaUrl(url);
}

export function parseRentAmount(value) {
    if (value == null || value === '') {
        return 0;
    }

    const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
    return Number.isNaN(numeric) ? 0 : numeric;
}

function formatPrice(value) {
    const numeric = parseRentAmount(value);
    return numeric === 0
        ? 'Price on request'
        : `£${numeric.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
}

function normalizeOccupancyStatus(raw, meta) {
    const statusValue = String(
        raw.occupancy_status ?? raw.occupancy ?? meta.occupancy_status ?? meta.occupancy ?? ''
    ).toLowerCase();

    if (statusValue.includes('vacant')) {
        return 'Vacant';
    }
    if (statusValue.includes('part')) {
        return 'Part';
    }
    if (statusValue.includes('tenant') || statusValue.includes('let')) {
        return 'Tenanted';
    }

    const tenant = raw.tenant ?? raw.current_tenant ?? raw.primary_tenant;
    if (tenant && typeof tenant === 'object') {
        return 'Tenanted';
    }

    const units = raw.units;
    if (Array.isArray(units) && units.length > 0) {
        const occupied = units.filter(
            (unit) =>
                unit &&
                (unit.tenant ||
                    unit.current_tenant ||
                    unit.is_occupied === true ||
                    unit.occupied === true)
        ).length;

        if (occupied === 0) {
            return 'Vacant';
        }
        if (occupied < units.length) {
            return 'Part';
        }
        return 'Tenanted';
    }

    if (raw.is_vacant === true || raw.vacant === true) {
        return 'Vacant';
    }
    if (raw.is_tenanted === true || raw.tenanted === true) {
        return 'Tenanted';
    }

    return 'Vacant';
}

function pickLicenseLabel(meta) {
    const value = meta.property_licence_type ?? meta.property_license_type;

    if (value == null || String(value).trim() === '') {
        return null;
    }

    return toDisplayString(value);
}

function pickTenantInfo(raw, rentAmount) {
    const tenant = raw.tenant ?? raw.current_tenant ?? raw.primary_tenant;
    if (!tenant || typeof tenant !== 'object') {
        return { tenantName: null, paidStatus: null };
    }

    const tenantName = formatUserDisplayName(tenant);
    const paymentStatus = String(
        raw.payment_status ?? tenant.payment_status ?? tenant.rent_status ?? ''
    ).toLowerCase();
    const paidFlag =
        raw.rent_paid === true ||
        tenant.rent_paid === true ||
        paymentStatus.includes('paid') ||
        paymentStatus.includes('complete');

    const paidStatus =
        paidFlag && rentAmount > 0 ? `£${rentAmount.toLocaleString('en-GB')} paid` : null;

    return { tenantName, paidStatus };
}

function pickPropertyImage(raw) {
    return pickMainImageFromImages(raw.images);
}

function pickMeta(raw, property) {
    const unitMeta = raw.meta && typeof raw.meta === 'object' && !Array.isArray(raw.meta) ? raw.meta : {};
    const propertyMeta =
        property?.meta && typeof property.meta === 'object' && !Array.isArray(property.meta)
            ? property.meta
            : {};
    return { ...propertyMeta, ...unitMeta };
}

function pickTypeName(raw, property) {
    const types = raw.types ?? property?.types;
    if (types?.name) {
        return String(types.name);
    }

    switch (raw.type) {
        case 'property':
            return 'Property';
        case 'unit':
            return 'Unit';
        default:
            return 'Home';
    }
}

export function isPropertyRecord(raw) {
    return String(raw?.type ?? '').toLowerCase() === 'property';
}

export function isParentPropertyRecord(raw) {
    if (!raw || typeof raw !== 'object') {
        return false;
    }

    const parentId = raw.parent_id;
    const isTopLevel = parentId == null || parentId === 0 || parentId === '';

    return isPropertyRecord(raw) && isTopLevel;
}

export function mapPropertyListing(raw) {
    const meta = pickMeta(raw, null);
    const image = pickPropertyImage(raw);
    const lettingAgent = raw.letting_agent;
    const agent = lettingAgent && typeof lettingAgent === 'object' ? lettingAgent : null;
    const rentValue = raw.rent ?? raw.monthly_payment;
    const rentAmount = parseRentAmount(rentValue);
    const propertyType = pickTypeName(raw, null);
    const status = normalizeOccupancyStatus(raw, meta);
    const license = pickLicenseLabel(meta);
    const { tenantName, paidStatus } = pickTenantInfo(raw, rentAmount);

    return {
        id: String(raw.id ?? ''),
        title: toDisplayString(raw.name ?? raw.title, 'Property'),
        location: formatAddress(raw.address ?? raw.location) || 'Address not available',
        price: formatPrice(rentValue),
        rentAmount,
        beds: Number(meta.bedrooms ?? meta.beds ?? 0) || 0,
        baths: Number(meta.bathrooms ?? meta.baths ?? 0) || 0,
        sqft: Number(meta.sqft ?? meta.square_feet ?? meta.size ?? 0) || 0,
        image,
        images: image ? [image] : [],
        description: toDisplayString(raw.description ?? raw.details, ''),
        propertyType,
        license,
        status,
        tenantName,
        paidStatus,
        broker: {
            name: formatUserDisplayName(agent),
            phone: toDisplayString(
                agent?.phone_work ?? agent?.mobile ?? agent?.phone_home ?? '',
                ''
            ),
            image: resolveUserAvatar(agent),
        },
        isRecommended: true,
    };
}

export function mapListing(raw) {
    return mapPropertyListing(raw);
}

export function splitListings(listings) {
    return {
        recommended: listings,
        nearby: listings,
    };
}

export function getCategoryIcon(typeName) {
    return CATEGORY_ICONS[String(typeName ?? '').toLowerCase()] ?? 'business-outline';
}

