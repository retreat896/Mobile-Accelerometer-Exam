// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
        <Stack.Screen options={{ headerShown: false }} name="index" />
        <Stack.Screen options={{ headerShown: false }} name="water" />
        <Stack.Screen options={{ headerShown: false }} name="gravity" />
    </Stack>
  );
}