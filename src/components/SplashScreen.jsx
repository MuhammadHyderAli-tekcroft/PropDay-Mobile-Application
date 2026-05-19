import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Image } from 'expo-image';

import { PROPDAY_LOGO_URI, SPLASH_DURATION_MS } from '../constants/branding';

const FADE_OUT_MS = 500;

export default function SplashScreen({ onFinish, duration = SPLASH_DURATION_MS, waiting }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const pulseLoopRef = useRef(null);
    const hasDismissedRef = useRef(false);

    const dismiss = () => {
        if (hasDismissedRef.current) {
            return;
        }
        hasDismissedRef.current = true;
        pulseLoopRef.current?.stop();

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: FADE_OUT_MS,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                onFinish?.();
            }
        });
    };

    useEffect(() => {
        hasDismissedRef.current = false;
        fadeAnim.setValue(0);
        pulseAnim.setValue(0);

        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1100,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 1100,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulseLoopRef.current = pulseLoop;

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                pulseLoop.start();
            }
        });

        let finishTimer;
        if (waiting === undefined) {
            finishTimer = setTimeout(dismiss, Math.max(duration - FADE_OUT_MS, 0));
        }

        return () => {
            clearTimeout(finishTimer);
            pulseLoop.stop();
            fadeAnim.stopAnimation();
            pulseAnim.stopAnimation();
        };
    }, [duration, waiting, fadeAnim, pulseAnim]);

    useEffect(() => {
        if (waiting === false) {
            dismiss();
        }
    }, [waiting]);

    const pulseOpacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5],
    });

    const scale = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.08],
    });

    const logoOpacity = Animated.multiply(fadeAnim, pulseOpacity);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.logoWrapper,
                    {
                        opacity: logoOpacity,
                        transform: [{ scale }],
                    },
                ]}
            >
                <Image
                    source={{ uri: PROPDAY_LOGO_URI }}
                    style={styles.logo}
                    contentFit="contain"
                    accessibilityLabel="PROPDAY logo"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    logoWrapper: {
        width: '80%',
        maxWidth: 320,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
});
