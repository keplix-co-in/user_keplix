import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingsAPI } from '../../services/api';

export default function BookingConfirmation ({ navigation, route }){
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [bookingData, setBookingData] = useState(null);

  const bookingDetails = route?.params?.booking || {};

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      // If we have booking ID from params, fetch booking details
      if (bookingDetails.id) {
        const response = await bookingsAPI.getBookingDetails(bookingDetails.id);
        if (response.data) {
          setBookingData(response.data);
        }
      } else {
        // Use data passed from previous screen
        setBookingData(bookingDetails);
      }
    } catch (error) {
      console.error('Error loading booking:', error);
      setBookingData(bookingDetails); // Fallback to params
    }
  };

  const handleAddToCalendar = () => {
    // Calendar functionality - would integrate with device calendar
    Alert.alert('Add to Calendar', 'This feature will add the booking to your device calendar');
  };

  const displayData = bookingData || bookingDetails;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 mb-5">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold font-dm text-gray-900">Booking Details</Text>
        <View className="w-10" />
      </View>

      {/* Notifications Toggle */}
      <View className="bg-white flex-row justify-between items-center p-4 mx-5 border border-[#E8E8E8] rounded-2xl mb-5">
        <View className="flex-row items-center flex-1">
          <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-3">
            <Ionicons name="notifications" size={24} color="#DC2626" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold font-dm text-gray-900">Enable Notifications</Text>
            <Text className="text-sm text-gray-500 font-dm">(For appointment updates)</Text>
          </View>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: '#D1D1D6', true: '#DC2626' }}
          thumbColor={'#FFFFFF'}
        />
      </View>

      <View className="bg-white mx-5 border border-[#E8E8E8] rounded-2xl p-5">
        <View className="flex-row items-center mb-5">
          <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-3">
            <MaterialCommunityIcons name="engine" size={24} color="#DC2626" />
          </View>
          <Text className="text-xl font-bold font-dm text-gray-900">
            {displayData.service_name || 'Engine Repair'}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-500 font-dm mb-2">Reference Number</Text>
          <View className="px-4 py-2.5 border border-[#E8E8E8] bg-gray-50 rounded-full self-start">
            <Text className="text-base font-semibold font-dm text-gray-900">
              #{displayData.reference_number || displayData.id || '1517'}
            </Text>
          </View>
        </View>

        <Text className="text-sm text-gray-500 font-dm mb-2">Provider</Text>
        <Text className="text-lg font-bold font-dm text-gray-900 mb-4">
          {displayData.vendor_name || 'Dwarka mor service'}
        </Text>
        
        <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <View className="flex-1">
            <Text className="text-base font-semibold font-dm text-gray-900 mb-2">
              {displayData.scheduled_date || '26 June 2024'} • {displayData.scheduled_time || '4:30PM'}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#9CA3AF" />
              <Text className="text-sm text-gray-600 font-dm ml-1">
                {displayData.distance || '7'} km away
              </Text>
            </View>
          </View>
          <View className="px-4 py-2 bg-red-50 rounded-full">
            <Text className="text-lg font-bold font-dm text-red-600">
              ₹{displayData.total_cost || displayData.price || '10,499'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-teal-500 flex-row items-center justify-center py-4 rounded-full"
          onPress={handleAddToCalendar}
        >
          <Ionicons name="calendar" size={20} color="white" />
          <Text className="text-white text-base font-bold font-dm ml-2">Add to calendar</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Button */}
      <TouchableOpacity 
        className="bg-red-600 mx-5 py-4 rounded-full absolute bottom-8 left-0 right-0 items-center" 
        onPress={() => navigation.navigate('Homepage')}
      >
        <Text className="text-white text-base font-bold font-dm">Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

