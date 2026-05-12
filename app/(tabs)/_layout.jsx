import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
    const { signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: () => signOut() },
        ]);
    };

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: { backgroundColor: '#25292e' },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: { backgroundColor: '#25292e' },
            }}
        >
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: 'Home', 
                    tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                }} 
            />
            <Tabs.Screen 
                name="about" 
                options={{ 
                    title: 'About', 
                    tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                }} 
            />
            <Tabs.Screen 
                name="contact" 
                options={{ 
                    title: 'Contact', 
                    tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'call' : 'call-outline'} color={color} size={24} />
                }} 
            />
            <Tabs.Screen 
                name="logout" 
                options={{ 
                    title: 'Logout', 
                    tabBarIcon: ({ color }) => <Ionicons name="log-out-outline" color={color} size={24} />
                }} 
            />
        </Tabs>
    );
}