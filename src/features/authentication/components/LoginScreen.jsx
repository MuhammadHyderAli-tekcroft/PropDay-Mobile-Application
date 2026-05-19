import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Dimensions,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { loginRequest } from '../api/authApi';
import { PROPDAY_LOGO_URI } from '../../../constants/branding';

const { height } = Dimensions.get('window');

const HERO_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const data = await loginRequest(email, password);
      signIn(data.token);
    } catch (e) {
      Alert.alert('Login Failed', e.response?.data?.message || e.message || 'Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.heroImage}>
        <View style={styles.heroDarkOverlay}>
          <View style={styles.logoContainer}>
            <Image source={{ uri: PROPDAY_LOGO_URI }} style={styles.customLogo} resizeMode="contain" />
          </View>
        </View>
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.curvedSheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.welcomeHeading}>PROPDAY</Text>
            <Text style={styles.welcomeSubtext}>
              Find your next space, feel at home{'\n'}Where comfort meets convenience
            </Text>

            <View style={styles.formContainer}>
              <Text style={styles.fieldLabel}>Email</Text>
              <View style={styles.inputWrap}>
                <Feather name="mail" size={18} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  placeholderTextColor="#BBB"
                />
              </View>

              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <Feather name="lock" size={18} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#BBB"
                />
                <Pressable onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Feather name={showPass ? 'eye' : 'eye-off'} size={18} color="#999" />
                </Pressable>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Don&apos;t have access? </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text style={styles.requestLink}>Request Access</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  keyboardAvoid: { flex: 1 },
  heroImage: { width: '100%', height: height * 0.45 },
  heroDarkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  customLogo: { width: 100, height: 100 },
  curvedSheet: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
  },
  scrollContent: {
    paddingTop: 35,
    paddingBottom: 40,
    alignItems: 'center',
  },
  welcomeHeading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  formContainer: { width: '100%' },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    height: 58,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#111'},
  eyeBtn: { padding: 4 },
  loginButton: {
    backgroundColor: '#111',
    width: '100%',
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  footerRow: {
    flexDirection: 'row',
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { color: '#888', fontSize: 14 },
  requestLink: {
    color: '#111',
    fontWeight: '700',
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
});
