import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { servicesAPI } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BillingRow = ({ label, value }) => (
  <View className="flex-row justify-between mb-2.5">
    <Text className="text-[#666]">{label}</Text>
    <Text className="font-medium">₹{value}/-</Text>
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
        style={{marginRight: 2}}
      />
    ))}
  </View>
);

const ShopCard = ({ name, rating, distance, image }) => (
  <View className="w-[200px] mr-4 bg-white rounded-2xl border border-[#E8E8E8]">
    <Image source={image} className="w-full h-[120px] rounded-t-2xl" />
    <View className="p-3">
      <Text className="text-base font-semibold font-dm mb-2">{name}</Text>
      <View className="flex-row items-center mb-2">
        <Text className="mr-1.5 font-semibold font-dm">{rating}</Text>
        <RatingStars rating={rating} />
      </View>
      <View className="flex-row items-center">
        <Ionicons name="location" size={14} color="#9CA3AF" />
        <Text className="ml-1.5 text-gray-500 text-xs font-dm">{distance} km away</Text>
      </View>
    </View>
  </View>
);

export default function EngineRepairDetail({ route, navigation }) {
  const [serviceData, setServiceData] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get service data from route params or load from API
  const serviceId = route?.params?.serviceId;
  const serviceName = route?.params?.serviceName || 'Engine Repair';
  const serviceCategory = route?.params?.category || 'Repair';

  useEffect(() => {
    loadServiceData();
  }, [serviceId]);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      
      if (serviceId) {
        // Load specific service details from API
        const response = await servicesAPI.getServiceDetail(serviceId);
        setServiceData(response.data);
      } else {
        // Use default data if no serviceId
        setServiceData({
          name: serviceName,
          category: serviceCategory,
          description: 'Complete engine repair and maintenance service. We diagnose engine problems, perform repairs, and ensure optimal engine performance.',
          features: [
            'Engine diagnostics and troubleshooting',
            'Complete engine overhaul and rebuilding',
            'Performance optimization',
          ],
          duration: '3 Days',
          price: 15000,
          vendor: {
            name: 'Dwarka Mor Service',
            rating: 4.0,
            distance: '7 km',
            location: 'B1-41, Chandan park, Dwarka mor - 110059',
            about: 'Professional car service center with 10+ years of experience. We specialize in engine repairs, maintenance, and performance upgrades.',
            facilities: [
              'State-of-the-art diagnostic equipment',
              'Certified technicians',
              'Quality spare parts',
            ],
          },
        });
      }

      // Load related services
      const servicesResponse = await servicesAPI.getAllServices();
      const services = servicesResponse.data || [];
      
      // Filter related services (same category, different vendor)
      const related = services
        .filter(s => s.category === serviceCategory && s.id !== serviceId)
        .slice(0, 5);
      
      setRelatedServices(related);
      
    } catch (error) {
      console.error('Error loading service data:', error);
      Alert.alert('Error', 'Failed to load service details. Using default data.');
      
      // Set default data on error
      setServiceData({
        name: serviceName,
        category: serviceCategory,
        description: 'Complete engine repair and maintenance service.',
        features: ['Engine diagnostics', 'Complete overhaul', 'Performance optimization'],
        duration: '3 Days',
        price: 15000,
        vendor: {
          name: 'Dwarka Mor Service',
          rating: 4.0,
          distance: '7 km',
          location: 'B1-41, Chandan park, Dwarka mor - 110059',
          about: 'Professional car service center with 10+ years of experience.',
          facilities: ['Diagnostic equipment', 'Certified technicians', 'Quality parts'],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async () => {
    try {
      // Save service data to AsyncStorage for booking flow
      await AsyncStorage.setItem('selected_service', JSON.stringify({
        serviceId: serviceId || 'engine-repair',
        serviceName: serviceData?.name || serviceName,
        servicePrice: serviceData?.price || 15000,
        serviceDuration: serviceData?.duration || '3 Days',
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
      <ScrollView>
        {/* Header */}
        <View className="flex-row items-center justify-between p-5">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View className="flex-row justify-between items-center px-5 pb-4">
          <Text className="text-[28px] font-bold font-dm flex-1 pr-4 text-gray-900">{serviceData?.name || serviceName}</Text>
          <View className="w-14 h-14 bg-red-50 rounded-2xl items-center justify-center">
            <MaterialCommunityIcons name="engine" size={32} color="#DC2626" />
          </View>
        </View>

        {/* Description */}
        <Text className="px-5 text-sm text-gray-600 leading-5 font-dm">
          {serviceData?.description || 'Professional car service with expert technicians and quality parts.'}
        </Text>
        <View className="px-5 mt-3">
          {(serviceData?.features || ['Engine diagnostics', 'Complete overhaul', 'Performance optimization']).map((feature, index) => (
            <Text key={index} className="text-gray-600 mb-2 text-sm font-dm">• {feature}</Text>
          ))}
        </View>

        {/* Estimated Time */}
        <View className="px-5 mt-4">
          <Text className="text-lg font-semibold font-dm mb-3 text-gray-900">Estimated Time:</Text>
          <View className="px-5 py-2.5 rounded-full self-start border border-[#E8E8E8] bg-gray-50">
            <Text className="text-gray-900 font-semibold font-dm">{serviceData?.duration || '3 Days'}</Text>
          </View>
        </View>

        {/* Billing Details */}
        <View className="px-5 mt-5">
          <Text className="text-lg font-semibold font-dm mb-3 text-gray-900">Billing Details:</Text>
          <View className="bg-gray-50 border border-[#E8E8E8] p-4 rounded-2xl">
            <BillingRow label="Base Service Cost:" value={(serviceData?.price || 15000).toString()} />
            <BillingRow label="Labor Cost:" value="2000" />
            <BillingRow label="Additional Cost:" value="500" />
            <View className="border-t border-gray-300 mt-2 pt-3">
              <View className="flex-row justify-between">
                <Text className="text-base font-semibold font-dm text-gray-900">Total Cost:</Text>
                <Text className="text-xl font-bold font-dm text-red-600">₹{((serviceData?.price || 15000) + 2500)}/-</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Provider Information */}
        <View className="px-5 mt-5">
          <Text className="text-lg font-semibold font-dm mb-3 text-gray-900">Provider Information:</Text>
          <Image
            source={require('../../assets/images/p1.png')} 
            className="w-full h-[150px] rounded-2xl mb-3"
          />
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold font-dm text-gray-900">{serviceData?.vendor?.name || 'Service Provider'}</Text>
            <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full">
              <Ionicons name="location" size={14} color="#374151" />
              <Text className="ml-1.5 font-semibold font-dm text-gray-700">{serviceData?.vendor?.distance || '7 km'}</Text>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <Text className="mr-2.5 font-dm text-gray-700">Ratings:</Text>
            <Text className="mr-1.5 font-semibold font-dm text-gray-900">{serviceData?.vendor?.rating || 4.0}</Text>
            <RatingStars rating={Math.round(serviceData?.vendor?.rating || 4)} />
          </View>

          <View className="mb-3">
            <Text className="font-semibold font-dm text-gray-900 mb-2">Location:</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600 flex-1 font-dm mr-3">
                {serviceData?.vendor?.location || 'B1-41, Chandan park, Dwarka mor - 110059'}
              </Text>
              <TouchableOpacity className="flex-row items-center bg-teal-500 px-4 py-2 rounded-full">
                <Ionicons name="location" size={16} color="#fff" />
                <Text className="text-white ml-1.5 font-semibold font-dm">See location</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-base font-semibold my-3 font-dm text-gray-900">About:</Text>
          <Text className="text-gray-600 leading-5 font-dm">
            {serviceData?.vendor?.about || 'Professional car service center with experienced technicians and quality service.'}
          </Text>
          <View className="mt-2">
            {(serviceData?.vendor?.facilities || ['Diagnostic equipment', 'Certified technicians', 'Quality parts']).map((facility, index) => (
              <Text key={index} className="text-gray-600 mb-2 text-sm font-dm">• {facility}</Text>
            ))}
          </View>

          <TouchableOpacity className="flex-row items-center justify-center py-3 px-6 mt-4 border border-[#E8E8E8] rounded-full self-center" onPress={() => navigation.navigate('ProviderDetails')}>
            <Text className="mr-2 font-semibold font-dm text-gray-900">View more details</Text>
            <Ionicons name="arrow-forward" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* More Shops Section */}
        <View className="px-5 mt-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold font-dm text-gray-900">More shops offering this service</Text>
            <TouchableOpacity>
              <Text className="text-red-600 font-semibold font-dm">See all</Text>
            </TouchableOpacity>
          </View>
          
          {relatedServices.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedServices.map((service, index) => (
                <ShopCard
                  key={service.id || index}
                  name={service.vendor?.name || `Provider ${index + 1}`}
                  rating={service.vendor?.rating || 4.0}
                  distance={service.vendor?.distance || 10}
                  image={require('../../assets/images/p4.png')}
                />
              ))}
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <ShopCard
                name="Decaabo cars"
                rating={3.0}
                distance={10}
                image={require('../../assets/images/p4.png')}
              />
              <ShopCard
                name="Fix My Cars"
                rating={3.0}
                distance={18}
                image={require('../../assets/images/p5.png')}
              />
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Book Service Button */}
      <TouchableOpacity 
        className="bg-red-600 mx-5 mb-5 mt-3 py-4 rounded-full items-center" 
        onPress={handleBookService}
      >
        <Text className="text-white text-base font-bold font-dm">Book Service</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
