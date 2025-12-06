import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function OtpVerified({ navigation }) {
  const [scale] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      navigation.navigate('WelcomeScreen'); 
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <Animated.View className="justify-center items-center bg-[#E7F9F2] rounded-[100px] w-[120px] h-[120px]" style={{ transform: [{ scale }] }}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
      </Animated.View>
      <Text className="mt-5 text-lg text-center text-[#333] font-['DM']">Your phone number has been verified successfully!</Text>
    </SafeAreaView>
  );
}
