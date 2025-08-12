import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { ThemeProvider } from "@/contexts/ThemeContext";

// Import all screens

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="HotelListScreen" options={{ headerShown: false }} />
        <Stack.Screen name="HotelDetailScreen"  options={{ headerShown: false }}   />
        <Stack.Screen
          name="BookingFormScreen"
          options={{ headerShown: false }} 
        />
        <Stack.Screen name="SuccessScreen"  options={{ headerShown: false }}  />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
