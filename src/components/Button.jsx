import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Button({ label, theme, onPress }) {
    if (theme === 'primary') {
        return (
            <View
                style={[
                    styles.buttonContainer,
                    { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18 },
                ]}
            >
                <Pressable
                    style={[styles.button, { backgroundColor: '#fff' }]}
                    onPress={onPress}
                >
                    <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
                    <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
                </Pressable>
            </View>
        );
    }
    if (theme === 'secondary') {
        return (
            <View style={styles.buttonContainer}>
                <Pressable
                    style={{
                        backgroundColor: 'black',
                        marginTop: 5,
                        borderRadius: 10,
                        padding: 8,
                        width: '50%',
                        height: '65%',
                    }}
                    onPress={onPress}
                >
                    <Text
                        style={{
                            color: '#ffd33d',
                            fontSize: 16,
                            textAlign: 'center',
                        }}
                    >
                        Use this Photo
                    </Text>
                </Pressable>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },
});
