// screens/HotelListScreen.js
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for hotels (you can move this to a separate file)
const mockHotels = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.5,
    pricePerNight: 120,
    location: "Downtown",
    amenities: ["WiFi", "Pool", "Gym", "Spa"],
    roomTypes: [
      {
        name: "Standard Room",
        price: 120,
        description: "Comfortable room with all essential amenities",
      },
      {
        name: "Deluxe Room",
        price: Math.round(120 * 1.3),
        description: "Spacious room with premium furnishing and city view",
      },
      {
        name: "Suite",
        price: Math.round(120 * 1.8),
        description:
          "Luxury suite with separate living area and premium amenities",
      },
    ],
  },
  {
    id: 2,
    name: "Ocean View Resort",
    image:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.8,
    pricePerNight: 200,
    location: "Beachfront",
    amenities: ["WiFi", "Pool", "Beach Access", "Restaurant"],
    roomTypes: [
      {
        name: "Standard Room",
        price: 200,
        description: "Comfortable room with all essential amenities",
      },
      {
        name: "Deluxe Room",
        price: Math.round(200 * 1.3),
        description: "Spacious room with premium furnishing and city view",
      },
      {
        name: "Suite",
        price: Math.round(200 * 1.8),
        description:
          "Luxury suite with separate living area and premium amenities",
      },
    ],
  },
  {
    id: 3,
    name: "City Center Inn",
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.2,
    pricePerNight: 80,
    location: "City Center",
    amenities: ["WiFi", "Business Center", "Parking"],
    roomTypes: [
      {
        name: "Standard Room",
        price: 80,
        description: "Comfortable room with all essential amenities",
      },
      {
        name: "Deluxe Room",
        price: Math.round(80 * 1.3),
        description: "Spacious room with premium furnishing and city view",
      },
      {
        name: "Suite",
        price: Math.round(80 * 1.8),
        description:
          "Luxury suite with separate living area and premium amenities",
      },
    ],
  },
  {
    id: 4,
    name: "Mountain Lodge",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.6,
    pricePerNight: 150,
    location: "Mountain View",
    amenities: ["WiFi", "Fireplace", "Hiking Trails", "Restaurant"],
    roomTypes: [
      {
        name: "Standard Room",
        price: 150,
        description: "Comfortable room with all essential amenities",
      },
      {
        name: "Deluxe Room",
        price: Math.round(150 * 1.3),
        description: "Spacious room with premium furnishing and city view",
      },
      {
        name: "Suite",
        price: Math.round(150 * 1.8),
        description:
          "Luxury suite with separate living area and premium amenities",
      },
    ],
  },
  {
    id: 5,
    name: "Budget Stay Hotel",
    image:
      "https://images.unsplash.com/photo-1587985064135-0366536eab42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 3.8,
    pricePerNight: 60,
    location: "Suburbs",
    amenities: ["WiFi", "Parking", "Breakfast"],
    roomTypes: [
      {
        name: "Standard Room",
        price: 60,
        description: "Comfortable room with all essential amenities",
      },
      {
        name: "Deluxe Room",
        price: Math.round(60 * 1.3),
        description: "Spacious room with premium furnishing and city view",
      },
      {
        name: "Suite",
        price: Math.round(60 * 1.8),
        description:
          "Luxury suite with separate living area and premium amenities",
      },
    ],
  },
  {
    id: 6,
    name: "Luxury Suite Hotel",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    rating: 4.9,
    pricePerNight: 300,
    location: "Premium District",
    amenities: ["WiFi", "Concierge", "Spa", "Fine Dining", "Valet Parking"],
    roomTypes: [
      {
        name: "Standard Room",
        price: 300,
        description: "Comfortable room with all essential amenities",
      },
      {
        name: "Deluxe Room",
        price: Math.round(300 * 1.3),
        description: "Spacious room with premium furnishing and city view",
      },
      {
        name: "Suite",
        price: Math.round(300 * 1.8),
        description:
          "Luxury suite with separate living area and premium amenities",
      },
    ],
  },
];

