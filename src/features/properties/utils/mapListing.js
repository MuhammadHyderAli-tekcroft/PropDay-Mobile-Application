import { API_ORIGIN } from '../../../services/config';

const CATEGORY_ICONS = {
    'residential': 'home',
    'commercial': 'storefront',
    'residential block': 'business',
    'mixed': 'shapes',
    'industrial': 'construct',
    'land': 'map',
    'water': 'water',
    'farmland': 'leaf',
};

export function formatAddress(address) {
    if (!address) {
        return '';
    }
    if (typeof address === 'string') {
        return address.trim();
    }
    if (typeof address !== 'object') {
        return String(address);
    }

    const record = (address);
    const parts = [
        record.line_one,
        record.line_two,
        record.add_line_1,
        record.add_line_2,
        record.city,
        record.county,
        record.state_province,
        record.postcode,
        record.zip_postal_code,
        record.country,
    ].filter((part) => part != null && String(part).trim() !== '');

    return parts.join(', ');
}

export function toDisplayString(value, fallback = '') {
    if (value == null || value === '') {
        return fallback;
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    if (typeof value === 'object') {
        const record = (value);
        if (record.name != null) {
            return String(record.name);
        }
        const formatted = formatAddress(value);
        return formatted || fallback;
    }
    return fallback;
}

function formatPersonName(person) {
    if (!person || typeof person !== 'object') {
        return '';
    }
    const record = (person);
    const meta = record.meta && typeof record.meta === 'object' ? record.meta : {};
    const lastName =
        meta && typeof meta === 'object' && 'last_name' in meta ? meta.last_name : '';
    return [record.name, lastName].filter(Boolean).join(' ').trim();
}

export function resolveImageUrl(url) {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const trimmed = url.trim();
    if (!trimmed) {
        return null;
    }

    let path = trimmed;

    const protocolMatch = trimmed.match(/^https?:\/\/[^/]+(\/.*)?$/i);
    if (protocolMatch) {
        path = protocolMatch[1] ?? '/';
    } else {
        const hostPathMatch = trimmed.match(/^[\w.-]+:\d+(\/.*)$/);
        if (hostPathMatch) {
            path = hostPathMatch[1];
        }
    }

    if (!path.startsWith('/')) {
        path = `/${path}`;
    }

    return `${API_ORIGIN}${path}`;
}
function isMainListingImage(customProperties) {
    if (!customProperties || typeof customProperties !== 'object') {
        return false;
    }
    const record = (customProperties);
    const isMain = record.is_main;
    return isMain === true || isMain === 'true' || isMain === 1 || isMain === '1';
}

export function pickMainImageFromImages(images) {
    if (!Array.isArray(images)) {
        return null;
    }

    const mainEntry = images.find((item) => {
        if (!item || typeof item !== 'object') {
            return false;
        }
        const record = (item);
        return isMainListingImage(record.custom_properties);
    });

    if (!mainEntry || typeof mainEntry !== 'object') {
        return null;
    }

    const record = (mainEntry);
    const url =
        (typeof record.original_url === 'string' && record.original_url) ||
        (typeof record.preview_url === 'string' && record.preview_url) ||
        (typeof record.url === 'string' && record.url) ||
        null;

    return resolveImageUrl(url);
}

function formatPrice(value) {
    if (value == null || value === '') {
        return 'Price on request';
    }
    const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
    if (Number.isNaN(numeric) || numeric === 0) {
        return 'Price on request';
    }
    return `£${numeric.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`;
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
    if (types && typeof types === 'object' && types.name) {
        return String(types.name);
    }
    if (raw.type === 'property') {
        return 'Property';
    }
    if (raw.type === 'unit') {
        return 'Unit';
    }
    return 'Home';
}

export function isPropertyRecord(raw) {
    return raw?.type === 'property';
}

export function mapPropertyListing(raw) {
    const meta = pickMeta(raw, null);
    const image = pickPropertyImage(raw);
    const images = image ? [image] : [];

    const lettingAgent = raw.letting_agent;
    const agent =
        lettingAgent && typeof lettingAgent === 'object'
            ? (lettingAgent)
            : null;

    const rentValue = raw.rent ?? raw.monthly_payment;
    const addressSource = raw.address ?? raw.location;

    const location = formatAddress(addressSource) || 'Address not available';
    const title = toDisplayString(raw.name ?? raw.title, 'Property');
    const propertyType = pickTypeName(raw, null);

    const beds = Number(meta.bedrooms ?? meta.beds ?? 0) || 0;
    const baths = Number(meta.bathrooms ?? meta.baths ?? 0) || 0;
    const sqft = Number(meta.sqft ?? meta.square_feet ?? meta.size ?? 0) || 0;

    return {
        id: String(raw.id ?? ''),
        title,
        location,
        price: formatPrice(rentValue),
        beds,
        baths,
        sqft,
        image,
        images,
        description: toDisplayString(raw.description ?? raw.details, ''),
        propertyType,
        broker: {
            name: formatPersonName(agent),
            phone: toDisplayString(
                agent?.phone_work ?? agent?.mobile ?? agent?.phone_home ?? '',
                ''
            ),
            image: resolveImageUrl(
                typeof agent?.avatar_url === 'string' ? agent.avatar_url : null
            ),
        },
        isRecommended: true,
    };
}

export function mapListing(raw) {
    return mapPropertyListing(raw);
}

export function extractListingPayload(payload) {
    if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        return payload.data;
    }
    if (payload?.listing && typeof payload.listing === 'object') {
        return payload.listing;
    }
    return payload;
}

export function splitListings(listings) {
    return {
        recommended: listings,
        nearby: listings,
    };
}

export function getCategoryIcon(typeName) {
    const key = String(typeName ?? '').toLowerCase();
    return CATEGORY_ICONS[key] ?? 'business-outline';
}

export function buildCategoriesFromListings(listings) {
    const types = [...new Set(listings.map((item) => item.propertyType).filter(Boolean))];

    return [
        { id: 'all', name: 'All', icon: 'business' },
        ...types.map((name, index) => ({
            id: String(index + 1),
            name,
            icon: getCategoryIcon(name),
        })),
    ];
}
