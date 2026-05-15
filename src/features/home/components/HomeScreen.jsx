import { View, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState, useRef, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../../../components/Button';
import IconButton from '../../../components/IconButton';
import CircleButton from '../../../components/CircleButton';
import ImageViewer from '../../../components/ImageViewer';
import Sidebar from '../../../components/Sidebar';
import { useAuth } from '../../../store';

const PlaceholderImage = require('../../../../assets/background-image.png');

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { signOut } = useAuth();

    const [selectedImage, setSelectedImage] = useState(undefined);
    const [showAppOptions, setShowAppOptions] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const openMenu = useCallback(() => {
        setIsSidebarVisible(true);
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [slideAnim, fadeAnim]);

    const closeMenu = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: -screenWidth,
                duration: 250,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsSidebarVisible(false);
        });
    }, [slideAnim, fadeAnim]);

    const onSidebarNavigate = useCallback(
        (item) => {
            if (item === 'Logout') {
                signOut();
                return;
            }
        },
        [signOut]
    );

    const pickImageAsync = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
        } else {
            alert('You did not select any image.');
        }
    };

    const onReset = () => {
        setShowAppOptions(false);
    };

    const onAddSticker = () => {};

    const onSaveImageAsync = async () => {};

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.menuButton, { top: insets.top + 8 }]}
                onPress={openMenu}
                accessibilityRole="button"
                accessibilityLabel="Open menu"
            >
                <Feather name="menu" size={26} color="#fff" />
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
            </View>
            {showAppOptions ? (
                <View style={styles.optionsContainer}>
                    <View style={styles.optionsRow}>
                        <IconButton icon="refresh" label="Reset" onPress={onReset} />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
                    <Button theme="secondary" label="Use this photo" onPress={() => setShowAppOptions(true)} />
                </View>
            )}

            <Sidebar
                isVisible={isSidebarVisible}
                slideAnim={slideAnim}
                fadeAnim={fadeAnim}
                closeMenu={closeMenu}
                onNavigate={onSidebarNavigate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
    },
    menuButton: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
        padding: 8,
    },
    imageContainer: {
        flex: 1,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: 'center',
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 80,
    },
    optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
});
