import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

const InitialLayout = () => {
    const { token, checking } = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (checking) return;

        const inAuthGroup = segments[0] === 'login';

        if (!token && !inAuthGroup) {
            // Delaying by 1ms lets the Stack mount first, fixing the crash
            setTimeout(() => {
                router.replace('/login');
            }, 1);
        } else if (token && inAuthGroup) {
            setTimeout(() => {
                router.replace('/(tabs)');
            }, 1);
        }
    }, [token, checking, segments]);

    if (checking) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#1a2236" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
};

export default function RootLayout() {
    return (
        <AuthProvider>
            <InitialLayout />
        </AuthProvider>
    );
}