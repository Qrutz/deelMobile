import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
    console.log('AuthRoutesLayout')
    const { isSignedIn } = useAuth()

    console.log('isSignedIn', isSignedIn)

    if (isSignedIn) {
        return <Redirect href={'/'} />
    }

    return <Stack screenOptions={
        {
            headerShown: false
        }
    } />
}