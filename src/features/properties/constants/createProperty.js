export const CREATE_PROPERTY_TOTAL_STEPS = 6;

export const CREATE_PROPERTY_STEPS = [
    { id: 1, title: 'Where is the property?', subtitle: 'Postcode, address & area' },
    { id: 2, title: 'What type is it?', subtitle: 'License & regulation' },
    { id: 3, title: 'Specs', subtitle: 'Unit information' },
    { id: 4, title: 'Current status', subtitle: 'Is it tenanted?' },
    { id: 5, title: 'Media', subtitle: 'Photos and documents' },
];

export const DEFAULT_PROPERTY_COUNTRY = 'United Kingdom';

export const PROPERTY_LICENSE_OPTIONS = [
    { id: 'selective-license', label: 'Selective License' },
    { id: 'hmo-license', label: 'HMO License' },
];

function buildCountOptions(max, start = 0) {
    return Array.from({ length: max - start + 1 }, (_, index) => {
        const value = String(start + index);
        return { id: value, label: value };
    });
}

const COUNCIL_TAX_BAND_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((band) => ({
    id: `band-${band.toLowerCase()}`,
    label: band,
}));

export const SPECS_PICKER_CONFIG = {
    maxOccupancy: {
        title: 'Maximum Occupancy',
        options: buildCountOptions(15, 1),
        formValueKey: 'maxOccupancy',
        formIdKey: 'maxOccupancyId',
    },
    bedrooms: {
        title: 'Bedrooms',
        options: buildCountOptions(10, 0),
        formValueKey: 'bedrooms',
        formIdKey: 'bedroomsId',
    },
    bathrooms: {
        title: 'Bathrooms',
        options: buildCountOptions(10, 0),
        formValueKey: 'bathrooms',
        formIdKey: 'bathroomsId',
    },
    reception: {
        title: 'Reception',
        options: buildCountOptions(10, 0),
        formValueKey: 'reception',
        formIdKey: 'receptionId',
    },
    councilTaxBanding: {
        title: 'Council Tax Banding',
        options: COUNCIL_TAX_BAND_OPTIONS,
        formValueKey: 'councilTaxBanding',
        formIdKey: 'councilTaxBandingId',
    },
};

export const ADDRESS_FIELD_ROWS = [
    [
        { key: 'postcode', label: 'Postcode', placeholder: 'e.g. 60000' },
        { key: 'addressLine1', label: 'Address line 1', placeholder: 'Street address' },
    ],
    [
        { key: 'addressLine2', label: 'Address line 2', placeholder: 'Optional' },
        { key: 'country', label: 'Country', placeholder: 'Country', required: true },
    ],
    [
        { key: 'countyCouncil', label: 'County/Council', placeholder: 'e.g. 3B' },
        { key: 'city', label: 'City', placeholder: 'e.g. Canning Town' },
    ],
];

export const SPECS_FIELD_ROWS = [
    [
        { key: 'maxOccupancy', label: 'Maximum Occupancy' },
        { key: 'bedrooms', label: 'Bedrooms' },
    ],
    [
        { key: 'bathrooms', label: 'Bathrooms' },
        { key: 'reception', label: 'Reception' },
    ],
    [{ key: 'councilTaxBanding', label: 'Council Tax Banding' }],
];
