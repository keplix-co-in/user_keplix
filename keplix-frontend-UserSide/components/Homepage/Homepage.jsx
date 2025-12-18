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
import { bookingsAPI, servicesAPI } from '../../services/api';
import locationService from '../../services/locationService';

// Memoized workshop card component
const WorkshopCard = memo(({ imagePath, navigation }) => (
  <TouchableOpacity
    className="w-64 mr-3 bg-white border border-gray-200 rounded-2xl overflow-hidden"
    onPress={() => navigation.navigate("ProviderDetails")}
  >
    <View className="relative">
      <Image
        source={imagePath}
        className="w-full h-28"
        resizeMode="cover"
      />
      <View className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded-full flex-row items-center">
        <Ionicons name="pricetag" size={10} color="white" />
        <Text className="text-white text-[10px] font-bold font-dm ml-1">Flat ₹100 off</Text>
      </View>
      <TouchableOpacity className="absolute top-2 left-2 w-7 h-7 bg-white/90 rounded-full items-center justify-center">
        <Ionicons name="bookmark-outline" size={16} color="#DC2626" />
      </TouchableOpacity>
    </View>
    <View className="p-2.5">
      <Text className="text-sm font-semibold font-dm text-gray-900" numberOfLines={1}>
        Dwarka mor service
      </Text>
      <View className="flex-row items-center mt-1">
        <Text className="text-xs text-gray-700 font-dm">4.0</Text>
        <View className="flex-row ml-1">
          {[1,2,3,4].map(i => (
            <Ionicons key={i} name="star" size={10} color="#FFA500" />
          ))}
          <Ionicons name="star-outline" size={10} color="#FFA500" />
        </View>
        <Text className="text-xs text-gray-500 font-dm ml-1">(120)</Text>
      </View>
      <View className="flex-row items-center mt-1.5">
        <Ionicons name="location" size={12} color="#666" />
        <Text className="text-[10px] text-gray-600 font-dm ml-1" numberOfLines={1}>
          7 km, Location address...
        </Text>
      </View>
    </View>
  </TouchableOpacity>
));

WorkshopCard.displayName = 'WorkshopCard';

