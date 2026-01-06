
import React, { useEffect, useState } from 'react';
import { View, Text, Animated, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingsAPI } from '../../services/api';

export default function CancelBooking({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Get booking data from navigation params
  const booking = route?.params?.booking || null;

  // We don't auto-cancel anymore, we wait for user confirmation

  const handleConfirmCancel = async () => {
    try {
      setLoading(true);

      // Get user ID from AsyncStorage
      const userData = await AsyncStorage.getItem('user_data');
      if (!userData) {
        // Fallback for demo
      }

      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);

        // Auto navigate back after success
        setTimeout(() => {
          navigation.navigate('BookingList');
        }, 2000);
      }, 1000);

      /* 
      // Real API Call
      const user = JSON.parse(userData);
      const userId = user.user_id || user.id;
      
      await bookingsAPI.updateBooking(userId, booking.id, {
        status: 'cancelled'
      });
      setSuccess(true);
      */

    } catch (err) {
      console.error('Error cancelling booking:', err);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-transparent px-6">
        {/* Background Dim */}
        <View className="absolute inset-0 bg-black/60 z-0" />
        
        <View className="bg-white w-full rounded-3xl p-6 items-center z-10 shadow-lg">
          <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark" size={50} color="#DC2626" />
          </View>
          <Text className="text-xl font-bold text-gray-900 text-center mb-2 font-dm">
            Booking Cancelled
          </Text>
          <Text className="text-sm text-gray-500 text-center font-dm mb-8">
            Your booking has been cancelled successfully.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-transparent p-5 justify-center" edges={['top']}>
      {/* Background Dim (simulated since it's a full screen) */}
      <View className="absolute inset-0 bg-black/60 z-0" />

      <View className="bg-white m-4 rounded-3xl p-6 items-center z-10 shadow-lg">
        <Text className="text-lg font-bold text-gray-900 font-dm text-center mt-2">Cancel Booking</Text>

        <Text className="text-lg font-medium text-gray-600 text-center mb-6 font-dm px-4 mt-4 leading-6">
          Are you sure you want to cancel your booking?
        </Text>

        {booking && (
          <View className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6 w-full">
            <Text className="text-base text-gray-900 font-bold text-center font-dm">
              {booking.service?.name || 'Service'}
            </Text>
            <Text className="text-sm text-gray-500 text-center font-dm mt-1">
              {booking.booking_date} • {booking.booking_time}
            </Text>
          </View>
        )}

        <TouchableOpacity
          className="bg-red-600 py-3.5 rounded-full w-full mb-3 shadow-sm"
          onPress={handleConfirmCancel}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-base font-bold text-center font-dm">Confirm</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

