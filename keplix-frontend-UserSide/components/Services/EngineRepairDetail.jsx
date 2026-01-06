import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { servicesAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const BillingRow = ({ label, value }) => (
  <View className="flex-row justify-between mb-2.5">
    <Text className="text-gray-600 font-dm">{label}</Text>
    <Text className="font-semibold font-dm text-gray-900">₹{value}/-</Text>
  </View>
);

const RatingStars = ({ rating }) => (
  <View className="flex-row">
    {[1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name={star <= rating ? "star" : "star-outline"}
        size={16}
        color="#FFA500"
        style={{ marginRight: 2 }}
      />
    ))}
  </View>
);

const ShopCard = ({ name, rating, distance, image, onPress }) => (
  <TouchableOpacity
    className="w-[200px] mr-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Image source={image} className="w-full h-[120px] rounded-t-2xl bg-gray-100" resizeMode="cover" />
    <View className="p-3">
      <Text className="text-base font-semibold font-dm mb-2 text-gray-900" numberOfLines={1}>{name}</Text>
      <View className="flex-row items-center mb-2">
        <Text className="mr-1.5 font-semibold font-dm text-gray-900">{rating}</Text>
        <RatingStars rating={Math.round(rating)} />
      </View>
      <View className="flex-row items-center">
        <Ionicons name="location" size={14} color="#9CA3AF" />
        <Text className="ml-1.5 text-gray-500 text-xs font-dm">{distance} km away</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function EngineRepairDetail({ route, navigation }) {
  const [serviceData, setServiceData] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef(null);

  const serviceId = route?.params?.serviceId;
  const serviceName = route?.params?.serviceName || 'Engine Repair';
  const serviceCategory = route?.params?.category || 'Repair';

  // Mock images for carousel
  const serviceImages = [
    require('../../assets/images/p1.png'),
    require('../../assets/images/p4.png'),
    require('../../assets/images/p5.png'),
  ];

  useEffect(() => {
    loadServiceData();
  }, [serviceId]);

  const loadServiceData = async () => {
    try {
      setLoading(true);

      if (serviceId) {
        const response = await servicesAPI.getServiceDetail(serviceId);
        setServiceData(response.data);
      } else {
        setServiceData({
          name: serviceName,
          category: serviceCategory,
          description: 'Complete engine repair and maintenance service. We diagnose engine problems, perform repairs, and ensure optimal engine performance with certified technicians and quality parts.',
          features: [
            'Comprehensive engine diagnostics',
            'Complete engine overhaul and rebuilding',
            'Performance optimization and tuning',
            'Warranty on all repairs',
          ],
          duration: '2-3 Days',
          price: 10499,
          rating: 4.0,
          reviewCount: 128,
          vendor: {
            name: 'Dwarka Mor Service',
            rating: 4.0,
            reviewCount: 89,
            distance: 7,
            location: 'B1-41, Chandan park, Dwarka mor - 110059',
            about: 'Professional car service center with 10+ years of experience. We specialize in engine repairs, maintenance, and performance upgrades with state-of-the-art equipment.',
            facilities: [
              'State-of-the-art diagnostic equipment',
              'Certified and experienced technicians',
              'Genuine and quality spare parts',
              'Comfortable waiting lounge',
            ],
          },
        });
      }

      const servicesResponse = await servicesAPI.getAllServices();
      const services = servicesResponse.data || [];
      const related = services
        .filter(s => s.category === serviceCategory && s.id !== serviceId)
        .slice(0, 5);

      setRelatedServices(related.length > 0 ? related : getMockRelatedServices());

    } catch (error) {
      console.error('Error loading service data:', error);
      setServiceData(getDefaultServiceData());
      setRelatedServices(getMockRelatedServices());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultServiceData = () => ({
    name: serviceName,
    category: serviceCategory,
    description: 'Complete engine repair and maintenance service.',
    features: ['Engine diagnostics', 'Complete overhaul', 'Performance optimization'],
    duration: '2-3 Days',
    price: 10499,
    rating: 4.0,
    reviewCount: 128,
    vendor: {
      name: 'Dwarka Mor Service',
      rating: 4.0,
      reviewCount: 89,
      distance: 7,
      location: 'B1-41, Chandan park, Dwarka mor - 110059',
      about: 'Professional car service center with 10+ years of experience.',
      facilities: ['Diagnostic equipment', 'Certified technicians', 'Quality parts'],
    },
  });

  const getMockRelatedServices = () => [
    {
      id: 'related-1',
      vendor: { name: 'Decaabo Cars', rating: 3.8, distance: 10 },
      image: require('../../assets/images/p4.png'),
    },
    {
      id: 'related-2',
      vendor: { name: 'Fix My Cars', rating: 4.2, distance: 8 },
      image: require('../../assets/images/p5.png'),
    },
  ];

  const handleBookService = async () => {
    try {
      await AsyncStorage.setItem('selected_service', JSON.stringify({
        serviceId: serviceId || 'engine-repair',
        serviceName: serviceData?.name || serviceName,
        servicePrice: serviceData?.price || 10499,
        serviceDuration: serviceData?.duration || '2-3 Days',
        vendorName: serviceData?.vendor?.name || 'Dwarka Mor Service',
        vendorLocation: serviceData?.vendor?.location || 'Dwarka mor',
      }));

      navigation.navigate('BookSlot', {
        serviceData: serviceData,
        serviceId: serviceId,
        serviceName: serviceData?.name || serviceName,
      });
    } catch (error) {
      console.error('Error saving service data:', error);
      Alert.alert('Error', 'Failed to proceed to booking. Please try again.');
    }
  };

  const renderImageItem = ({ item, index }) => (
    <Image
      source={item}
      style={{ width: width, height: 250 }}
      className="bg-gray-100"
      resizeMode="cover"
    />
  );

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentImageIndex(viewableItems[0].index || 0);
    }
  }).current;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center" edges={['top']}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="mt-4 text-gray-500 font-dm">Loading service details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View className="relative">
          <FlatList
            ref={flatListRef}
            data={serviceImages}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `image-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          />

          {/* Back Button Overlay */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-lg"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          {/* Image Indicators */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
            {serviceImages.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full mx-1 ${index === currentImageIndex ? 'w-6 bg-red-600' : 'w-2 bg-white/60'
                  }`}
              />
            ))}
          </View>
        </View>

        {/* Service Info */}
        <View className="px-5 pt-5">
          {/* Title & Price */}
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-2xl font-bold font-dm text-gray-900 flex-1 pr-4">
              {serviceData?.name || serviceName}
            </Text>
            <View className="bg-red-50 px-4 py-2 rounded-full">
              <Text className="text-red-600 text-lg font-bold font-dm">
                ₹{serviceData?.price?.toLocaleString('en-IN') || '0'}
              </Text>
            </View>
          </View>

          {/* Rating & Duration */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-4">
              <Ionicons name="star" size={18} color="#FFA500" />
              <Text className="text-base font-semibold font-dm text-gray-900 ml-1">
                {serviceData?.rating || 4.0}
              </Text>
              <Text className="text-sm text-gray-500 font-dm ml-1">
                ({serviceData?.reviewCount || 0} reviews)
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={18} color="#6B7280" />
              <Text className="text-sm text-gray-600 font-dm ml-1">
                {serviceData?.duration || '2-3 Days'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="text-base text-gray-700 leading-6 font-dm mb-3">
            {serviceData?.description || 'Professional car service with expert technicians and quality parts.'}
          </Text>

          {/* Features */}
          <View className="mb-5">
            {(serviceData?.features || []).map((feature, index) => (
              <View key={index} className="flex-row items-start mb-2">
                <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginTop: 2 }} />
                <Text className="text-gray-700 ml-2 text-sm font-dm flex-1">{feature}</Text>
              </View>
            ))}
          </View>

          {/* Billing Details */}
          <View className="mb-5">
            <Text className="text-lg font-bold font-dm mb-3 text-gray-900">Billing Details</Text>
            <View className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
              <BillingRow label="Base Service Cost:" value={(serviceData?.price || 10499).toString()} />
              <BillingRow label="Labor Cost:" value="2000" />
              <BillingRow label="Additional Cost:" value="500" />
              <View className="border-t border-gray-200 mt-3 pt-3">
                <View className="flex-row justify-between">
                  <Text className="text-base font-bold font-dm text-gray-900">Total Cost:</Text>
                  <Text className="text-xl font-bold font-dm text-red-600">
                    ₹{((serviceData?.price || 10499) + 2500).toLocaleString('en-IN')}/-
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Provider Information */}
          <View className="mb-5">
            <Text className="text-lg font-bold font-dm mb-3 text-gray-900">Service Provider</Text>

            {/* Provider Card */}
            <View className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-xl font-bold font-dm text-gray-900 mb-1">
                    {serviceData?.vendor?.name || 'Service Provider'}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={16} color="#FFA500" />
                    <Text className="ml-1 font-semibold font-dm text-gray-900">
                      {serviceData?.vendor?.rating || 4.0}
                    </Text>
                    <Text className="ml-1 text-sm text-gray-500 font-dm">
                      ({serviceData?.vendor?.reviewCount || 0} reviews)
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full">
                  <Ionicons name="location" size={14} color="#374151" />
                  <Text className="ml-1.5 font-semibold font-dm text-gray-700">
                    {serviceData?.vendor?.distance || 7} km
                  </Text>
                </View>
              </View>

              {/* Location */}
              <View className="mb-3">
                <Text className="font-semibold font-dm text-gray-900 mb-2">Location</Text>
                <View className="flex-row items-start">
                  <Ionicons name="location-outline" size={18} color="#6B7280" style={{ marginTop: 2 }} />
                  <Text className="text-gray-600 flex-1 font-dm ml-2">
                    {serviceData?.vendor?.location || 'B1-41, Chandan park, Dwarka mor - 110059'}
                  </Text>
                </View>
              </View>

              {/* About */}
              <View className="mb-3">
                <Text className="font-semibold font-dm text-gray-900 mb-2">About</Text>
                <Text className="text-gray-600 leading-5 font-dm">
                  {serviceData?.vendor?.about || 'Professional car service center with experienced technicians.'}
                </Text>
              </View>

              {/* Facilities */}
              <View className="mb-3">
                <Text className="font-semibold font-dm text-gray-900 mb-2">Facilities</Text>
                {(serviceData?.vendor?.facilities || []).map((facility, index) => (
                  <View key={index} className="flex-row items-start mb-1">
                    <Text className="text-red-600 mr-2">•</Text>
                    <Text className="text-gray-600 text-sm font-dm flex-1">{facility}</Text>
                  </View>
                ))}
              </View>

              {/* View More Button */}
              <TouchableOpacity
                className="flex-row items-center justify-center py-3 border border-gray-200 rounded-full mt-2"
                onPress={() => navigation.navigate('ProviderDetails', {
                  service: {
                    id: serviceData?.vendor?.id || 'vendor-1',
                    name: serviceData?.name || serviceName,
                    vendor_name: serviceData?.vendor?.name || 'Service Provider',
                    vendor_address: serviceData?.vendor?.location || 'Location not available',
                    vendor_phone: serviceData?.vendor?.contactInfo || '+91 XXXXXXXXXX',
                    description: serviceData?.vendor?.about || 'Professional service provider',
                    price: serviceData?.price || 0,
                    rating: serviceData?.vendor?.rating || 4.0,
                    is_available: true,
                    image: null,
                  }
                })}
              >
                <Text className="font-semibold font-dm text-gray-900 mr-2">View Full Details</Text>
                <Ionicons name="arrow-forward" size={18} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* More Shops */}
          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold font-dm text-gray-900">Similar Services</Text>
              <TouchableOpacity>
                <Text className="text-red-600 font-semibold font-dm">See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedServices.map((service, index) => (
                <ShopCard
                  key={service.id || index}
                  name={service.vendor?.name || `Provider ${index + 1}`}
                  rating={service.vendor?.rating || 4.0}
                  distance={service.vendor?.distance || 10}
                  image={service.image || require('../../assets/images/p4.png')}
                  onPress={() => console.log('Navigate to service')}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Book Service Button */}
      <View className="px-5 py-4 border-t border-gray-100 bg-white">
        <TouchableOpacity
          className="bg-red-600 py-4 rounded-full items-center shadow-lg shadow-red-200"
          onPress={handleBookService}
        >
          <Text className="text-white text-base font-bold font-dm">Book Service Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
