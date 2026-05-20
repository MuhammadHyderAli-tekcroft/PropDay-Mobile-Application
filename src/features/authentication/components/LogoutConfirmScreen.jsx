import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import ScreenShell from '../../../components/ScreenShell';
import { useAuth } from '../context/AuthContext';
import { logoutConfirmStyles as styles } from '../styles/logoutConfirm.styles';

export default function LogoutConfirmScreen() {
    const { signOut } = useAuth();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleCancel = () => {
        if (loggingOut) {
            return;
        }
        router.replace('/(tabs)');
    };

    const handleLogout = async () => {
        if (loggingOut) {
            return;
        }

        setLoggingOut(true);
        try {
            await signOut();
            router.replace('/login');
        } catch {
            setLoggingOut(false);
        }
    };

    return (
        <ScreenShell style={styles.screen}>
            <View style={styles.content}>
                <View style={styles.card}>
                    <View style={styles.iconWrap}>
                        <Feather name="log-out" size={32} color="#E63946" />
                    </View>

                    <Text style={styles.title}>Log out?</Text>
                    <Text style={styles.message}>
                        You will need to sign in again to access your account and property data.
                    </Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
                            onPress={handleLogout}
                            disabled={loggingOut}
                            activeOpacity={0.85}
                            accessibilityRole="button"
                            accessibilityLabel="Confirm log out"
                        >
                            {loggingOut ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Feather
                                        name="log-out"
                                        size={18}
                                        color="#FFFFFF"
                                        style={{ marginRight: 8 }}
                                    />
                                    <Text style={styles.logoutButtonText}>Log Out</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                            disabled={loggingOut}
                            activeOpacity={0.85}
                            accessibilityRole="button"
                            accessibilityLabel="Cancel log out"
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenShell>
    );
}
