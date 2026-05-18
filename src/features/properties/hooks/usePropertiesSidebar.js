import { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import { useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export function usePropertiesSidebar() {
    const router = useRouter();
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
            if (item === 'Dashboard') {
                router.replace('/(tabs)');
                return;
            }
            if (item === 'Properties') {
                return;
            }
            if (item === 'Logout') {
                router.push('/logout');
            }
        },
        [router]
    );

    return {
        isSidebarVisible,
        slideAnim,
        fadeAnim,
        openMenu,
        closeMenu,
        onSidebarNavigate,
    };
}
