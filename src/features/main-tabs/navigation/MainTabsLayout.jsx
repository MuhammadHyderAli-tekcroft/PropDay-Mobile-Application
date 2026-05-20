import { Tabs } from 'expo-router';

export default function MainTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { display: 'none' },
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="properties" />
            <Tabs.Screen name="contacts" />
            <Tabs.Screen name="logout" />
        </Tabs>
    );
}
