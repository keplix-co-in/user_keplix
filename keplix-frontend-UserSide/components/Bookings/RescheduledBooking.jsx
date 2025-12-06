
import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function RescheduledBooking({ navigation, route }) {
  const [scale] = useState(new Animated.Value(0));
  
  // Get booking data from navigation params
  const booking = route?.params?.booking || null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      navigation.navigate('BookingList'); 
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
      <Animated.View 
        className="w-32 h-32 bg-green-50 rounded-full items-center justify-center mb-6" 
        style={{ transform: [{ scale }] }}
      >
        <Ionicons name="checkmark-circle" size={80} color="#10B981" />
      </Animated.View>
      <Text className="text-xl font-bold text-gray-900 text-center mb-3 font-dm">
        Your booking has been{'\n'}Rescheduled successfully
      </Text>
      {booking && (
        <View className="bg-gray-50 border border-[#E8E8E8] p-5 rounded-2xl w-full mb-4">
          <Text className="text-sm text-gray-600 font-dm text-center mb-2">New booking time:</Text>
          <Text className="text-base text-gray-900 font-dm font-bold text-center">
            {formatDate(booking.booking_date)}
          </Text>
          <Text className="text-base text-gray-900 font-dm font-bold text-center">
            at {formatTime(booking.booking_time)}
          </Text>
        </View>
      )}
      <Text className="text-sm text-gray-500 text-center font-dm">
        Redirecting to bookings list...
      </Text>
    </SafeAreaView>
  );
}
