import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';

export default function Page() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSignInPress = React.useCallback(async () => {
        if (!isLoaded) return;

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    }, [isLoaded, emailAddress, password]);

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image source={require('../../assets/logo.png')} style={styles.logo} />

            {/* Title */}
            <Text style={styles.title}>Sign In</Text>

            {/* Email Input */}
            <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                placeholderTextColor="#aaa"
            />

            {/* Password Input */}
            <TextInput
                style={styles.input}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                placeholderTextColor="#aaa"
            />

            {/* Sign In Button */}
            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
                <Text style={styles.buttonText}>Done!</Text>
            </TouchableOpacity>

            {/* Footer Links */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account?</Text>
                <Link href="/sign-up" style={styles.link}>
                    <Text style={styles.linkText}>Sign Up</Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    logo: {
        width: 200,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        fontFamily: 'ComicSansMS', // Match the playful font from the design
    },
    input: {
        width: '90%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#e5f4e3', // Light green input field color
        color: '#333',
    },
    button: {
        width: '90%',
        height: 50,
        backgroundColor: '#f06bb7', // Button color from your design
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 16,
        color: '#555',
    },
    link: {
        marginLeft: 5,
    },
    linkText: {
        fontSize: 16,
        color: '#f06bb7', // Match the button color
        fontWeight: 'bold',
    },
});
