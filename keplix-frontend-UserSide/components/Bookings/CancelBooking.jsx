
import React, { useEffect, useState } from 'react';
import { View, Text, Animated, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingsAPI } from '../../services/api';

export default function CancelBooking({ navigation, route }) {
  const [scale] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Get booking data from navigation params
  const booking = route?.params?.booking || null;

  useEffect(() => {
    if (booking) {
      cancelBooking();
    } else {
      setError('No booking data available');
      setLoading(false);
    }
  }, []);

  const cancelBooking = async () => {
    try {
      setLoading(true);
      
      // Get user ID from AsyncStorage
      const userData = await AsyncStorage.getItem('user_data');
      if (!userData) {
        throw new Error('User data not found. Please login again.');
      }
      
      const user = JSON.parse(userData);
      const userId = user.user_id || user.id;
      
      // Update booking status to cancelled
      await bookingsAPI.updateBooking(userId, booking.id, {
        status: 'cancelled'
      });
      
      setSuccess(true);
      
      // Animate success icon
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }).start();

      // Navigate back after 2 seconds
      const timeout = setTimeout(() => {
        navigation.navigate('BookingList');
      }, 2000);

      return () => clearTimeout(timeout);
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setError(err.response?.data?.message || err.message || 'Failed to cancel booking');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#EF4444" />
        <Text className="mt-5 text-lg text-center text-[#333] font-dm">Cancelling your booking...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
        <View className="w-32 h-32 bg-red-50 rounded-full items-center justify-center mb-6">
          <Ionicons name="close-circle" size={80} color="#DC2626" />
        </View>
        <Text className="text-xl font-bold text-gray-900 text-center mb-3 font-dm">
          Cancellation Failed
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-8 font-dm">{error}</Text>
        <TouchableOpacity 
          className="bg-red-600 py-4 px-8 rounded-full mb-3 w-48"
          onPress={cancelBooking}
        >
          <Text className="text-white text-base font-bold text-center font-dm">Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-gray-200 py-4 px-8 rounded-full w-48"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-gray-900 text-base font-bold text-center font-dm">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (success) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
        <Animated.View 
          className="w-32 h-32 bg-green-50 rounded-full items-center justify-center mb-6" 
          style={{ transform: [{ scale }] }}
        >
          <Ionicons name="checkmark-circle" size={80} color="#10B981" />
        </Animated.View>
        <Text className="text-xl font-bold text-gray-900 text-center mb-3 font-dm">
          Your booking has been{'\n'}cancelled successfully
        </Text>
        <Text className="text-sm text-gray-500 text-center font-dm">
          Redirecting to bookings list...
        </Text>
      </SafeAreaView>
    );
  }

  return null;
}
