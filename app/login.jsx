import React, { useState } from 'react';
import { View, Text,TextInput,TouchableOpacity,StyleSheet,ActivityIndicator,Alert,KeyboardAvoidingView,Platform,ScrollView,Image,Pressable,StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const HEADER_IMAGE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80&auto=format&fit=crop';

const Login = () => {
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/login', { email, password });
            console.log('Laravel Response:', res.data.message);
            signIn(res.data.token);
        } catch (e) {
            Alert.alert('Login Failed', e.response?.data?.message || e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" />

            <View style={styles.head}>
                <Image source={{ uri: HEADER_IMAGE }} style={styles.headImg} resizeMode="cover" />
                <View style={styles.overlay} />

                <View style={styles.headTitleWrap}>
                    <Text style={styles.eyebrow}>PropDay Console</Text>
                    <Text style={styles.title}>Welcome back.</Text>
                </View>
            </View>

            {/*Body*/}
            <KeyboardAvoidingView
                style={styles.bodyKav}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    style={styles.body}
                    contentContainerStyle={styles.bodyContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Email */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrap}>
                            <Ionicons name="mail-outline" size={18} color="#8A8A93" style={styles.iconLeft} />
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Enter your email"
                                placeholderTextColor="#B0B0B8"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View style={styles.field}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrap}>
                            <Ionicons name="lock-closed-outline" size={18} color="#8A8A93" style={styles.iconLeft} />
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                placeholderTextColor="#B0B0B8"
                                secureTextEntry={!showPass}
                                autoCapitalize="none"
                            />
                            <Pressable onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#8A8A93" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Row */}
                    <View style={styles.row}>
                        <Pressable style={styles.remember} onPress={() => setRemember(!remember)}>
                            <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                                {remember && <Ionicons name="checkmark" size={12} color="#fff" />}
                            </View>
                            <Text style={styles.rememberText}>Remember me</Text>
                        </Pressable>
                        <TouchableOpacity onPress={() => Alert.alert('Info', 'Forgot password not implemented.')}>
                            <Text style={styles.forgot}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Button */}
                    <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Login</Text>}
                    </TouchableOpacity>

                    <Text style={styles.footerText}>
                        Don't have an account?{' '}
                        <Text style={styles.requestLink} onPress={() => router.push('/register')}>Request access</Text>
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    root: { 
        flex: 1,
        backgroundColor: '#fff' 
    },
    head: { 
        height: 280, 
        backgroundColor: '#0E0E10' 
    },
    headImg: { 
        width: '100%', 
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: { 
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: 'rgba(0,0,0,0.4)' 
    },
    headTitleWrap: {
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    eyebrow: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    title: { 
        fontSize: 34,
        fontWeight: '800',
        color: '#fff',
    },
    bodyKav: { 
        flex: 1 
    },
    body: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -60, 
    },
    bodyContent: { 
        paddingHorizontal: 24, 
        paddingTop: 20, 
        flexGrow: 1 
    },
    field: { 
        marginBottom: 16
    },
    label: { 
        fontSize: 12, 
        fontWeight: '700', 
        color: '#1A1A1F', 
        marginBottom: 8, 
        marginLeft: 4 
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F2',
        borderRadius: 14,
        height: 56,
        paddingHorizontal: 16,
    },
    iconLeft: { 
        marginRight: 12 
    },
    input: { 
        flex: 1, 
        fontSize: 15, 
        color: '#1A1A1F' 
    },
    eyeBtn: { 
        padding: 4 
    },
    row: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24 
    },
    remember: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    checkbox: { 
        width: 20, 
        height: 20, 
        borderRadius: 6, 
        borderWidth: 1, 
        borderColor: '#DDD', 
        marginRight: 8, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    checkboxChecked: { 
        backgroundColor: '#0E0E10', 
        borderColor: '#0E0E10' 
    },
    rememberText: { 
        fontSize: 14, 
        color: '#444' 
    },
    forgot: { 
        fontSize: 14, 
        fontWeight: '600', 
        color: '#0E0E10' 
    },
    btnPrimary: { 
        backgroundColor: '#0E0E10', 
        height: 56, 
        borderRadius: 28, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 20 
    },
    btnText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '700' 
    },
    footerText: { 
        textAlign: 'center', 
        color: '#888', 
        fontSize: 14 
    },
    requestLink: { 
        color: '#0E0E10', 
        fontWeight: '700' 
    },
});