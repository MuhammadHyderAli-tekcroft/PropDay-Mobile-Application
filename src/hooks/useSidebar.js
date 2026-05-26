import { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import { useRouter } from 'expo-router';

import { navigateSidebarItem } from '../utils/sidebarNavigation';

const { width: screenWidth } = Dimensions.get('window');
export const SIDEBAR_WIDTH = screenWidth * 0.8;

export function useSidebar(activeItem) {
    const router = useRouter();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
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
                toValue: -SIDEBAR_WIDTH,
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
            navigateSidebarItem(router, item, activeItem);
        },
        [router, activeItem]
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
