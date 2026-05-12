import { useCallback } from 'react';
import { Alert, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function LogoutScreen() {
    const { signOut } = useAuth();
    const router = useRouter();
    useFocusEffect(
        useCallback(() => {
            Alert.alert(
                'Log Out', 
                'Are you sure you want to log out?', 
                [
                    { 
                        text: 'Cancel', 
                        style: 'cancel',
                        onPress: () => router.back() 
                    },
                    { 
                        text: 'Log Out', 
                        style: 'destructive', 
                        onPress: () => signOut() 
                    },
                ]
            );
        }, [])
    );
    return <View style={{ flex: 1, backgroundColor: '#25292e' }} />;
}