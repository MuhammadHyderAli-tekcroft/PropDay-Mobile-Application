export function getInitials(name) {
    const parts = String(name || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    return parts.length === 0
        ? '?'
        : parts.length === 1
          ? parts[0].slice(0, 2).toUpperCase()
          : `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
