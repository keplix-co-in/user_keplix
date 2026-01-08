import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  Modal,
  PanResponder,
  Animated,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from "react-native-vector-icons/Foundation";
import Entypo from 'react-native-vector-icons/Entypo';
import { servicesAPI } from '../../services/api';

const CustomSlider = ({ min, max, value, step, onChange }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const position = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const newPosition = getPositionFromValue(value);
    position.setValue(newPosition);
  }, [value]);

  const getValueFromPosition = (pos) => {
    const range = max - min;
    const percentage = pos / sliderWidth;
    const value = min + percentage * range;
    const steppedValue = Math.round(value / step) * step;
    return Math.min(max, Math.max(min, steppedValue));
  };

  const getPositionFromValue = (value) => {
    const range = max - min;
    const percentage = (value - min) / range;
    return percentage * sliderWidth;
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newPosition = Math.min(
        sliderWidth,
        Math.max(0, gestureState.dx + position._value)
      );
      position.setValue(newPosition);
      const newValue = getValueFromPosition(newPosition);
      onChange(newValue);
    },
    onPanResponderRelease: () => {
      const finalValue = getValueFromPosition(position._value);
      onChange(finalValue);
    },
  });

  const ProviderList = () => {
    const route = useRoute();
    const { service } = route.params || {};
  };

  return (
    <View
      className="h-10 justify-center relative"
      onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
    >
      <View className="h-1 bg-[#E2E2E2] rounded-sm" />
      <Animated.View
        className="h-1 bg-[#DC2626] rounded-sm absolute"
        style={{ width: position }}
      />
      <Animated.View
        {...panResponder.panHandlers}
        className="w-5 h-5 bg-[#DC2626] rounded-full absolute top-2.5 -ml-2.5 shadow-md"
        style={{
          transform: [{ translateX: position }],
        }}
      />
    </View>
  );
};


