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

function formatPrice(value) {
    if (value == null || value === '') {
        return 'Price on request';
    }

    const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
    return Number.isNaN(numeric) || numeric === 0
        ? 'Price on request'
        : `£${numeric.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
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
    return raw?.type === 'property';
}

export function mapPropertyListing(raw) {
    const meta = pickMeta(raw, null);
    const image = pickPropertyImage(raw);
    const lettingAgent = raw.letting_agent;
    const agent = lettingAgent && typeof lettingAgent === 'object' ? lettingAgent : null;
    const rentValue = raw.rent ?? raw.monthly_payment;

    return {
        id: String(raw.id ?? ''),
        title: toDisplayString(raw.name ?? raw.title, 'Property'),
        location: formatAddress(raw.address ?? raw.location) || 'Address not available',
        price: formatPrice(rentValue),
        beds: Number(meta.bedrooms ?? meta.beds ?? 0) || 0,
        baths: Number(meta.bathrooms ?? meta.baths ?? 0) || 0,
        sqft: Number(meta.sqft ?? meta.square_feet ?? meta.size ?? 0) || 0,
        image,
        images: image ? [image] : [],
        description: toDisplayString(raw.description ?? raw.details, ''),
        propertyType: pickTypeName(raw, null),
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

