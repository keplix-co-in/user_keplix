import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user_data');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        // Get first name from email or use "User"
        const name = userData.email ? userData.email.split('@')[0] : 'User';
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const onboardingData = [
    {
      title: "Welcome to",
      subtitle: "Keplix!",
      description: "Your one-stop solution for all car service needs",
    },
    {
      title: "Book Services",
      subtitle: "Easily",
      description: "Browse and book car services at your convenience",
    },
    {
      title: "Track & Manage",
      subtitle: "Everything",
      description: "Real-time tracking and complete booking management",
    },
  ];

  const handleNext = () => {
    if (currentIndex < 2) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = async () => {
    try {
      // Mark onboarding as complete
      await AsyncStorage.setItem('onboarding_complete', 'true');
      navigation.navigate("WelcomeScreen2");
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      navigation.navigate("WelcomeScreen2");
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('onboarding_complete', 'true');
      navigation.navigate("WelcomeScreen2");
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      navigation.navigate("WelcomeScreen2");
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-black">
      {/* Back Button */}
      <View className="flex-row items-center mb-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} size={30} color="white" className="border-2 border-[#E2E2E2] rounded-full p-[5px]" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="justify-center items-center flex-1">
        {/* Placeholder for onboarding image/illustration */}
        <View className="w-[80%] h-[50%] bg-[#1a1a1a] justify-center items-center rounded-lg mb-5 border-2 border-[#333]">
          <Ionicons 
            name={currentIndex === 0 ? "car-sport" : currentIndex === 1 ? "calendar" : "checkmark-done-circle"} 
            size={120} 
            color="#DC2626" 
          />
        </View>

        {/* Pagination Dots */}
        <View className="flex-row mt-5 items-center">
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              className={`rounded-[5px] mx-[5px] ${currentIndex === index ? 'w-[10px] h-[10px] bg-red-500' : 'w-2 h-2 bg-[#E2E2E2]'}`}
            />
          ))}
        </View>
      </View>

      <View className="self-start ml-2.5 mb-5">
        <Text className="text-white font-['DM'] font-medium text-[36px]">
          {onboardingData[currentIndex].title}
        </Text>
        <Text className="text-white font-['DM'] font-medium text-[36px]">
          {onboardingData[currentIndex].subtitle}
        </Text>
        <Text className="text-gray-400 font-['DM'] text-base mt-2">
          {onboardingData[currentIndex].description}
        </Text>
      </View>

      <View className="h-[120px] flex-col mt-2.5 justify-center gap-[15px]">
        {currentIndex < 2 ? (
          <>
            {/* Next and Skip Buttons */}
            <TouchableOpacity 
              className="flex-1 bg-white border border-[#E2E2E2] rounded-[25px] py-3 items-center" 
              onPress={handleNext}
            >
              <Text className="text-black font-medium font-['DM'] text-xl">Next</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-red-500 rounded-[25px] py-3 items-center" 
              onPress={handleSkip}
            >
              <Text className="text-white font-medium font-['DM'] text-xl">Skip</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            className="bg-red-500 rounded-[25px] py-3 items-center" 
            onPress={handleFinish}
          >
            <Text className="text-white font-medium font-['DM'] text-xl h-[30px]">Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}


