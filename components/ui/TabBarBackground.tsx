// components/ui/TabBarBackground.tsx
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { View, StyleSheet } from "react-native";


export default function useBottomTabOverflow() {
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        styles.background,
        {
          backgroundColor: isDarkMode ? "#121212" : "#ffffff", // adjust as needed
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
