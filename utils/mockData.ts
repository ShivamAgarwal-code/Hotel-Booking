// -------------------
// data/mockData.js
// -------------------
export const mockHotels = [
  {
    id: 1,
    name: 'Grand Plaza Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    ],
    pricePerNight: 120,
    rating: 4.5,
    description: 'Experience luxury and comfort at the Grand Plaza Hotel, located in the heart of the city. Our hotel offers stunning views, exceptional service, and world-class amenities that will make your stay unforgettable.',
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Parking'],
    roomTypes: [
      {
        name: 'Standard Room',
        price: 120,
        description: 'Comfortable room with city view and modern amenities.',
      },
      {
        name: 'Deluxe Suite',
        price: 200,
        description: 'Spacious suite with separate living area and premium amenities.',
      },
      {
        name: 'Presidential Suite',
        price: 350,
        description: 'Luxurious suite with panoramic city views and premium services.',
      },
    ],
  },
  {
    id: 2,
    name: 'Ocean View Resort',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400',
    ],
    pricePerNight: 180,
    rating: 4.8,
    description: 'Wake up to breathtaking ocean views at our beachfront resort. Enjoy pristine beaches, water sports, and relaxation in a tropical paradise setting.',
    amenities: ['Beach Access', 'Pool', 'Spa', 'Water Sports', 'Restaurant', 'Bar'],
    roomTypes: [
      {
        name: 'Ocean View Room',
        price: 180,
        description: 'Room with direct ocean view and beach access.',
      },
      {
        name: 'Beach Villa',
        price: 280,
        description: 'Private villa steps away from the beach with outdoor terrace.',
      },
    ],
  },
  {
    id: 3,
    name: 'Mountain Lodge',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400',
      'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400',
    ],
    pricePerNight: 95,
    rating: 4.2,
    description: 'Escape to the mountains and enjoy fresh air, hiking trails, and cozy accommodations. Perfect for nature lovers and adventure seekers.',
    amenities: ['Hiking Trails', 'Fireplace', 'Restaurant', 'Free WiFi', 'Parking'],
    roomTypes: [
      {
        name: 'Cozy Cabin',
        price: 95,
        description: 'Rustic cabin with fireplace and mountain views.',
      },
      {
        name: 'Family Lodge',
        price: 150,
        description: 'Spacious lodge perfect for families with multiple bedrooms.',
      },
    ],
  },
  {
    id: 4,
    name: 'Business Center Hotel',
    image: 'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=400',
    images: [
      'https://images.unsplash.com/photo-1495365200479-c4ed1d35e1aa?w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=400',
    ],
    pricePerNight: 140,
    rating: 4.3,
    description: 'Modern hotel designed for business travelers with state-of-the-art meeting facilities, high-speed internet, and convenient location.',
    amenities: ['Business Center', 'Meeting Rooms', 'Free WiFi', 'Gym', 'Restaurant', 'Airport Shuttle'],
    roomTypes: [
      {
        name: 'Business Room',
        price: 140,
        description: 'Modern room with work desk and business amenities.',
      },
      {
        name: 'Executive Suite',
        price: 220,
        description: 'Premium suite with separate office space and meeting area.',
      },
    ],
  },
  {
    id: 5,
    name: 'Boutique Inn',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400',
    ],
    pricePerNight: 160,
    rating: 4.7,
    description: 'Charming boutique hotel with unique character, personalized service, and artistic décor. Each room is individually designed for a memorable stay.',
    amenities: ['Art Gallery', 'Café', 'Library', 'Free WiFi', 'Concierge'],
    roomTypes: [
      {
        name: 'Artist Room',
        price: 160,
        description: 'Uniquely decorated room featuring local artwork.',
      },
      {
        name: 'Designer Suite',
        price: 240,
        description: 'Luxurious suite with custom furniture and premium amenities.',
      },
    ],
  },
];

