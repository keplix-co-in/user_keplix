import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingsAPI } from '../../services/api';

export default function ReviewPage({ route, navigation }) {
  const [note, setNote] = useState('');
  const [creating, setCreating] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Get params with fallback - if no date/time, user should go through BookSlot first
  const params = route.params || {};
  const date = params.date;
  const time = params.time;
  const serviceData = params.service || {};
  const vendorData = params.vendor || {};

  useEffect(() => {
    loadUserData();
    // If date/time is missing, redirect to BookSlot
    if (!date || !time) {
      Alert.alert(
        'Missing Information',
        'Please select a date and time slot first.',
        [
          {
            text: 'OK',
            onPress: () => {
              if (serviceData.id) {
                navigation.navigate('BookSlot', { serviceData });
              } else {
                navigation.goBack();
              }
            }
          }
        ]
      );
    }
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user_data');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleProceed = async () => {
    if (!userData?.id) {
      Alert.alert('Error', 'Please login to create a booking');
      navigation.navigate('SignIn');
      return;
    }

    if (!date || !time) {
      Alert.alert('Error', 'Please select date and time first');
      return;
    }

    setCreating(true);
    try {
      const bookingData = {
        user: userData.id,
        vendor: vendorData.id || 1, // Default vendor if not provided
        service: serviceData.id || 1, // Default service if not provided
        scheduled_date: date,
        scheduled_time: time,
        notes: note.trim(),
        status: 'pending',
        total_cost: serviceData.price || 10499,
      };

      const response = await bookingsAPI.createBooking(userData.id, bookingData);
      
      if (response.data) {
        // Navigate to payment with booking details
        navigation.navigate("Payment1", {
          amount: response.data.total_cost || 10499,
          bookingId: response.data.id,
          service: serviceData,
          booking: response.data,
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert(
        'Booking Failed',
        error.response?.data?.message || 'Failed to create booking. Please try again.'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-5" edges={['top']}>
      <View className="flex-row items-center mb-5">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-semibold mb-5 font-['DM']">Booking Summary</Text>

      <View className="bg-gray-50 border border-[#E8E8E8] rounded-2xl p-4">
        <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
          <Text className="text-sm text-[#666] font-['DM']">Service</Text>
          <Text className="text-base font-semibold font-['DM'] text-right flex-1 ml-4">
            {serviceData.name || 'Engine Repair'}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
          <Text className="text-sm text-[#666] font-['DM']">Provider</Text>
          <Text className="text-base font-semibold font-['DM'] text-right flex-1 ml-4">
            {vendorData.business_name || 'Dwarka Mor Service'}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
          <Text className="text-sm text-[#666] font-['DM']">Distance</Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="location" size={16} color="#666" />
            <Text className="text-base font-semibold font-['DM']">
              {vendorData.distance || '7'} km
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
          <Text className="text-sm text-[#666] font-['DM']">Date</Text>
          <Text className="text-base font-semibold font-['DM']">{date}</Text>
        </View>

        <View className="flex-row justify-between items-center py-3 border-b border-gray-200">
          <Text className="text-sm text-[#666] font-['DM']">Time</Text>
          <Text className="text-base font-semibold font-['DM']">{time}</Text>
        </View>

        <View className="flex-row justify-between items-center py-3">
          <Text className="text-sm text-[#666] font-['DM']">Total Amount</Text>
          <Text className="text-xl font-bold text-red-600 font-['DM']">
            ₹{serviceData.price || '10,499'}
          </Text>
        </View>
      </View>

      <View className="mt-6">
        <Text className="text-base font-semibold mb-2 font-['DM']">Special Instructions</Text>
        <Text className="text-xs text-[#999] mb-2 font-['DM']">(Optional)</Text>
        <TextInput
          className="bg-white border border-[#E8E8E8] rounded-2xl p-4 h-[100px] font-['DM'] text-gray-900"
          placeholder="Add any special requests or notes..."
          placeholderTextColor="#999"
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View className="flex-1" />

      <TouchableOpacity 
        className="bg-red-600 py-4 rounded-full items-center mb-5" 
        onPress={handleProceed}
        disabled={creating}
      >
        {creating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold font-['DM']">Proceed to Payment</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