// Memoized service item
const FeaturedServiceItem = memo(({ item, onPress }) => (
  <TouchableOpacity
    className="items-center mb-4"
    style={{ width: '23%' }}
    onPress={onPress}
  >
    <View className="w-full aspect-square bg-white border border-gray-200 rounded-2xl items-center justify-center mb-1.5">
      <MaterialCommunityIcons name={item.icon} size={32} color="#DC2626" />
    </View>
    <Text className="text-[9px] text-gray-700 text-center font-dm w-full" numberOfLines={2} style={{ lineHeight: 11 }}>
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
  const [userId, setUserId] = useState(null);
  const [locationText, setLocationText] = useState('Set your location');
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const insets = useSafeAreaInsets();

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
      color: "#F59E0B",
      iconBgColor: "#FCD34D",
      discountText: "24/7",
      discountDescription: "Delivery service",
    },
    {
      color: "#DC2626",
      iconBgColor: "#EF4444",
      discountText: "15%",
      discountDescription: "discount on the first order.",
    },
  ], []);

  const currentBanner = banners[activeDot];

  // Fetch user data and bookings on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUpcomingBookings();
    }
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prevDot) => (prevDot + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Load location data on mount and when screen focuses
  useEffect(() => {
    loadLocationData();
    
    // Add focus listener to reload location when returning to this screen
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Homepage focused, reloading location');
      // Force reload location data
      setTimeout(() => {
        loadLocationData();
      }, 100);
    });

    return unsubscribe;
  }, [navigation]);

  const loadLocationData = async () => {
    try {
      console.log('Loading location data...');
      const locationSummary = await locationService.getLocationSummary();
      console.log('Location summary:', locationSummary);
      setHasLocationPermission(locationSummary.hasPermission);
      setLocationText(locationSummary.shortText || 'Set your location');
    } catch (error) {
      console.error('Error loading location:', error);
      setLocationText('Set your location');
    }
  };

  const handleLocationPress = () => {
    console.log('Location button pressed, navigating to LocationPicker');
    // Navigate to LocationPicker - location will be updated via focus listener on return
    navigation.navigate('LocationPicker');
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
      
      setUpcomingBookings(upcoming);
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
      <ScrollView showsVerticalScrollIndicator={false} className="bg-gray-50" contentContainerStyle={{ paddingTop: insets.top }}>
        {/* Header with Location and Banner */}
        <View style={{ backgroundColor: currentBanner.color }}>
          {/* Top Bar with Location */}
          <View className="px-4 pt-2 pb-2 flex-row justify-between items-center">
            <TouchableOpacity 
              className="flex-row items-center bg-white/20 px-3 py-1.5 rounded-full flex-1 mr-3"
              onPress={handleLocationPress}
              activeOpacity={0.7}
            >
              <Ionicons name="location-sharp" size={14} color="white" />
              <Text className="text-white text-xs font-dm ml-1 flex-1" numberOfLines={1}>
                {locationText}
              </Text>
              <Ionicons name="chevron-down" size={14} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate("SearchPage")}
              className="w-9 h-9 bg-white/20 rounded-full items-center justify-center mr-2"
            >
              <Ionicons name="search-outline" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate("ScreenTester")}
              className="w-9 h-9 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons name="grid" size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Banner Discount Section */}
          <View className="px-5 pt-2 pb-6">
            <View className="flex-row items-center">
              <Text className="text-white font-bold font-dm" style={{ fontSize: 48, lineHeight: 52 }}>
                {currentBanner.discountText}
              </Text>
              <View className="ml-4 flex-1">
                <Text className="text-white font-medium font-dm" style={{ fontSize: 16, lineHeight: 20 }}>
                  {currentBanner.discountDescription}
                </Text>
              </View>
            </View>
            
            {/* Dots Indicator */}
            <View className="flex-row mt-2 gap-1">
              {banners.map((_, index) => (
                <View
                  key={index}
                  className={`h-1 rounded-full ${
                    index === activeDot ? 'w-4 bg-white' : 'w-1 bg-white/50'
                  }`}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Featured Services */}
        <View className="bg-white px-4 pt-5 pb-2 -mt-5 rounded-t-3xl">
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
        <View className="bg-white px-4 py-4 mt-2">
          <Text className="text-base font-semibold font-dm text-gray-900 mb-3">Upcoming services</Text>
          
          {loadingBookings ? (
            <View className="bg-white border border-gray-200 rounded-2xl p-4 items-center">
              <ActivityIndicator size="small" color="#DC2626" />
              <Text className="text-gray-500 text-sm font-dm mt-2">Loading...</Text>
            </View>
          ) : upcomingBookings.length > 0 ? (
            upcomingBookings.slice(0, 1).map((booking) => (
              <TouchableOpacity
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl p-3 flex-row items-center"
                onPress={() => navigation.navigate("BookingDetails", { booking })}
              >
                <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-3">
                  <MaterialCommunityIcons name="wrench" size={22} color="#DC2626" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold font-dm text-gray-900" numberOfLines={1}>
                    {booking.service?.name || 'Detailing'}
                  </Text>
                  <Text className="text-xs text-gray-500 font-dm" numberOfLines={1}>
                    {booking.service?.vendor_name || 'Dwarka mor repair service...'}
                  </Text>
                  <Text className="text-xs text-red-600 font-medium font-dm mt-0.5">
                    {formatDate(booking.booking_date)} | {formatTime(booking.booking_time)}
                  </Text>
                </View>
                <View className="w-9 h-9 bg-red-600 rounded-full items-center justify-center">
                  <Ionicons name="arrow-forward" size={18} color="white" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-white border border-gray-200 rounded-2xl p-4 items-center">
              <MaterialIcons name="event-busy" size={36} color="#9CA3AF" />
              <Text className="text-gray-500 text-sm font-dm mt-2">No upcoming services</Text>
            </View>
          )}
        </View>

        {/* Workshops Nearby */}
        <View className="bg-white px-4 py-4 mt-2 mb-20">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold font-dm text-gray-900">Workshops Nearby</Text>
            <TouchableOpacity onPress={() => navigation.navigate("ProviderList")}>
              <Text className="text-red-600 text-xs font-medium font-dm">See All →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
            <WorkshopCard imagePath={require("../../assets/images/r.png")} navigation={navigation} />
            <WorkshopCard imagePath={require("../../assets/images/r1.jpg")} navigation={navigation} />
          </ScrollView>
        </View>
      </ScrollView>

      {/* <View style={styles.bottomNav}>
        <NavItem
          icon="home"
          text="Home"
          active
          navigation={navigation}
          targetScreen="HomePage"
        />
        <NavItem
          icon="grid"
          text="Services"
          navigation={navigation}
          targetScreen="ServicesCard"
        />
        <NavItem
          icon="document-text"
          text="Bookings"
          navigation={navigation}
          targetScreen="BookingList"
        />
        <NavItem
          icon="person"
          text="Profile"
          navigation={navigation}
          targetScreen="Profile"
        />
      </View> */}
    </SafeAreaView>
  );
}

const ServiceItem = ({ icon, text, onPress }) => (
  <TouchableOpacity className="p-4 border-2 border-[#E2E2E2] rounded-full mr-2.5 items-center flex-row py-2.5 px-5" onPress={onPress}>
    <MaterialIcons name={icon} size={24} color="#666" />
    <Text className="text-xl font-medium font-dm text-black ml-1">{text}</Text>
  </TouchableOpacity>
);

// const NavItem = ({ icon, text, active, navigation, targetScreen }) => (
//   <TouchableOpacity
//     style={styles.navItem}
//     onPress={() => navigation.navigate(targetScreen)}
//   >
//     <Ionicons name={icon} size={34} color={active ? "red" : "#666"} />
//     <Text style={[styles.navText, active && styles.activeNavText]}>{text}</Text>
//   </TouchableOpacity>
// );
