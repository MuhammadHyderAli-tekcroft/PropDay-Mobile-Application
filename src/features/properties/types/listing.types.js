/**
 * @typedef {Object} ListingBroker
 * @property {string} name
 * @property {string} phone
 * @property {string|null} image
 */

/**
 * @typedef {Object} PropertyListing
 * @property {string} id
 * @property {string} title
 * @property {string} location
 * @property {string} price
 * @property {number} beds
 * @property {number} baths
 * @property {number} sqft
 * @property {string|null} image
 * @property {string[]} images
 * @property {string} description
 * @property {string} propertyType
 * @property {string|null} license From meta.property_licence_type (e.g. Selective Licence)
 * @property {'Tenanted'|'Vacant'|'Part'} status
 * @property {number} rentAmount
 * @property {string|null} tenantName
 * @property {string|null} paidStatus
 * @property {ListingBroker} broker
 * @property {boolean} isRecommended
 */

/**
 * @typedef {Object} PropertyCategory
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 */

export {};
