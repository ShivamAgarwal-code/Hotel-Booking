// screens/HotelDetailScreen.js
// -------------------
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Extended mock hotel data with additional properties for detail screen
const getExtendedHotelData = (baseHotel) => ({
  ...baseHotel,
  images: [
    baseHotel.image,
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  ],
  description: `Experience luxury and comfort at ${baseHotel.name}. Located in the heart of ${baseHotel.location}, our hotel offers exceptional service and world-class amenities. Whether you're here for business or leisure, we ensure your stay is memorable with our attention to detail and commitment to excellence.`,
  roomTypes: [
    {
      name: "Standard Room",
      price: baseHotel.pricePerNight,
      description: "Comfortable room with all essential amenities"
    },
    {
      name: "Deluxe Room",
      price: Math.round(baseHotel.pricePerNight * 1.3),
      description: "Spacious room with premium furnishing and city view"
    },
    {
      name: "Suite",
      price: Math.round(baseHotel.pricePerNight * 1.8),
      description: "Luxury suite with separate living area and premium amenities"
    }
  ]
});

export default function HotelDetailScreen() {
  // Get all parameters from expo-router
  const params = useLocalSearchParams();
  const { hotelData, city, checkInDate, checkOutDate, nights } = params;

  // Parse the hotel data and search params
  const baseHotel = JSON.parse(hotelData);
  const hotel = getExtendedHotelData(baseHotel);
  
  const searchParams = {
    city: city || '',
    checkInDate: checkInDate ? new Date(checkInDate) : new Date(),
    checkOutDate: checkOutDate ? new Date(checkOutDate) : new Date(),
    nights: nights ? parseInt(nights) : 1,
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={20} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={20} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={20} color="#FFD700" />
      );
    }

    return stars;
  };

  const handleBookNow = () => {
    console.log(hotel,"hotel");
    
    router.push({
      pathname: "/BookingFormScreen",
      params: {
        hotelData: JSON.stringify(hotel),
        ...params, // Pass through all search params
      },
    });
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
        <Text style={styles.headerTitle}>Hotel Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {hotel.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.hotelImage} />
            ))}
          </ScrollView>
          <View style={styles.imageIndicator}>
            {hotel.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === selectedImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Hotel Header */}
          <View style={styles.headerSection}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderStars(hotel.rating)}
              </View>
              <Text style={styles.ratingText}>({hotel.rating})</Text>
            </View>
            <Text style={styles.location}>{searchParams.city}</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={styles.pricePerNight}>${hotel.pricePerNight}/night</Text>
            <Text style={styles.totalPrice}>
              Total: ${hotel.pricePerNight * searchParams.nights} for {searchParams.nights} nights
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this hotel</Text>
            <Text style={styles.description}>{hotel.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {hotel.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Room Types */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Room Types</Text>
            {hotel.roomTypes.map((room, index) => (
              <View key={index} style={styles.roomTypeCard}>
                <Text style={styles.roomTypeName}>{room.name}</Text>
                <Text style={styles.roomTypePrice}>${room.price}/night</Text>
                <Text style={styles.roomTypeDescription}>{room.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  imageContainer: {
    height: 250,
    position: 'relative',
  },
  hotelImage: {
    width,
    height: 250,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  priceSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  pricePerNight: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  totalPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  roomTypeCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  roomTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  roomTypePrice: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 4,
  },
  roomTypeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});