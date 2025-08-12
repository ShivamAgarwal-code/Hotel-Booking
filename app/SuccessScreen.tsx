// screens/SuccessScreen.js
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  const params = useLocalSearchParams();
  const { bookingData: bookingDataString } = params;
  const bookingData = JSON.parse(bookingDataString);

  const scaleValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 800,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBackToSearch = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Confirmation</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeValue }]}>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successMessage}>
            Your reservation has been successfully confirmed.
          </Text>

          {/* Booking Details */}
          <View style={styles.bookingDetails}>
            <Text style={styles.detailsTitle}>Booking Details</Text>
            {renderDetail('Booking ID:', bookingData.id)}
            {renderDetail('Hotel:', bookingData.hotel)}
            {renderDetail('Location:', bookingData.city)}
            {renderDetail('Guest:', bookingData.name)}
            {renderDetail('Room:', bookingData.roomType)}
            {renderDetail('Guests:', bookingData.guests)}
            {renderDetail('Nights:', bookingData.nights)}
            {renderDetail('Check-in:', new Date(bookingData.checkInDate).toDateString())}
            {renderDetail('Check-out:', new Date(bookingData.checkOutDate).toDateString())}

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>${bookingData.totalPrice}</Text>
            </View>
          </View>

          <Text style={styles.confirmationText}>
            A confirmation email will be sent to {bookingData.email}
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleBackToSearch}>
              <Ionicons name="search" size={20} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Book Another Hotel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function for details
const renderDetail = (label, value) => (
  <View style={styles.detailRow} key={label}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
  iconContainer: {
    alignSelf: 'center',
    marginVertical: 7,
  },
  textContainer: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  bookingDetails: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  detailsTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  confirmationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
});
