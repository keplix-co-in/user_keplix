import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

export default function Filters({ navigation, route }) {
  const { onApplyFilters } = route.params || {};
  const [selectedDate, setSelectedDate] = useState('11-10-2024');
  const [selectedService, setSelectedService] = useState('Engine Maintenance');
  const [selectedPaymentType, setSelectedPaymentType] = useState('Cash on delivery');
  const [selectedLocation, setSelectedLocation] = useState('SR');
  const [priceRange, setPriceRange] = useState([5, 100]);

  const services = ['Engine Maintenance', 'Repair', 'Inspection', 'Other'];
  const paymentTypes = ['Cash on delivery', 'Card', 'UPI', 'Net Banking'];
  const locations = ['SR', 'Delhi', 'Noida', 'Gurgaon'];

  const handleApplyFilters = () => {
    // Prepare filter object
    const filters = {
      date: selectedDate,
      service: selectedService,
      paymentType: selectedPaymentType,
      location: selectedLocation,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    };
    
    // Call callback function if provided
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    
    // Navigate back with filter params
    navigation.navigate('SearchResult', { filters });
  };

  const handleClearAll = () => {
    setSelectedDate('');
    setSelectedService('');
    setSelectedPaymentType('');
    setSelectedLocation('');
    setPriceRange([5, 100]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-5 pb-4 bg-white border-b border-[#E8E8E8]">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 font-dm">Filters</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text className="text-sm text-red-600 font-dm font-semibold">Clear all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-5" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Date Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-900 mb-3 font-dm">Date</Text>
          <View className="flex-row items-center border border-[#E8E8E8] rounded-xl px-4 py-3.5 bg-white">
            <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
            <Text className="flex-1 ml-3 text-base text-gray-900 font-dm">{selectedDate}</Text>
            <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
          </View>
        </View>

        {/* Service Name Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-900 mb-3 font-dm">Service Name</Text>
          <View className="flex-row flex-wrap gap-2">
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                className={`px-5 py-3 rounded-full border ${
                  selectedService === service 
                    ? 'bg-red-600 border-red-600' 
                    : 'bg-white border-[#E8E8E8]'
                }`}
                onPress={() => setSelectedService(service)}
              >
                <Text
                  className={`text-sm font-semibold font-dm ${
                    selectedService === service ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {service}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Type Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-900 mb-3 font-dm">Payment Type</Text>
          <View className="flex-row flex-wrap gap-2">
            {paymentTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                className={`px-5 py-3 rounded-full border ${
                  selectedPaymentType === type 
                    ? 'bg-red-600 border-red-600' 
                    : 'bg-white border-[#E8E8E8]'
                }`}
                onPress={() => setSelectedPaymentType(type)}
              >
                <Text
                  className={`text-sm font-semibold font-dm ${
                    selectedPaymentType === type ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Range Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-900 mb-3 font-dm">Urban</Text>
          <View className="flex-row justify-between mb-3">
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-600 font-dm mr-2">From</Text>
              <View className="border border-[#E8E8E8] rounded-lg px-4 py-2 bg-white">
                <Text className="text-sm font-semibold font-dm text-gray-900">SR</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Text className="text-sm text-gray-600 font-dm mr-2">To</Text>
              <View className="border border-[#E8E8E8] rounded-lg px-4 py-2 bg-white">
                <Text className="text-sm font-semibold font-dm text-gray-900">100</Text>
              </View>
            </View>
          </View>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={5}
            maximumValue={100}
            step={5}
            value={priceRange[1]}
            onValueChange={(value) => setPriceRange([priceRange[0], value])}
            minimumTrackTintColor="#DC2626"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#DC2626"
          />
        </View>

        {/* Location Section */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-900 mb-3 font-dm">Location</Text>
          <View className="flex-row flex-wrap gap-2">
            {locations.map((location, index) => (
              <TouchableOpacity
                key={index}
                className={`px-5 py-3 rounded-full border ${
                  selectedLocation === location 
                    ? 'bg-red-600 border-red-600' 
                    : 'bg-white border-[#E8E8E8]'
                }`}
                onPress={() => setSelectedLocation(location)}
              >
                <Text
                  className={`text-sm font-semibold font-dm ${
                    selectedLocation === location ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {location}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E8] px-5 py-5">
        <TouchableOpacity 
          className="bg-red-600 py-4 rounded-full items-center"
          onPress={handleApplyFilters}
        >
          <Text className="text-white text-base font-bold font-dm">Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
