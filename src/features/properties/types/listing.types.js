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
