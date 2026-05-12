import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const Contact = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contact Page</Text>
      <Link href="/about" style={styles.link}>About</Link>
      <Link href="/" style={styles.link}>Homepage</Link>
    </View>
  )
};
export default Contact;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
    },
    text: {
        fontSize: 20,
        marginBottom: 16,
    },
    link: {
        fontSize: 20,
        color: 'blue',
        textDecorationLine: 'underline',
    },
});