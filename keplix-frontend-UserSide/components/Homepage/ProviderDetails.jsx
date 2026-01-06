import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { servicesAPI } from '../../services/api';

const ServiceCard = ({ icon, title, price }) => (
  <View className="border-2 border-[#E2E2E2] rounded-2xl p-4 items-center mr-3 w-[180px] h-[120px]">
    <View className="flex-row items-center mb-2">
      <MaterialCommunityIcons name={icon} size={30} color="#000" />
      <Text className="text-xl font-dm font-medium my-2 mx-1">{title}</Text>
    </View>
    <Text className="bg-[#45B7B7] text-white px-6 py-1.5 rounded-lg text-base font-semibold font-dm">₹{price}</Text>
  </View>
);

const RatingStars = ({ rating, count }) => {
  return (
    <View className="flex-row items-center mb-5">
      <Text className="mr-2 text-base font-semibold font-dm text-gray-700">Ratings: </Text>
      <Text className="mr-1 text-base font-bold font-dm text-gray-900">{rating}</Text>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.floor(rating) ? 'star' : 'star-outline'}
          size={16}
          color="#FFA500"
        />
      ))}
      <Text className="ml-2 text-sm text-gray-500 font-dm">({count})</Text>
    </View>
  );
};

export default function ProviderDetails({ navigation, route }) {
  const [service, setService] = useState(route?.params?.service || null);
  const [loading, setLoading] = useState(!route?.params?.service);
  const [relatedServices, setRelatedServices] = useState([]);

  useEffect(() => {
    if (!route?.params?.service && route?.params?.serviceId) {
      fetchServiceDetails();
    }
    if (service) {
      fetchRelatedServices();
    }
  }, [service]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getServiceDetail(route.params.serviceId);
      setService(response.data);
    } catch (error) {
      console.error('Error fetching service details:', error);
      Alert.alert('Error', 'Failed to load service details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedServices = async () => {
    try {
      const response = await servicesAPI.getAllServices();
      // Filter related services (same vendor, different service)
      const related = response.data.filter(
        s => s.vendor === service.vendor && s.id !== service.id
      ).slice(0, 5);
      setRelatedServices(related);
    } catch (error) {
      console.error('Error fetching related services:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center" edges={['top']}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-gray-500 mt-2 font-dm">Loading service details...</Text>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center" edges={['top']}>
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="alert-circle-outline" size={40} color="#9CA3AF" />
        </View>
        <Text className="text-gray-900 text-lg font-semibold font-dm">Service not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-6 bg-red-600 px-6 py-3 rounded-full">
          <Text className="text-white font-dm font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between p-5">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg"
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg">
            <Ionicons name="bookmark-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Image
          source={service.image ? { uri: service.image } : require('../../assets/images/p1.png')}
          className="w-full h-[300px]"
          resizeMode="cover"
        />

        <View className="p-5">
          <Text className="text-2xl font-bold font-dm mb-3 text-gray-900">{service.vendor_name || 'Service Provider'}</Text>

          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-lg text-gray-600 font-dm flex-1">{service.name}</Text>
            <View className="px-4 py-2 bg-red-50 rounded-full">
              <Text className="text-xl font-bold font-dm text-red-600">₹{service.price?.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          <RatingStars rating={service.rating || 4.0} count={service.reviewCount || 60} />

          {service.description && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 font-dm mb-3">About:</Text>
              <Text className="text-base text-gray-600 leading-6 font-dm">
                {service.description}
              </Text>
            </View>
          )}

          {service.vendor_address && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 font-dm mb-3">Location:</Text>
              <View className="p-4 bg-gray-50 border border-[#E8E8E8] rounded-2xl flex-row justify-between items-center">
                <Text className="text-sm font-dm text-gray-700 flex-1 mr-3">{service.vendor_address}</Text>
                <TouchableOpacity className="bg-teal-500 flex-row items-center px-4 py-2.5 rounded-full">
                  <Ionicons name="location" size={16} color="white" />
                  <Text className="text-white text-sm font-dm font-semibold ml-1.5">See location</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 font-dm mb-3">Availability:</Text>
            <View className={`px-4 py-3 rounded-full self-start ${service.is_available ? 'bg-green-50' : 'bg-red-50'}`}>
              <Text className={`text-sm font-semibold font-dm ${service.is_available ? 'text-green-600' : 'text-red-600'}`}>
                {service.is_available ? '✓ Available for booking' : '✕ Currently unavailable'}
              </Text>
            </View>
          </View>

          {service.vendor_phone && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 font-dm mb-3">Contact Us:</Text>
              <TouchableOpacity className="bg-teal-500 flex-row items-center justify-center py-3.5 rounded-full">
                <Ionicons name="call" size={20} color="white" />
                <Text className="text-white text-base font-dm font-bold ml-2">{service.vendor_phone}</Text>
              </TouchableOpacity>
            </View>
          )}

          {relatedServices.length > 0 && (
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-gray-900 font-dm">Other Services:</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ProviderList", { vendorId: service.vendor })}>
                  <Text className="text-red-600 font-dm font-semibold text-sm">See all</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedServices.map((relatedService) => (
                  <TouchableOpacity
                    key={relatedService.id}
                    onPress={() => {
                      setService(relatedService);
                      setLoading(false);
                    }}
                  >
                    <View className="border border-[#E8E8E8] bg-white rounded-2xl p-4 items-center mr-3 w-[160px]">
                      <Text className="text-sm font-dm font-semibold mb-3 text-center text-gray-900" numberOfLines={2}>
                        {relatedService.name}
                      </Text>
                      <View className="bg-red-600 px-5 py-2 rounded-full">
                        <Text className="text-white text-base font-bold font-dm">
                          ₹{relatedService.price}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {service.is_available && (
        <TouchableOpacity
          className="bg-red-600 mx-5 mb-5 py-4 rounded-full items-center"
          onPress={() => navigation.navigate("BookSlot", { service })}
        >
          <Text className="text-white text-base font-bold font-dm">Check Schedule</Text>
        </TouchableOpacity>
      )}
      {!service.is_available && (
        <View className="bg-gray-300 mx-5 mb-5 py-4 rounded-full items-center">
          <Text className="text-gray-600 text-base font-bold font-dm">Currently Unavailable</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

