import { API_ORIGIN } from '../services/config';

/** Single resolver for API-hosted images and avatars (localhost host, missing protocol). */
export function resolveMediaUrl(url) {
    if (!url || typeof url !== 'string') {
        return null;
    }

    let trimmed = url.trim();
    if (!trimmed) {
        return null;
    }

    trimmed = trimmed.replace(/^https?:\/\/127\.0\.0\.1:8000/i, API_ORIGIN);
    trimmed = trimmed.startsWith('127.0.0.1:8000')
        ? `${API_ORIGIN}${trimmed.slice('127.0.0.1:8000'.length)}`
        : trimmed;

    if (/^https?:\/\//i.test(trimmed) && trimmed.startsWith(API_ORIGIN)) {
        return trimmed;
    }

    const protocolMatch = trimmed.match(/^https?:\/\/[^/]+(\/.*)?$/i);
    const hostPathMatch = trimmed.match(/^[\w.-]+:\d+(\/.*)$/);

    const path = protocolMatch
        ? protocolMatch[1] ?? '/'
        : hostPathMatch
          ? hostPathMatch[1]
          : trimmed.startsWith('/')
            ? trimmed
            : `/${trimmed}`;

    return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pickAvatarFromUser(raw) {
    if (!raw || typeof raw !== 'object') {
        return null;
    }

    const fromMedia = raw.media?.find(
        (item) => item?.collection_name === 'avatars' && item?.original_url
    )?.original_url;

    return raw.avatar || raw.avatar_url || fromMedia || null;
}

export function resolveUserAvatar(raw) {
    return resolveMediaUrl(pickAvatarFromUser(raw));
}
