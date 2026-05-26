const SIDEBAR_ACTIONS = {
    Dashboard: (router) => router.replace('/(tabs)'),
    Properties: (router) => router.push('/properties'),
    Tasks: (router) => router.push('/tasks'),
    Contacts: (router) => router.push('/contacts'),
    Types: (router) => router.push('/types'),
    Logout: (router) => router.replace('/logout'),
};
export function navigateSidebarItem(router, item, activeItem) {
    if (item === activeItem) {
        return;
    }

    SIDEBAR_ACTIONS[item]?.(router);
}
