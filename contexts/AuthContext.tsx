"use client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "react-native";

interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  selectedTrainer?: string;
  createdAt?: string;
  updatedAt?: string;
  hasOnboardingCompleted?: boolean; // Add this field
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phoneNumber?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  initializing: boolean; // Add this to track initial auth check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // Track initial load

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setInitializing(true);

      const [userData, token] = await AsyncStorage.multiGet(["user", "token"]);
      const storedUser = userData[1];
      const storedToken = token[1];

      log("Checking auth status:", {
        hasUserData: !!storedUser,
        hasToken: !!storedToken,
      });

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        
        // Verify token with server
        try {
          const verifyResponse = await apiService.verifyToken(storedToken);

          if (!verifyResponse.valid) {
            throw new Error("Token is invalid");
          }

          // Update user info if any new data comes from server
          let finalUser = parsedUser;
          if (verifyResponse.user) {
            finalUser = { ...parsedUser, ...verifyResponse.user };
            await AsyncStorage.setItem("user", JSON.stringify(finalUser));
          }

          setUser(finalUser);
          setIsAuthenticated(true);
          log("Token verification successful");
          
          // Don't navigate here - let the app handle navigation based on auth state
          return;
        } catch (err) {
          logError("Token verification failed:", err);
          await clearAuthData(); // Use helper function
        }
      }
    } catch (err) {
      logError("Error checking auth status:", err);
      await clearAuthData();
    } finally {
      setInitializing(false);
    }
  };

  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove(["user", "token"]);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      logError("Error clearing auth data:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      const response = await apiService.login(email, password);

      console.log("====================================");
      console.log(response, "response");
      console.log("====================================");
      const { user: userData, token } = response.data;

      if (!userData || !token) {
        throw new Error("Invalid response from server");
      }

      console.log(token);

      // Store user data and token
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", token);

      setUser(userData);
      setIsAuthenticated(true);

      log("Login successful:", userData.email);

      Alert.alert(
        "Success",
        "Login successful!",
        [
          {
            text: "OK",
            onPress: () => {
              if (userData.hasOnboardingCompleted) {
                router.replace("/(tabs)"); // Use replace instead of push
              } else {
                router.replace("/onboarding/OnboardingScreen");
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      logError("Login error:", error);
      throw new Error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phoneNumber?: string
  ) => {
    try {
      setLoading(true);

      const userData = {
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        ...(phoneNumber &&
          phoneNumber.trim() && { phoneNumber: phoneNumber.trim() }),
      };

      console.log("====================================");
      console.log(userData, "sign up with this user data");
      console.log("====================================");

      const response = await apiService.register(userData);

      console.log(response, "response of register");

      const { user: newUser, token } = response.data;

      if (!newUser || !token) {
        throw new Error("Invalid response from server");
      }

      // Store user data and token
      await AsyncStorage.setItem("user", JSON.stringify(newUser));
      await AsyncStorage.setItem("token", token);

      setUser(newUser);
      setIsAuthenticated(true); // Set authenticated state

      log("Registration successful:", newUser.email);

      // Show success alert and navigate to login
      Alert.alert(
        "Success",
        "Registration successful! Please login to continue.",
        [
          {
            text: "OK",
            onPress: () => {
              // Clear auth state to force login
              setUser(null);
              setIsAuthenticated(false);
              router.replace("/LoginScreen");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      logError("Registration error:", error);
      throw new Error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Call logout API
      try {
        await apiService.logout();
        log("Server logout successful");
      } catch (error) {
        logError("Server logout failed, continuing with local logout:", error);
      }

      // Clear local storage and state
      await clearAuthData();

      log("Logout successful");
      
      // Navigate to login screen
      router.replace("/LoginScreen");
    } catch (error) {
      logError("Logout error:", error);
      // Even if there's an error, clear local state
      await clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      // Update user on server
      const response = await apiService.updateProfile(userData);

      console.log("====================================");
      console.log(response, "response");
      console.log("====================================");
      const updatedUser = { ...user, ...response?.data?.user };

      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      log("User update successful");
    } catch (error) {
      logError("Error updating user:", error);

      // Update locally as fallback
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      // Re-throw error to let UI handle it
      throw new Error(handleApiError(error));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        setUser,
        updateUser,
        loading,
        initializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};