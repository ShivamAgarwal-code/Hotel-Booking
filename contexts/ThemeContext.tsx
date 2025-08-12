"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    gradientStart: string;
    gradientEnd: string;
    card: string;
    userGradientStart:string;
    userGradientEnd:string
  };
}

const lightColors = {
  primary: "#3B82F6",
  secondary: "#1E40AF",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  text: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  card: "#E4EFE7",
  gradientEnd: "#ffffff",
  gradientStart: "#F8FAFC",
   // User section gradient
  userGradientStart: "#ffffff",
  userGradientEnd: "#D0E6E4",
};

const darkColors = {
  primary: "#60A5FA",
  secondary: "#3B82F6",
  background: "#111827",
  surface: "#1F2937",
  card: "#1F2937",
  text: "#F9FAFB",
  textSecondary: "#D1D5DB",
  border: "#374151",
  success: "#34D399",
  warning: "#FBBF24",
  error: "#F87171",
  gradientStart: "#0F172A",
  gradientEnd: "#1E293B",
    // User section gradient
  userGradientStart: "#1F2937",
  userGradientEnd: "#374151",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setIsDarkMode(savedTheme === "dark");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
