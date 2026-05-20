import { unwrapPayloadData } from './extractPayload';

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
