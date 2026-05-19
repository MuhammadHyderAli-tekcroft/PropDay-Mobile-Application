import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AppTopHeader({
    companyName,
    onMenuPress,
    onNotificationsPress,
    showNotificationDot = true,
}) {
    return (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.headerSideBtn}
                onPress={onMenuPress}
                accessibilityRole="button"
                accessibilityLabel="Open menu"
            >
                <Ionicons name="menu" size={22} color="#000" />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
                <Text style={styles.companyNameText} numberOfLines={1}>
                    {companyName || 'Company'}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.iconCircle}
                onPress={onNotificationsPress}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
            >
                <Ionicons name="notifications-outline" size={20} color="#000" />
                {showNotificationDot ? <View style={styles.notificationDot} /> : null}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerSideBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    companyNameText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    notificationDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        backgroundColor: '#E63946',
        borderRadius: 4,
    },
});
