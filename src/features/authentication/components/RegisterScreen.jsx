import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function RegisterScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Request access</Text>
            <Text style={styles.sub}>Ask your administrator for an account, then sign in here.</Text>
            <Link href="/login" style={styles.link}>
                Back to login
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
        color: '#0E0E10',
    },
    sub: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        marginBottom: 28,
    },
    link: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0E0E10',
        textDecorationLine: 'underline',
    },
});
