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
    'Tenancies',
    'Documents',
    'Keys',
    'Finance',
    'Tasks',
    'Screening',
    'WorkOrders',
    'Contacts',
    'Reports',
    'Xero Panel',
    'Settings',
    'Privileges',
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
                            source={{ uri: 'https://images.unsplash.com/vector-1778754802871-d0fc1a7b5ecc?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                            style={styles.headerBackgroundImage}
                        />
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
    
    headerBackgroundImage: {
        position: 'absolute',
        top: 0,       
        left: 5,      
        width: 70,     
        height: 70,    
        resizeMode: 'contain',
    },
    
    sidebarHeader: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10, 
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        alignItems: 'center',
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
        textAlign: 'center',
    },
    userRole: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
        textAlign: 'center',
    },
    companyBadge: {
        backgroundColor: '#0A0A0A',
        alignSelf: 'center',
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