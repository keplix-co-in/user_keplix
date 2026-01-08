
import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

export default function RescheduledBooking({ navigation, route }) {
  const [scale] = useState(new Animated.Value(0));

  // Get booking data 
  const booking = route?.params?.booking || null;

  useEffect(() => {
    // Pulse animation
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 50,
      useNativeDriver: true,
    }).start();

    // Auto navigate after 3 seconds
    const timeout = setTimeout(() => {
      navigation.navigate('BookingList');
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
      <View className="mb-8 items-center">
        <Animated.View
          className="w-32 h-32 bg-gray-100 rounded-3xl items-center justify-center mb-6 shadow-sm"
          style={{ transform: [{ scale }] }}
        >
          <View className="bg-red-600 rounded-full p-2">
            <Ionicons name="checkmark" size={40} color="white" />
          </View>
        </Animated.View>
        <Text className="text-xl font-medium text-gray-500 text-center font-dm">
          Your booking has been
        </Text>
        <Text className="text-2xl font-bold text-gray-900 text-center mt-1 font-dm">
          Rescheduled
        </Text>
        <Text className="text-2xl font-bold text-gray-900 text-center font-dm">
          successfully.
        </Text>
      </View>

      {/* Optional: Show details if needed to verify visually */}
      {/* 
      <Text className="text-sm text-gray-400 text-center font-dm mt-8">
        Redirecting you back to your bookings...
      </Text>
      */}
    </SafeAreaView>
  );
}

