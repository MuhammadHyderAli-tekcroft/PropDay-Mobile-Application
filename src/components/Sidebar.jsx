import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    StyleSheet,
    ScrollView,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchcurrentUser } from '../api/contactApi';
import { SIDEBAR_WIDTH } from '../hooks/useSidebar';
import { useSidebarCounts } from '../hooks/useSidebarCounts';
import { unwrapPayloadData } from '../utils/extractPayload';
import { formatUserDisplayName } from '../utils/formatUserDisplayName';
import { resolveUserAvatar } from '../utils/resolveMediaUrl';
import { useAuth } from '../store';

const DEFAULT_AVATAR = 'https://randomuser.me/api/portraits/men/32.jpg';

const MENU_ITEMS = [
    'Dashboard',
    'Properties',
    'Tenancies',
    'Documents',
    'Keys',
    'Finance',
    'Tasks',
    'Screening',
    'WorkOrders',
    'Contacts',
    'Types',
    'Reports',
    'Xero Panel',
    'Settings',
    'Privileges',
];

const SIGN_OUT_ITEM = 'Sign out';

function getMenuIcon(item) {
    switch (item) {
        case 'Dashboard':
            return 'home';
        case 'Properties':
            return 'layout';
        case 'Tenancies':
            return 'users';
        case 'Documents':
            return 'file-text';
        case 'Keys':
            return 'key';
        case 'Finance':
            return 'dollar-sign';
        case 'Tasks':
            return 'check-square';
        case 'Screening':
            return 'user-check';
        case 'WorkOrders':
            return 'tool';
        case 'Contacts':
            return 'phone';
        case 'Types':
            return 'layers';
        case 'Reports':
            return 'bar-chart-2';
        case 'Xero Panel':
            return 'pie-chart';
        case 'Settings':
            return 'settings';
        case 'Privileges':
            return 'shield';
        case SIGN_OUT_ITEM:
            return 'log-out';
        default:
            return 'circle';
    }
}

function getMenuBadge(item, counts) {
    switch (item) {
        case 'Properties':
            return counts.properties != null
                ? { text: String(counts.properties), type: 'normal' }
                : null;
        case 'Tasks':
            return counts.tasks ? { text: String(counts.tasks.count), type: counts.tasks.type } : null;
        case 'Contacts':
            return counts.contacts != null
                ? { text: String(counts.contacts), type: 'normal' }
                : null;
        default:
            return null;
    }
}

function Sidebar({ isVisible, slideAnim, fadeAnim, closeMenu, onNavigate, activeItem = 'Properties' }) {
    const { token } = useAuth();
    const insets = useSafeAreaInsets();
    const counts = useSidebarCounts(Boolean(token && isVisible));
    const [userAvatar, setUserAvatar] = useState(DEFAULT_AVATAR);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        if (!token || !isVisible) {
            return;
        }

        let active = true;

        async function loadUser() {
            try {
                const body = await fetchcurrentUser();
                const user = unwrapPayloadData(body);
                if (!active || !user) {
                    return;
                }

                const avatarUrl = resolveUserAvatar(user);
                const name = formatUserDisplayName(user);

                avatarUrl && setUserAvatar(avatarUrl);
                name && setUserName(name);
                user.type && setUserRole(String(user.type));
            } catch {
            }
        }

        loadUser();

        return () => {
            active = false;
        };
    }, [token, isVisible]);

    const handleItemPress = (item) => {
        closeMenu();
        if (item === SIGN_OUT_ITEM) {
            onNavigate?.('Logout');
            return;
        }
        onNavigate?.(item);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <View style={styles.rootContainer} pointerEvents="box-none">
            <Animated.View
                style={[styles.sidebarBackdrop, { opacity: fadeAnim }]}
                pointerEvents={isVisible ? 'auto' : 'none'}
            >
                <TouchableOpacity style={styles.backdropTouchable} onPress={closeMenu} activeOpacity={1} />
            </Animated.View>

            <Animated.View
                style={[
                    styles.sidebarContent,
                    {
                        transform: [{ translateX: slideAnim }],
                        elevation: Platform.OS === 'android' ? 16 : 0,
                    },
                ]}
            >
                <SafeAreaView style={styles.safeArea} edges={['top', 'left']}>
                    <View style={styles.sidebarHeader}>
                        <Image
                            source={{ uri: userAvatar || DEFAULT_AVATAR }}
                            style={styles.avatarLarge}
                        />
                        <View style={styles.headerTextWrap}>
                            <Text style={styles.userName} numberOfLines={1}>
                                {userName || 'User'}
                            </Text>
                            {userRole ? (
                                <Text style={styles.userRole} numberOfLines={1}>
                                    {userRole}
                                </Text>
                            ) : null}
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={closeMenu}>
                            <Feather name="x" size={18} color="#111" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.menuScroll}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        bounces={false}
                    >
                        {MENU_ITEMS.map((item) => {
                            const badge = getMenuBadge(item, counts);
                            const isActive = item === activeItem;

                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                                    onPress={() => handleItemPress(item)}
                                >
                                    <View style={styles.menuItemLeft}>
                                        <Feather
                                            name={getMenuIcon(item)}
                                            size={18}
                                            color={isActive ? '#111' : '#444'}
                                            style={styles.menuIcon}
                                        />
                                        <Text style={[styles.menuText, isActive && styles.menuTextActive]}>
                                            {item}
                                        </Text>
                                    </View>

                                    {badge ? (
                                        <View
                                            style={[
                                                styles.badge,
                                                badge.type === 'alert' && styles.badgeAlert,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.badgeText,
                                                    badge.type === 'alert' && styles.badgeTextAlert,
                                                ]}
                                            >
                                                {badge.text}
                                            </Text>
                                        </View>
                                    ) : null}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                        <TouchableOpacity
                            style={styles.signOutBtn}
                            onPress={() => handleItemPress(SIGN_OUT_ITEM)}
                            activeOpacity={0.85}
                        >
                            <Feather name="log-out" size={16} color="#111" />
                            <Text style={styles.signOutText}>{SIGN_OUT_ITEM}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
    },
    sidebarBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
    },
    backdropTouchable: {
        flex: 1,
    },
    sidebarContent: {
        width: SIDEBAR_WIDTH,
        backgroundColor: '#FCFCF9',
        height: '100%',
        position: 'absolute',
        left: 0,
        zIndex: 1001,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
    },
    safeArea: {
        flex: 1,
    },
    sidebarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0EA',
    },
    avatarLarge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
        backgroundColor: '#EEE',
    },
    headerTextWrap: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
    },
    userRole: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F0F0EA',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    menuScroll: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    menuItemActive: {
        backgroundColor: '#F5F5F0',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        marginRight: 16,
    },
    menuText: {
        fontSize: 15,
        color: '#111',
        fontWeight: '500',
    },
    menuTextActive: {
        fontWeight: '700',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0EA',
    },
    signOutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 14,
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    signOutText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
        marginLeft: 8,
    },
    badge: {
        backgroundColor: '#F0F0EA',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        minWidth: 28,
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    badgeAlert: {
        backgroundColor: '#FFE8EC',
    },
    badgeTextAlert: {
        color: '#E63946',
    },
});

export default Sidebar;
