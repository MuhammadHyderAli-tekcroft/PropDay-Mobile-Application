export function formatUserDisplayName(user, { includeTitle = false, fallback = '' } = {}) {
    if (!user || typeof user !== 'object') {
        return fallback;
    }

    if (user.fullName) {
        return String(user.fullName).trim();
    }

    const parts = includeTitle
        ? [user.userTitle, user.name, user.meta?.last_name]
        : [user.name, user.meta?.last_name];

    const joined = parts.filter(Boolean).join(' ').trim();
    return joined || user.name || fallback;
}
