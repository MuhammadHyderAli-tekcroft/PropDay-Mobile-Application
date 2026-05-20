import { fetchcurrentUser } from '../api/contactApi';
import { unwrapPayloadData } from './extractPayload';

/** Reads company.name from current-user payload, a user object, or a list of users. */
export function extractCompanyName(source) {
    if (!source) {
        return null;
    }

    if (Array.isArray(source)) {
        const name = source.find((item) => item?.company?.name)?.company?.name;
        return name ? String(name) : null;
    }

    const user = unwrapPayloadData(source);
    if (user?.company?.name) {
        return String(user.company.name);
    }

    return source?.company?.name ? String(source.company.name) : null;
}

let cachedCompanyName = null;
let pendingRequest = null;

export function clearCompanyNameCache() {
    cachedCompanyName = null;
    pendingRequest = null;
}

/** Single API source for company name across all modules (cached). */
export async function fetchCompanyName() {
    if (cachedCompanyName) {
        return cachedCompanyName;
    }

    if (!pendingRequest) {
        pendingRequest = fetchcurrentUser()
            .then((payload) => extractCompanyName(payload))
            .then((name) => {
                if (name) {
                    cachedCompanyName = name;
                }
                return name;
            })
            .finally(() => {
                pendingRequest = null;
            });
    }

    return pendingRequest;
}
