import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Text, View, Button, StyleSheet } from 'react-native';

export default function Page() {
    const { user } = useUser(); // Access the current user
    const { signOut } = useAuth(); // Access the signOut function

    const handleSignOut = async () => {
        try {
            await signOut(); // Signs out the user
        } catch (err) {
            console.error('Error signing out:', err);
        }
    };

    return (
        <View style={styles.container}>
            <SignedIn>
                <Text style={styles.text}>
                    Hello, {user?.emailAddresses[0].emailAddress}
                </Text>
                <Button title="Sign Out" onPress={handleSignOut} />
            </SignedIn>
            <SignedOut>
                <Link href="/(auth)/sign-in" style={styles.link}>
                    <Text style={styles.linkText}>Sign in</Text>
                </Link>
                <Link href="/(auth)/sign-up" style={styles.link}>
                    <Text style={styles.linkText}>Sign up</Text>
                </Link>
            </SignedOut>
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
    text: {
        fontSize: 18,
        marginBottom: 20,
        color: '#333',
    },
    link: {
        marginVertical: 10,
    },
    linkText: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});
