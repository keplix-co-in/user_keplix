import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { servicesAPI } from '../../services/api';

// Memoized Service Card Component
const ServiceCard = memo(({ service, onPress }) => {
  const defaultImage = require('../../assets/images/p1.png');
  const serviceImage = service.image_url ? { uri: service.image_url } : defaultImage;

  return (
    <TouchableOpacity
      className="bg-white border border-gray-100 rounded-2xl mb-4 mx-5 shadow-sm"
      onPress={() => onPress(service)}
      activeOpacity={0.7}
    >
      {/* Service Image */}
      <Image
        source={serviceImage}
        className="w-full h-40 rounded-t-2xl bg-gray-100"
        resizeMode="cover"
      />

      {/* Service Info */}
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-bold font-dm text-gray-900 flex-1 mr-2" numberOfLines={1}>
            {service.name}
          </Text>
          <View className="bg-red-50 px-3 py-1 rounded-full">
            <Text className="text-red-600 text-xs font-bold font-dm">
              ₹{service.price?.toLocaleString('en-IN') || '0'}
            </Text>
          </View>
        </View>

        {/* Provider Info */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="business-outline" size={14} color="#6B7280" />
          <Text className="text-sm text-gray-600 font-dm ml-1.5" numberOfLines={1}>
            {service.vendor_name || 'Service Provider'}
          </Text>
        </View>

        {/* Metadata Row */}
        <View className="flex-row items-center justify-between">
          {/* Rating */}
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#FFA500" />
            <Text className="text-sm font-semibold font-dm text-gray-900 ml-1">
              {service.rating || '4.0'}
            </Text>
            <Text className="text-xs text-gray-500 font-dm ml-1">
              ({service.reviewCount || '0'})
            </Text>
          </View>

          {/* Duration */}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text className="text-sm text-gray-600 font-dm ml-1">
              {service.duration || '2-3 days'}
            </Text>
          </View>

          {/* Distance */}
          {service.distance && (
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text className="text-sm text-gray-600 font-dm ml-1">
                {service.distance} km
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

ServiceCard.displayName = 'ServiceCard';

// Category Chip Component
const CategoryChip = memo(({ category, isActive, onPress }) => (
  <TouchableOpacity
    className={`px-5 py-2.5 rounded-full mr-3 ${isActive ? 'bg-red-600' : 'bg-gray-100'
      }`}
    onPress={onPress}
  >
    <Text className={`text-sm font-semibold font-dm ${isActive ? 'text-white' : 'text-gray-700'
      }`}>
      {category}
    </Text>
  </TouchableOpacity>
));

CategoryChip.displayName = 'CategoryChip';

export default function ServicesCard({ navigation }) {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  const categories = ['All', 'Cleaning', 'Repairs', 'Inspection', 'Maintenance'];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [selectedCategory, searchQuery, services]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAllServices();

      if (response.data && response.data.length > 0) {
        setServices(response.data);
      } else {
        // Fallback to mock data
        setServices(getMockServices());
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setServices(getMockServices());
    } finally {
      setLoading(false);
    }
  };

  const getMockServices = () => [
    {
      id: 'service-1',
      name: 'Engine Repair',
      category: 'Repairs',
      price: 10499,
      rating: 4.0,
      reviewCount: 128,
      duration: '2-3 days',
      vendor_name: 'Dwarka mor service',
      distance: 7,
      image: null,
    },
    {
      id: 'service-2',
      name: 'Car Wash Premium',
      category: 'Cleaning',
      price: 599,
      rating: 4.5,
      reviewCount: 256,
      duration: '1-2 hours',
      vendor_name: 'Speedy Clean',
      distance: 3,
      image: null,
    },
    {
      id: 'service-3',
      name: 'Brake Inspection',
      category: 'Inspection',
      price: 1299,
      rating: 4.2,
      reviewCount: 89,
      duration: '1 day',
      vendor_name: 'Safety First Auto',
      distance: 5,
      image: null,
    },
    {
      id: 'service-4',
      name: 'Oil Change',
      category: 'Maintenance',
      price: 899,
      rating: 4.3,
      reviewCount: 342,
      duration: '30 mins',
      vendor_name: 'Quick Service Center',
      distance: 2,
      image: null,
    },
    {
      id: 'service-5',
      name: 'AC Service',
      category: 'Repairs',
      price: 2499,
      rating: 4.1,
      reviewCount: 167,
      duration: '1-2 days',
      vendor_name: 'Cool Breeze Auto',
      distance: 6,
      image: null,
    },
    {
      id: 'service-6',
      name: 'Interior Detailing',
      category: 'Cleaning',
      price: 1999,
      rating: 4.6,
      reviewCount: 203,
      duration: '2-3 hours',
      vendor_name: 'Premium Detailers',
      distance: 4,
      image: null,
    },
  ];

  const filterServices = () => {
    let filtered = [...services];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        s => s.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.name?.toLowerCase().includes(query) ||
          s.vendor_name?.toLowerCase().includes(query) ||
          s.category?.toLowerCase().includes(query)
      );
    }

    setFilteredServices(filtered);
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadServices();
    setRefreshing(false);
  }, []);

  const handleServicePress = useCallback((service) => {
    navigation.navigate('EngineRepairDetail', {
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
    });
  }, [navigation]);

  const renderServiceItem = useCallback(({ item }) => (
    <ServiceCard service={item} onPress={handleServicePress} />
  ), [handleServicePress]);

  const renderCategoryItem = useCallback(({ item }) => (
    <CategoryChip
      category={item}
      isActive={selectedCategory === item}
      onPress={() => setSelectedCategory(item)}
    />
  ), [selectedCategory]);

  const ListHeaderComponent = useCallback(() => (
    <>
      {/* Search / Date Row */}
      <View className="flex-row items-center justify-between px-5 py-4 min-h-[70px]">
        {searchVisible ? (
          <View className="flex-1 flex-row items-center bg-gray-50 rounded-full px-3 mr-5 border border-gray-200">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-base font-dm text-gray-900"
              placeholder="Search services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => {
              setSearchVisible(false);
              setSearchQuery('');
            }}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold text-gray-900 font-dm">Services</Text>
          </View>
        )}

        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`w-10 h-10 rounded-full border items-center justify-center ${searchVisible ? 'bg-red-50 border-red-200' : 'border-gray-200'
              }`}
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <Ionicons name="search-outline" size={20} color={searchVisible ? "#DC2626" : "#374151"} />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
            onPress={() => navigation.navigate('Filters')}
          >
            <Ionicons name="options-outline" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <View className="mb-4">
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </View>
    </>
  ), [searchVisible, searchQuery, categories, renderCategoryItem]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center" edges={['top']}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="mt-4 text-base text-gray-600 font-dm">Loading services...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center border border-gray-100"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-gray-900 font-dm absolute left-0 right-0 text-center -z-10">
          All Services
        </Text>

        <View className="w-10" />
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View className="items-center mt-10 px-5">
            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 font-dm text-center mt-4">
              {searchQuery ? 'No services found matching your search' : 'No services available'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
