/**
 * @param {unknown[]} rawList
 * @returns {string|null}
 */
export function extractCompanyName(rawList) {
    for (const raw of rawList) {
        if (!raw || typeof raw !== 'object') {
            continue;
        }
        const record = /** @type {Record<string, unknown>} */ (raw);
        const company = record.company;
        if (company && typeof company === 'object' && company !== null && 'name' in company) {
            const name = /** @type {{ name?: string }} */ (company).name;
            if (name) {
                return String(name);
            }
        }
    }
    return null;
}
