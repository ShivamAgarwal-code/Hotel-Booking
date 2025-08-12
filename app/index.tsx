import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [city, setCity] = useState("");
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 86400000)
  ); // Tomorrow
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const buttonScale = new Animated.Value(1);
  const fadeAnim = new Animated.Value(0);


  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const checkIn = new Date(checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    
    const checkOut = new Date(checkOutDate);
    checkOut.setHours(0, 0, 0, 0);

    if (checkOut <= checkIn) {
      Alert.alert(
        "Invalid Dates",
        "Check-out date must be after check-in date"
      );
      return false;
    }
    
    if (checkIn < today) {
      Alert.alert("Invalid Date", "Check-in date cannot be in the past");
      return false;
    }
    
    return true;
  };

  const handleSearch = () => {
    if (!city.trim()) {
      Alert.alert("Missing Information", "Please enter a city name");
      return;
    }

    if (!validateDates()) {
      return;
    }

    // Animate button press
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setLoading(true);

    // Calculate nights
    const nights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      
      try {
        // Navigate to hotel list screen
        router.push({
          pathname: "/HotelListScreen",
          params: {
            city: city.trim(),
            checkInDate: checkInDate.toISOString(),
            checkOutDate: checkOutDate.toISOString(),
            nights: nights.toString(),
          },
        });
      } catch (error) {
        console.log("Navigation error:", error);
        Alert.alert("Navigation Error", "Could not navigate to hotel list. Please try again.");
      }
    }, 1000);
  };

  const onCheckInDateChange = (event, selectedDate) => {
    setShowCheckInPicker(false);
    
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    setCheckInDate(selectedDate);
    
    // Automatically adjust checkout date if it's not valid
    if (selectedDate >= checkOutDate) {
      const newCheckOutDate = new Date(selectedDate.getTime() + 86400000);
      setCheckOutDate(newCheckOutDate);
    }
  };

  const onCheckOutDateChange = (event, selectedDate) => {
    setShowCheckOutPicker(false);
    
    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    setCheckOutDate(selectedDate);
  };

  // Placeholder Logo Component
  const PlaceholderLogo = () => (
    <View style={styles.logoContainer}>
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        style={styles.logoGradient}
      >
        <Ionicons name="bed-outline" size={40} color="#fff" />
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            style={styles.keyboardAvoid}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Animated.View style={[styles.content]}>
                {/* Logo Section */}
                <View style={styles.headerSection}>
                  <PlaceholderLogo />
                  <Text style={styles.title}>Find Your Perfect Stay</Text>
                  <Text style={styles.subtitle}>
                    Discover amazing hotels around the world
                  </Text>
                </View>

                {/* Search Form */}
                <View style={styles.formContainer}>
                  <View style={styles.glassCard}>
                    {/* City Input */}
                    <View style={styles.inputContainer}>
                      <View style={styles.inputIconContainer}>
                        <Ionicons name="location" size={24} color="#3b82f6" />
                      </View>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Where do you want to stay?"
                        placeholderTextColor="#a0a0a0"
                        value={city}
                        onChangeText={setCity}
                      />
                    </View>

                    {/* Date Inputs Row */}
                    <View style={styles.dateRow}>
                      <TouchableOpacity
                        style={[styles.dateContainer, styles.dateContainerLeft]}
                        onPress={() => setShowCheckInPicker(true)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.inputIconContainer}>
                          <Ionicons name="calendar" size={20} color="#3b82f6" />
                        </View>
                        <View style={styles.dateContent}>
                          <Text style={styles.dateLabel}>Check-in</Text>
                          <Text style={styles.dateText}>{formatDate(checkInDate)}</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.dateContainer, styles.dateContainerRight]}
                        onPress={() => setShowCheckOutPicker(true)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.inputIconContainer}>
                          <Ionicons name="calendar" size={20} color="#3b82f6" />
                        </View>
                        <View style={styles.dateContent}>
                          <Text style={styles.dateLabel}>Check-out</Text>
                          <Text style={styles.dateText}>{formatDate(checkOutDate)}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Search Button */}
                    <Animated.View style={[{ transform: [{ scale: buttonScale }] }]}>
                      <TouchableOpacity
                        style={[styles.searchButton, loading && styles.searchButtonDisabled]}
                        onPress={handleSearch}
                        disabled={loading}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={loading ? ['#999', '#777'] : ['#ff6b6b', '#ee5a52']}
                          style={styles.searchButtonGradient}
                        >
                          {loading ? (
                            <View style={styles.loadingContainer}>
                              <Text style={styles.searchButtonText}>Searching</Text>
                              <View style={styles.loadingDots}>
                                <Text style={styles.searchButtonText}>...</Text>
                              </View>
                            </View>
                          ) : (
                            <>
                              <Ionicons
                                name="search"
                                size={24}
                                color="#fff"
                                style={{ marginRight: 12 }}
                              />
                              <Text style={styles.searchButtonText}>Search Hotels</Text>
                            </>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>

                    {/* Feature Icons */}
                    <View style={styles.featuresContainer}>
                      <View style={styles.featureItem}>
                        <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
                        <Text style={styles.featureText}>Secure</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <Ionicons name="flash" size={20} color="#3b82f6" />
                        <Text style={styles.featureText}>Fast</Text>
                      </View>
                      <View style={styles.featureItem}>
                        <Ionicons name="heart" size={20} color="#3b82f6" />
                        <Text style={styles.featureText}>Trusted</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Date Pickers */}
          {showCheckInPicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={checkInDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onCheckInDateChange}
                minimumDate={new Date()}
                themeVariant="light"
              />
            </View>
          )}

          {showCheckOutPicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={checkOutDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onCheckOutDateChange}
                minimumDate={new Date(checkInDate.getTime() + 86400000)}
                themeVariant="light"
              />
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: height,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    fontWeight: '400',
  },
  formContainer: {
    flex: 1,  
    justifyContent: 'flex-start',
    marginTop:40
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 25,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    minHeight: 56,
  },
  inputIconContainer: {
    width: 30,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 15,
    fontWeight: '500',
    paddingVertical: 0,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 12,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    minHeight: 70,
  },
  dateContainerLeft: {
    marginRight: 6,
  },
  dateContainerRight: {
    marginLeft: 6,
  },
  dateContent: {
    flex: 1,
    marginLeft: 10,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  searchButton: {
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  searchButtonGradient: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  searchButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDots: {
    marginLeft: 5,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(59, 130, 246, 0.1)',
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontWeight: '500',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    padding: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
});