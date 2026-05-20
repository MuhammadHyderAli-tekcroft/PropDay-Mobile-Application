/**
 * @param {import('expo-router').Router} router
 * @param {string} item
 * @param {string} activeItem
 */
export function navigateSidebarItem(router, item, activeItem) {
    if (item === 'Dashboard' && activeItem !== 'Dashboard') {
        router.replace('/(tabs)');
        return;
    }
    if (item === 'Properties' && activeItem !== 'Properties') {
        router.push('/properties');
        return;
    }
    if (item === 'Logout') {
        router.push('/logout');
    }
}
