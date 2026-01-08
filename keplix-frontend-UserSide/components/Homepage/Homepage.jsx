import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { FlatList, ActivityIndicator } from "react-native";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { bookingsAPI, servicesAPI } from '../../services/api';
import locationService from '../../services/locationService';
import { getImageUrl } from '../../utils/imageHelper';
import HomeMapSection from './HomeMapSection';

// Memoized workshop card component
const WorkshopCard = memo(({ item, navigation }) => {
  const imageSource = getImageUrl(item?.image_url) || require("../../assets/images/r1.jpg");
  
  return (
    <TouchableOpacity
      className="w-64 mr-3 bg-white border border-gray-200 rounded-2xl overflow-hidden"
      onPress={() => navigation.navigate("ProviderDetails", { provider: item })}
    >
      <View className="relative">
        <Image
          source={imageSource}
          className="w-full h-28"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 bg-red-600 px-3 py-1 rounded-tr-xl flex-row items-center">
          <Ionicons name="pricetag" size={10} color="white" />
          <Text className="text-white text-[10px] font-bold font-dm ml-1">
            Ends in 5h 22m
          </Text>
        </View>
        <TouchableOpacity className="absolute top-2 right-2 w-7 h-7 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm">
          <Ionicons name="bookmark-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
      <View className="p-3">
        <Text className="text-sm font-semibold font-dm text-gray-900" numberOfLines={1}>
          {item?.vendor_name || 'Workshop Name'}
        </Text>
        <Text className="text-xs text-gray-500 font-dm mb-1" numberOfLines={1}>
          {item?.name || 'Service Name'}
        </Text>
        <View className="flex-row items-center mt-1">
          <Text className="text-xs text-gray-700 font-dm">4.0</Text>
          <View className="flex-row ml-1">
            {[1, 2, 3, 4].map(i => (
              <Ionicons key={i} name="star" size={10} color="#FFA500" />
            ))}
            <Ionicons name="star-outline" size={10} color="#FFA500" />
          </View>
          <Text className="text-xs text-gray-500 font-dm ml-1">(120)</Text>
        </View>
        <View className="flex-row items-center mt-1.5 justify-between">
          <View className="flex-row items-center">
            <Ionicons name="location" size={12} color="#666" />
            <Text className="text-[10px] text-gray-600 font-dm ml-1" numberOfLines={1}>
              2.5 km nearby
            </Text>
          </View>
          <Text className="text-sm font-bold font-dm text-gray-900">
             ₹{item?.price ? parseFloat(item.price).toLocaleString('en-IN') : '0'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

WorkshopCard.displayName = 'WorkshopCard';

// Memoized service item
const FeaturedServiceItem = memo(({ item, onPress }) => (
  <TouchableOpacity
    className="items-center mb-4"
    style={{ width: '23%' }}
    onPress={onPress}
  >
    <View className="w-full aspect-square bg-gray-50 rounded-2xl items-center justify-center mb-2">
      <MaterialCommunityIcons name={item.icon} size={28} color="#DC2626" />
    </View>
    <Text className="text-[10px] text-gray-700 text-center font-medium font-dm w-full leading-3" numberOfLines={2}>
      {item.label}
    </Text>
  </TouchableOpacity>
));

FeaturedServiceItem.displayName = 'FeaturedServiceItem';

export default function Homepage({ navigation }) {
  const [activeDot, setActiveDot] = useState(0);
  const [userName, setUserName] = useState('User');
  const [userImage, setUserImage] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [nearbyServices, setNearbyServices] = useState([]); // State for nearby workshops
  const [loadingNearby, setLoadingNearby] = useState(true);
  const [userId, setUserId] = useState(null);
  const [locationText, setLocationText] = useState('Set your location');
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  // Memoize static data to prevent re-creation on every render
  const featuredServices = useMemo(() => [
    { icon: "car-wrench", label: "Car Service & Repairs", route: "Service" },
    { icon: "spray-bottle", label: "Car cleaning", route: "Cleaning" },
    { icon: "spray", label: "Dents & Painting", route: "Dents" },
    { icon: "car-seat", label: "Interior Services", route: "Interior" },
    { icon: "tire", label: "Tyre & Wheel Services", route: "Tyres" },
    { icon: "air-conditioner", label: "AC Services & Repair", route: "AC" },
    { icon: "ambulance", label: "Emergency Services", route: "Emergency" },
    { icon: "car-battery", label: "Battery Services", route: "Battery" },
    { icon: "clipboard-check-outline", label: "Car Inspection", route: "Inspection" },
    { icon: "shield-car", label: "Car Insurance", route: "Insurance" },
    { icon: "car-light-high", label: "Windshield & Lights", route: "Windshield" },
    { icon: "engine", label: "Mechanical Repairs", route: "Mechanical" },
  ], []);

  const banners = useMemo(() => [
    {
      color: "#111827", // Dark background
      iconBgColor: "#1F2937",
      discountText: "15%", // Matches screenshot
      discountDescription: "discount on the first order.",
    },
    {
      color: "#111827",
      iconBgColor: "#1F2937",
      discountText: "24/7",
      discountDescription: "Delivery service",
    },
  ], []);

  const currentBanner = banners[activeDot];

  // Fetch user data and bookings on mount
  useEffect(() => {
    fetchUserData();
    fetchNearbyServices();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUpcomingBookings();
    } else {
      setUpcomingBookings([]);
      setLoadingBookings(false);
    }
  }, [userId]);

  const fetchNearbyServices = async () => {
    try {
      setLoadingNearby(true);
      const response = await servicesAPI.getAllServices();
      // Only take first 10 for now
      setNearbyServices(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching services:', error);
      setNearbyServices([]);
    } finally {
      setLoadingNearby(false);
    }
  };

  const mockBookings = [
    {
      id: 'mock-1',
      service: {
        name: 'Engine Repair',
        vendor_name: 'Dwarka mor service',
        image: require('../../assets/images/r1.jpg'), // Ensure this exists or use a URI
      },
      booking_date: '2024-06-26',
      booking_time: '16:30',
      price: 10499,
      status: 'confirmed'
    },
    {
      id: 'mock-2',
      service: {
        name: 'Car Cleaning',
        vendor_name: 'Super Clean Auto',
        image: require('../../assets/images/r.png'),
      },
      booking_date: '2024-06-28',
      booking_time: '10:00',
      price: 599,
      status: 'pending'
    }
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prevDot) => (prevDot + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Load location data on mount and when screen focuses
  useEffect(() => {
    if (isFocused) {
      loadLocationData();
    }
  }, [isFocused]);

  const loadLocationData = async () => {
    try {
      const { address } = await locationService.loadSavedLocation();
      if (address) {
        const { city, district, street, subregion } = address;
        const locationString = [street, city, subregion, district]
          .filter(Boolean)
          .join(', ');
        setLocationText(locationString || 'Location updated');
      } else {
        // Fallback to checking permission status if no saved address
        const permission = await locationService.hasPermission();
        setHasLocationPermission(permission);
        setLocationText(permission ? 'Current Location' : 'Set your location');
      }
    } catch (error) {
      console.error('Error loading location:', error);
      setLocationText('Set your location');
    }
  };

  const handleLocationPress = () => {
    // Navigate to MapLocationPicker to change location on a map
    navigation.navigate('MapLocationPicker');
  };

  const fetchUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.user_id || user.id);
        setUserName(user.name || user.username || user.email?.split('@')[0] || 'User');
        if (user.profile_picture) {
          setUserImage({ uri: user.profile_picture });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUpcomingBookings = async () => {
    try {
      setLoadingBookings(true);
      const response = await bookingsAPI.getUserBookings(userId);

      // Filter upcoming bookings (confirmed or pending, future dates)
      const now = new Date();
      const upcoming = response.data
        .filter(booking => {
          const bookingDate = new Date(booking.booking_date);
          return (booking.status === 'pending' || booking.status === 'confirmed') &&
            bookingDate >= now;
        })
        .sort((a, b) => new Date(a.booking_date) - new Date(b.booking_date))
        .slice(0, 5); // Get only first 5

      if (upcoming.length > 0) {
        setUpcomingBookings(upcoming);
      } else {
        setUpcomingBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setUpcomingBookings([]); 
    } finally {
      setLoadingBookings(false);
    }
  };

  // Memoize formatting functions to prevent re-creation
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    }
  }, []);

  const formatTime = useCallback((timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: currentBanner.color }}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header with Location and Banner */}
        <View style={{ backgroundColor: currentBanner.color }}>
          {/* Top Bar with Location */}
          <View className="px-4 pt-2 pb-2 flex-row justify-between items-center">
            <TouchableOpacity
              className="flex-row items-center bg-gray-800/80 px-4 py-2 rounded-full flex-1 mr-3"
              onPress={handleLocationPress}
              activeOpacity={0.7}
            >
              <Ionicons name="location-sharp" size={14} color="#EF4444" />
              <Text className="text-gray-200 text-xs font-dm ml-2 flex-1" numberOfLines={1}>
                {locationText}
              </Text>
            </TouchableOpacity>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => navigation.navigate("SearchPage")}
                className="w-10 h-10 bg-gray-800/80 rounded-full items-center justify-center"
              >
                <Ionicons name="search-outline" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                className="w-10 h-10 bg-gray-800/80 rounded-full items-center justify-center"
                onPress={() => navigation.navigate("HamburgerMenu")}
              >
                <MaterialCommunityIcons name="dots-vertical" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Banner Discount Section */}
          <View className="px-5 pt-8 pb-10">
            <View className="flex-row items-center">
              <Text className="text-white font-bold font-dm" style={{ fontSize: 56, lineHeight: 60 }}>
                {currentBanner.discountText}
              </Text>
              <View className="ml-4 flex-1">
                <Text className="text-white font-medium font-dm" style={{ fontSize: 18, lineHeight: 24 }}>
                  {currentBanner.discountDescription}
                </Text>
              </View>
            </View>

            {/* Dots Indicator */}
            <View className="flex-row mt-6 gap-1.5">
              {banners.map((_, index) => (
                <View
                  key={index}
                  className={`h-1.5 rounded-full ${index === activeDot ? 'w-5 bg-red-500' : 'w-1.5 bg-gray-600'
                    }`}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Featured Services */}
        <View className="bg-white px-4 pt-5 pb-2  rounded-t-3xl">
          <Text className="text-base font-semibold font-dm text-gray-900 mb-3">Featured Services</Text>

          <View className="flex-row flex-wrap justify-between">
            {featuredServices.slice(0, 12).map((item, index) => (
              <FeaturedServiceItem
                key={index}
                item={item}
                onPress={() => navigation.navigate("ProviderList", { service: item.route })}
              />
            ))}
          </View>
        </View>

        {/* Upcoming Services */}
        <View className="bg-white px-4 py-4">
          <Text className="text-base font-semibold font-dm text-gray-900 mb-3">Upcoming services</Text>

          {loadingBookings ? (
            <View className="bg-white border border-gray-200 rounded-2xl p-4 items-center">
              <ActivityIndicator size="small" color="#DC2626" />
              <Text className="text-gray-500 text-sm font-dm mt-2">Loading...</Text>
            </View>
          ) : upcomingBookings.length > 0 ? (
            upcomingBookings.slice(0, 3).map((booking) => (
              <View
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl p-3 mb-3"
              >
                {/* Top Section: Image and Details */}
                <View className="flex-row">
                  <Image
                    source={getImageUrl(booking.service?.image_url) || require('../../assets/images/r1.jpg')}
                    className="w-20 h-20 rounded-xl bg-gray-200"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-3 justify-between py-1">
                    <View>
                      <Text className="text-base font-bold font-dm text-gray-900" numberOfLines={1}>
                        {booking.service?.name || 'Service Name'}
                      </Text>
                      <Text className="text-xs text-gray-500 font-dm" numberOfLines={1}>
                        {booking.service?.vendor_name || 'Vendor Name'}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-xs text-gray-600 font-medium font-dm">
                        {formatDate(booking.booking_date)} • {formatTime(booking.booking_time)}
                      </Text>
                      <Text className="text-sm font-bold font-dm text-gray-900 mt-0.5">
                        ₹{booking.service?.price || booking.price || '0'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Bottom Section: Actions */}
                <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <TouchableOpacity onPress={() => console.log('Need help')}>
                    <Text className="text-xs text-gray-500 font-medium font-dm text-underline">Need help?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-red-600 px-4 py-2 rounded-lg"
                    onPress={() => navigation.navigate("BookingDetails", { booking })}
                  >
                    <Text className="text-white text-xs font-bold font-dm">View details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View className="bg-white border border-gray-200 rounded-2xl p-4 items-center">
              <MaterialIcons name="event-busy" size={36} color="#9CA3AF" />
              <Text className="text-gray-500 text-sm font-dm mt-2">No upcoming services</Text>
            </View>
          )}
        </View>

        {/* Workshops Nearby */}
        <View className="bg-white px-4 py-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold font-dm text-gray-900">Workshops Nearby</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ProviderList")}>
              <Text className="text-red-600 text-xs font-medium font-dm">See All →</Text>
            </TouchableOpacity>
          </View>

          {loadingNearby ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : nearbyServices.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
              {nearbyServices.map((service, index) => (
                <WorkshopCard key={service.id || index} item={service} navigation={navigation} />
              ))}
            </ScrollView>
          ) : (
            <Text className="text-gray-500 text-sm font-dm">No workshops found nearby</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ServiceItem = ({ icon, text, onPress }) => (
  <TouchableOpacity className="p-4 border-2 border-[#E2E2E2] rounded-full mr-2.5 items-center flex-row py-2.5 px-5" onPress={onPress}>
    <MaterialIcons name={icon} size={24} color="#666" />
    <Text className="text-xl font-medium font-dm text-black ml-1">{text}</Text>
  </TouchableOpacity>
);

