// -------------------
// screens/BookingFormScreen.js
// -------------------
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingFormScreen() {
  // Get all parameters from expo-router
  const params = useLocalSearchParams();
  console.log('====================================');
  console.log(params,"params");
  console.log('====================================');
  const { hotelData, city, checkInDate, checkOutDate, nights } = params;

  console.log(hotelData,"hotel data");
  

  // Parse the hotel data and search params
  const hotel = JSON.parse(hotelData as string);
  const searchParams = {
    city: city || '',
    checkInDate: checkInDate ? new Date(checkInDate as string) : new Date(),
    checkOutDate: checkOutDate ? new Date(checkOutDate as string) : new Date(),
    nights: nights ? parseInt(nights as string) : 1,
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    guests: '1',
    roomType: hotel.roomTypes[0].name,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.guests || parseInt(formData.guests) < 1) {
      newErrors.guests = 'Number of guests must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: any, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const getSelectedRoomPrice = () => {
    const selectedRoom = hotel.roomTypes.find(room => room.name === formData.roomType);
    return selectedRoom ? selectedRoom.price : hotel.pricePerNight;
  };

  const getTotalPrice = () => {
    return getSelectedRoomPrice() * searchParams.nights;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const bookingData = {
        id: Date.now().toString(),
        ...formData,
        hotel: hotel.name,
        city: searchParams.city,
        checkInDate: searchParams.checkInDate.toISOString(),
        checkOutDate: searchParams.checkOutDate.toISOString(),
        nights: searchParams.nights,
        roomPrice: getSelectedRoomPrice(),
        totalPrice: getTotalPrice(),
        bookingDate: new Date().toISOString(),
      };

      // Save booking to AsyncStorage
      const existingBookings = await AsyncStorage.getItem('bookings');
      const bookings = existingBookings ? JSON.parse(existingBookings) : [];
      bookings.push(bookingData);
      await AsyncStorage.setItem('bookings', JSON.stringify(bookings));

      setTimeout(() => {
        setLoading(false);
        // Navigate to success screen with Expo Router
        router.push({
          pathname: "/SuccessScreen",
          params: {
            bookingData: JSON.stringify(bookingData)
          }
        });
      }, 1500);

    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to save booking. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Hotel</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.summaryText}>{searchParams.city}</Text>
          <Text style={styles.summaryText}>
            {searchParams.checkInDate.toDateString()} - {searchParams.checkOutDate.toDateString()}
          </Text>
          <Text style={styles.summaryText}>{searchParams.nights} nights</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Guest Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.textInput, errors.name && styles.inputError]}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              autoCapitalize="words"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={[styles.textInput, errors.email && styles.inputError]}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of Guests *</Text>
            <TextInput
              style={[styles.textInput, errors.guests && styles.inputError]}
              placeholder="1"
              value={formData.guests}
              onChangeText={(value) => handleInputChange('guests', value)}
              keyboardType="numeric"
            />
            {errors.guests && <Text style={styles.errorText}>{errors.guests}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Room Type</Text>
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  Alert.alert(
                    'Select Room Type',
                    '',
                    hotel.roomTypes.map(room => ({
                      text: `${room.name} - $${room.price}/night`,
                      onPress: () => handleInputChange('roomType', room.name),
                    }))
                  );
                }}
              >
                <Text style={styles.pickerText}>
                  {formData.roomType} - ${getSelectedRoomPrice()}/night
                </Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.priceBreakdown}>
          <Text style={styles.priceTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Room rate (${getSelectedRoomPrice()}/night × {searchParams.nights} nights)</Text>
            <Text style={styles.priceValue}>${getTotalPrice()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${getTotalPrice()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  priceBreakdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  priceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  priceValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#999',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});