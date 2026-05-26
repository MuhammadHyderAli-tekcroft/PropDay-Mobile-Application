import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenStyles as styles } from '../styles/screen.styles';

export default function ScreenShell({ children, style, backgroundColor = '#FFFFFF' }) {
    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor }, style]}
            edges={['top']}
        >
            <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
            <View style={[styles.container, { backgroundColor }]}>{children}</View>
        </SafeAreaView>
    );
}
