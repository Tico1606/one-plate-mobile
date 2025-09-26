import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs principais */}
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />

      {/* Rotas extras que não aparecem nas Tabs */}
      <Stack.Screen name='recipe-[id]' options={{ headerShown: false }} />
    </Stack>
  )
}
