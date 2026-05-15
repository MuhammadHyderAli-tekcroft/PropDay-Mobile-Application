import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    SafeAreaView,
    StyleSheet,
    Dimensions,
    ScrollView,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
    'Dashboard',
    'Properties',
    'Tenants',
    'Owners',
    'Financials',
    'Bank Accounts',
    'Maintenance',
    'Reports',
    'AI Voice Agent',
    'Settings',
    'Logout',
];

function Sidebar({ isVisible, slideAnim, fadeAnim, closeMenu, onNavigate, activeItem = 'Properties' }) {
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
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.sidebarHeader}>
                        <Image
                            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                            style={styles.avatarLarge}
                        />
                        <Text style={styles.userName}>Muhammad Hyder Ali</Text>
                        <Text style={styles.userRole}>Associate Software Engineer</Text>
                        <View style={styles.companyBadge}>
                            <Text style={styles.companyBadgeText}>High Gate</Text>
                        </View>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        bounces={false}
                    >
                        {MENU_ITEMS.map((item, index) => {
                            const isActive = item === activeItem;
                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.menuItem, isActive && styles.menuItemActive]}
                                    onPress={() => {
                                        closeMenu();
                                        onNavigate?.(item);
                                    }}
                                >
                                    <Text style={[styles.menuText, isActive && styles.menuTextActive]}>{item}</Text>
                                    {isActive ? (
                                        <Feather name="chevron-right" size={16} color="#D90429" />
                                    ) : null}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        zIndex: 1000,
    },
    backdropTouchable: {
        flex: 1,
    },
    sidebarContent: {
        width: width * 0.75,
        backgroundColor: '#FFF',
        height: '100%',
        position: 'absolute',
        left: 0,
        zIndex: 1001,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: Platform.OS === 'android' ? 30 : 0,
    },
    sidebarHeader: {
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 20 : 40,
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    avatarLarge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginBottom: 12,
    },
    userName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0A0A0A',
    },
    userRole: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    companyBadge: {
        backgroundColor: '#0A0A0A',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginTop: 12,
    },
    companyBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#FAFAFA',
    },
    menuItemActive: {
        backgroundColor: '#FFF5F5',
        borderRightWidth: 4,
        borderRightColor: '#D90429',
    },
    menuText: {
        fontSize: 15,
        color: '#0A0A0A',
        fontWeight: '600',
    },
    menuTextActive: {
        color: '#D90429',
        fontWeight: '800',
    },
});

export default Sidebar;
