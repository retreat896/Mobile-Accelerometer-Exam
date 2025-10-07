// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="index" />
      <Stack.Screen options={{ headerShown: false }} name="geometry" />
      <Stack.Screen options={{ headerShown: false }} name="gravity" />
      <Stack.Screen options={{ headerShown: false }} name="custom" />
      <Stack.Screen options={{ headerShown: false }} name="gyroscope" />
    </Stack>
  );
}