export default function HotelListScreen() {
  // Get search parameters from expo-router
  const params = useLocalSearchParams();
  const { city, checkInDate, checkOutDate, nights } = params;

  // Convert string parameters back to proper types
  const searchParams = {
    city: city || "",
    checkInDate: checkInDate ? new Date(checkInDate) : new Date(),
    checkOutDate: checkOutDate ? new Date(checkOutDate) : new Date(),
    nights: nights ? parseInt(nights) : 1,
  };

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHotels(mockHotels);
      setFilteredHotels(mockHotels);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [hotels, sortBy, maxPrice, minRating]);

  const applyFilters = () => {
    let filtered = [...hotels];

    // Apply price filter
    if (maxPrice) {
      filtered = filtered.filter(
        (hotel) => hotel.pricePerNight <= parseInt(maxPrice)
      );
    }

    // Apply rating filter
    if (minRating) {
      filtered = filtered.filter(
        (hotel) => hotel.rating >= parseFloat(minRating)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.pricePerNight - b.pricePerNight;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredHotels(filtered);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="#FFD700"
        />
      );
    }

    return stars;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleHotelPress = (hotel) => {
    router.push({
      pathname: "/HotelDetailScreen",
      params: {
        hotelId: hotel.id.toString(),
        hotelData: JSON.stringify(hotel),
        ...params, // Pass through search params
      },
    });
  };

  const renderHotelItem = ({ item }) => (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() => handleHotelPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>{renderStars(item.rating)}</View>
          <Text style={styles.ratingText}>({item.rating})</Text>
        </View>
        <View style={styles.amenitiesContainer}>
          {item.amenities.slice(0, 3).map((amenity, index) => (
            <Text key={index} style={styles.amenityTag}>
              {amenity}
            </Text>
          ))}
          {item.amenities.length > 3 && (
            <Text style={styles.amenityTag}>+{item.amenities.length - 3}</Text>
          )}
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.hotelPrice}>${item.pricePerNight}/night</Text>
          <Text style={styles.totalPrice}>
            Total: ${item.pricePerNight * searchParams.nights} for{" "}
            {searchParams.nights} nights
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>
          Finding hotels in {searchParams.city}...
        </Text>
      </View>
    );
  }

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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Hotels in {searchParams.city}</Text>
          <Text style={styles.headerSubtitle}>
            {filteredHotels.length} hotels found
          </Text>
        </View>
      </View>

      <View style={styles.searchSummary}>
        <Text style={styles.summaryText}>
          {searchParams.city} • {searchParams.nights} nights
        </Text>
        <Text style={styles.summaryDates}>
          {formatDate(searchParams.checkInDate)} -{" "}
          {formatDate(searchParams.checkOutDate)}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <TouchableOpacity
              style={styles.sortButton}
              onPress={() => {
                const options = ["name", "price", "rating"];
                const currentIndex = options.indexOf(sortBy);
                const nextIndex = (currentIndex + 1) % options.length;
                setSortBy(options[nextIndex]);
              }}
            >
              <Text style={styles.sortButtonText}>
                {sortBy === "name"
                  ? "Name"
                  : sortBy === "price"
                  ? "Price"
                  : "Rating"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filterRow}>
          <TextInput
            style={styles.filterInput}
            placeholder="Max price per night"
            value={maxPrice}
            onChangeText={setMaxPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Min rating (1-5)"
            value={minRating}
            onChangeText={setMinRating}
            keyboardType="decimal-pad"
          />
        </View>
      </View>

      {filteredHotels.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search" size={64} color="#ccc" />
          <Text style={styles.noResultsText}>No hotels found</Text>
          <Text style={styles.noResultsSubtext}>
            Try adjusting your filters or search criteria
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHotels}
          renderItem={renderHotelItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  searchSummary: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  summaryDates: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  filterContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  sortButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
  listContainer: {
    padding: 15,
  },
  hotelCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hotelImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  hotelInfo: {
    padding: 15,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 6,
  },
  amenityTag: {
    fontSize: 11,
    color: "#2196F3",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: "hidden",
  },
  priceContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  hotelPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
  },
  totalPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