export default function ProviderList({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [distance, setDistance] = useState(10);
  const [price, setPrice] = useState(25000);
  const [rating, setRating] = useState(4);
  const [activeFilters, setActiveFilters] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get service type from navigation params
  const serviceType = route?.params?.service || '';

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    applyAllFilters();
  }, [services, distance, price, rating, searchQuery]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAllServices();

      // Filter by service type if provided
      let filtered = response.data;
      if (serviceType) {
        filtered = filtered.filter(service =>
          service.name?.toLowerCase().includes(serviceType.toLowerCase()) ||
          service.category?.toLowerCase().includes(serviceType.toLowerCase())
        );
      }

      setServices(filtered);
      setFilteredServices(filtered);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Fallback to mock data
      const mockData = [
        {
          id: '1',
          name: 'Engine Repair',
          vendor_name: 'Dwarka mor service',
          price: 10499,
          rating: 4.0,
          reviewCount: 128,
          distance: 7,
          vendor_address: 'Dwarka Mor, New Delhi',
          image: require('../../assets/images/r1.jpg'),
          is_available: true,
        },
        {
          id: '2',
          name: 'Car Detailing',
          vendor_name: 'Premium Auto Care',
          price: 2999,
          rating: 4.5,
          reviewCount: 256,
          distance: 3,
          vendor_address: 'Janakpuri, New Delhi',
          image: require('../../assets/images/r.png'),
          is_available: true,
        },
        {
          id: '3',
          name: 'AC Service',
          vendor_name: 'Cool Breeze Auto',
          price: 1499,
          rating: 4.2,
          reviewCount: 89,
          distance: 5,
          vendor_address: 'Rajouri Garden, New Delhi',
          image: require('../../assets/images/r1.jpg'),
          is_available: true,
        },
        {
          id: '4',
          name: 'Brake Service',
          vendor_name: 'Safe Drive Motors',
          price: 3499,
          rating: 4.3,
          reviewCount: 145,
          distance: 4,
          vendor_address: 'Punjabi Bagh, New Delhi',
          image: require('../../assets/images/r.png'),
          is_available: true,
        },
        {
          id: '5',
          name: 'Oil Change',
          vendor_name: 'Quick Service Center',
          price: 899,
          rating: 4.1,
          reviewCount: 203,
          distance: 2,
          vendor_address: 'Tilak Nagar, New Delhi',
          image: require('../../assets/images/r1.jpg'),
          is_available: true,
        },
        {
          id: '6',
          name: 'Tire Replacement',
          vendor_name: 'Wheel Masters',
          price: 5999,
          rating: 4.4,
          reviewCount: 167,
          distance: 6,
          vendor_address: 'Vikaspuri, New Delhi',
          image: require('../../assets/images/r.png'),
          is_available: true,
        },
        {
          id: '7',
          name: 'Battery Service',
          vendor_name: 'Power Auto Solutions',
          price: 4500,
          rating: 4.0,
          reviewCount: 92,
          distance: 8,
          vendor_address: 'Uttam Nagar, New Delhi',
          image: require('../../assets/images/r1.jpg'),
          is_available: true,
        },
        {
          id: '8',
          name: 'Car Inspection',
          vendor_name: 'Expert Check Auto',
          price: 1999,
          rating: 4.6,
          reviewCount: 312,
          distance: 4,
          vendor_address: 'Janakpuri West, New Delhi',
          image: require('../../assets/images/r.png'),
          is_available: true,
        },
      ];
      setServices(mockData);
      setFilteredServices(mockData);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const applyAllFilters = () => {
    let filtered = [...services];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(service =>
      parseFloat(service.price || 0) <= price
    );

    // Apply rating filter (if rating data is available)
    // Note: Backend doesn't have rating yet, so this is placeholder
    // filtered = filtered.filter(service => 
    //   (service.rating || 0) >= rating
    // );

    setFilteredServices(filtered);
  };

  const applyFilters = () => {
    const newFilters = [];

    if (distance < 20) newFilters.push(`${distance}km`);
    if (price < 50000) newFilters.push(`Below ₹${(price / 1000).toFixed(0)}k`);
    if (rating > 1) newFilters.push(`${rating}.0+ rating`);

    setActiveFilters(newFilters);
    setModalVisible(false);
    applyAllFilters();
  };

  const removeFilter = (index) => {
    const newFilters = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(newFilters);

    // Reset filter values
    if (index === 0) setDistance(20);
    if (index === 1) setPrice(50000);
    if (index === 2) setRating(1);
  };

  const renderProvider = ({ item }) => (
    <TouchableOpacity
      className="bg-white border border-gray-100 rounded-2xl mx-5 mb-4 overflow-hidden shadow-sm"
      onPress={() => navigation.navigate("ProviderDetails", { service: item })}
      activeOpacity={0.7}
    >
      {/* Image Section */}
      <View className="relative">
        <Image
          source={item.image ? { uri: item.image } : require('../../assets/images/p1.png')}
          className="w-full h-48"
          resizeMode="cover"
        />

        {/* Offer Badge */}
        <View className="absolute bottom-0 left-0 bg-red-600 px-3 py-1.5 rounded-tr-xl flex-row items-center">
          <Ionicons name="pricetag" size={12} color="white" />
          <Text className="text-white text-xs font-bold font-dm ml-1">Flat ₹100 off</Text>
        </View>

        {/* Bookmark Icon */}
        <TouchableOpacity
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full items-center justify-center"
          onPress={(e) => {
            e.stopPropagation();
            console.log('Bookmark pressed');
          }}
        >
          <Ionicons name="bookmark-outline" size={18} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 font-dm mb-1" numberOfLines={1}>
          {item.vendor_name || 'Service Provider'}
        </Text>

        {/* Rating and Reviews */}
        <View className="flex-row items-center mb-2">
          <Text className="text-sm text-gray-700 font-semibold font-dm mr-1">
            {item.rating || '4.0'}
          </Text>
          <View className="flex-row mr-2">
            {[1, 2, 3, 4].map((star) => (
              <Ionicons key={star} name="star" size={12} color="#FFA500" />
            ))}
            <Ionicons name="star-outline" size={12} color="#FFA500" />
          </View>
          <Text className="text-xs text-gray-500 font-dm">
            ({item.reviewCount || '120'})
          </Text>
        </View>

        {/* Distance */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="location" size={14} color="#9CA3AF" />
          <Text className="text-sm text-gray-600 font-dm ml-1" numberOfLines={1}>
            {item.distance || '7'} km, {item.vendor_address || 'Location address...'}
          </Text>
        </View>

        {/* Price and Status */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900 font-dm">
            ₹{item.price?.toLocaleString('en-IN') || '0'}
          </Text>
          {item.is_available === false && (
            <Text className="text-xs text-red-600 font-semibold font-dm">Unavailable</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 pt-5 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-gray-900 font-dm flex-1">Garages</Text>
      </View>

      <View className="flex-row items-center border-2 border-[#E8E8E8] rounded-full px-4 py-3 mx-5 mb-4">
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 ml-2 text-base text-gray-900 font-dm"
          placeholder="Search services or providers..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View className="flex-row justify-between items-center px-5 mb-3">
        <Text className="text-sm text-gray-600 font-dm">
          {filteredServices.length} results
        </Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="flex-row items-center gap-2 px-3 py-2 border border-[#E8E8E8] rounded-full"
        >
          <Foundation name="filter" size={18} color="#DC2626" />
          <Text className="text-sm font-semibold text-gray-900 font-dm">Filters</Text>
          {activeFilters.length > 0 && (
            <View className="w-5 h-5 bg-red-600 rounded-full items-center justify-center">
              <Text className="text-xs text-white font-bold">{activeFilters.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {activeFilters.length > 0 && (
        <View className="flex-row flex-wrap px-5 mb-3">
          {activeFilters.map((filter, index) => (
            <View key={index} className="flex-row items-center bg-red-50 border border-red-200 rounded-full px-3 py-1.5 mr-2 mb-2">
              <Text className="text-sm text-red-600 font-semibold font-dm mr-2">{filter}</Text>
              <TouchableOpacity onPress={() => removeFilter(index)}>
                <Ionicons name="close-circle" size={18} color="#DC2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#DC2626" />
          <Text className="text-gray-500 mt-2 font-dm">Loading services...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#DC2626']} />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center py-20">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="search-outline" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-900 text-lg font-semibold font-dm">No services found</Text>
              <Text className="text-gray-500 text-sm font-dm mt-2 text-center px-10">
                Try adjusting your search or filters
              </Text>
            </View>
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-t-[20px]">
            <TouchableOpacity
              activeOpacity={1}
              className="p-6"
              onPress={e => e.stopPropagation()}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-bold text-gray-900 font-dm">Filters</Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={20} color="#374151" />
                </TouchableOpacity>
              </View>

              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-3 font-dm">Distance</Text>
                <Text className="text-sm text-gray-600 mb-3 font-dm">{distance} km</Text>
                <CustomSlider
                  min={1}
                  max={20}
                  step={1}
                  value={distance}
                  onChange={setDistance}
                />
              </View>

              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-3 font-dm">Price</Text>
                <Text className="text-sm text-gray-600 mb-3 font-dm">₹0 - ₹{price.toLocaleString()}</Text>
                <CustomSlider
                  min={0}
                  max={50000}
                  step={1000}
                  value={price}
                  onChange={setPrice}
                />
              </View>

              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-3 font-dm">Ratings</Text>
                <View className="flex-row gap-3 flex-wrap">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <TouchableOpacity
                      key={value}
                      className={`items-center gap-1 ${rating === value ? '' : ''
                        }`}
                      onPress={() => setRating(value)}
                    >
                      <View className={`w-10 h-10 rounded-full items-center justify-center ${rating === value ? 'bg-red-600' : 'bg-gray-100'
                        }`}>
                        <Ionicons
                          name="star"
                          size={20}
                          color={rating === value ? '#FFF' : '#9CA3AF'}
                        />
                      </View>
                      <Text className={`text-xs font-dm ${rating === value ? 'text-red-600 font-semibold' : 'text-gray-500'
                        }`}>{value}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                className="bg-red-600 rounded-full py-4 items-center mt-6"
                onPress={applyFilters}
              >
                <Text className="text-white text-base font-semibold font-dm">Apply Filters</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

