import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from '../src/components/SplashScreen';
import { queryClient } from '../src/lib/queryClient';
import { AuthProvider, useAuth } from '../src/store';

const InitialLayout = () => {
    const { token, checking, isSplashVisible, completeSplash } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (checking || isSplashVisible) {
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';
        const destination = !token && !inAuthGroup ? '/login' : token && inAuthGroup ? '/(tabs)' : null;

        destination &&
            setTimeout(() => {
                router.replace(destination);
            }, 1);
    }, [token, checking, isSplashVisible, segments, router]);

    return isSplashVisible ? (
        <SplashScreen onFinish={completeSplash} />
    ) : (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <InitialLayout />
                </AuthProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
