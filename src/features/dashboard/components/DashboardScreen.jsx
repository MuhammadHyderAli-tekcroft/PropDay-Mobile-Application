import { View, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Sidebar from '../../../components/Sidebar';

const { width: screenWidth } = Dimensions.get('window');

export default function DashboardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const openMenu = useCallback(() => {
        setIsSidebarVisible(true);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [slideAnim, fadeAnim]);

    const closeMenu = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -screenWidth,
                duration: 250,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsSidebarVisible(false);
        });
    }, [slideAnim, fadeAnim]);

    const onSidebarNavigate = useCallback(
        (item) => {
            if (item === 'Properties') {
                router.push('/properties');
                return;
            }
            if (item === 'Logout') {
                router.push('/logout');
            }
        },
        [router]
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.menuButton, { top: insets.top + 8 }]}
                onPress={openMenu}
                accessibilityRole="button"
                accessibilityLabel="Open menu"
            >
                <Feather name="menu" size={26} color="#0A0A0A" />
            </TouchableOpacity>

            <Sidebar
                isVisible={isSidebarVisible}
                slideAnim={slideAnim}
                fadeAnim={fadeAnim}
                closeMenu={closeMenu}
                onNavigate={onSidebarNavigate}
                activeItem="Dashboard"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    menuButton: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
        padding: 8,
    },
});
