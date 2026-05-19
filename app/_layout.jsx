import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../src/components/SplashScreen';
import { AuthProvider, useAuth } from '../src/store';

const InitialLayout = () => {
    const { token, checking, isSplashVisible, completeSplash } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (checking || isSplashVisible) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!token && !inAuthGroup) {
            setTimeout(() => {
                router.replace('/login');
            }, 1);
        } else if (token && inAuthGroup) {
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 1);
        }
    }, [token, checking, isSplashVisible, segments, router]);

    if (isSplashVisible) {
        return <SplashScreen onFinish={completeSplash} />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
};

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <InitialLayout />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
