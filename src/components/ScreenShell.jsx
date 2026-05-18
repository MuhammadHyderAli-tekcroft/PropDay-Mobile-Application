import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenStyles as styles } from '../styles/screen.styles';

/**
 * Consistent top safe area + status bar for tab screens (Dashboard, Properties, etc.).
 * Uses react-native-safe-area-context so inset matches on iOS and Android.
 */
export default function ScreenShell({ children, style }) {
    return (
        <SafeAreaView style={[styles.safeArea, style]} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.container}>{children}</View>
        </SafeAreaView>
    );
}
