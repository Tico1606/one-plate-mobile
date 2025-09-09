import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name='home' options={{ headerShown: false }} />
      
      <Stack.Screen name='profile' options={{ headerShown: false }} />
    </Stack>
  )
}
