import { formatUserDisplayName } from '../../../utils/formatUserDisplayName';
import { getInitials } from '../../../utils/getInitials';
import { resolveUserAvatar } from '../../../utils/resolveMediaUrl';

export function mapContact(raw) {
    if (!raw || typeof raw !== 'object') {
        return null;
    }

    const fullName = formatUserDisplayName(raw, { includeTitle: true, fallback: 'Unknown' });

    return {
        id: String(raw.id),
        fullName,
        email: raw.email || '',
        type: raw.type || 'Contact',
        phone: raw.phone_work || raw.mobile || raw.phone_home || null,
        avatarUrl: resolveUserAvatar(raw),
        initials: getInitials(fullName),
    };
}
