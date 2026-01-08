import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient'; 
import { googleAuthService } from '../../services/googleAuth';
import { Alert } from 'react-native';

// Constants for Icons
const APPLE_ICON_URL = "https://img.icons8.com/ios-filled/50/000000/mac-os.png";
const GOOGLE_ICON_URL = "https://img.icons8.com/color/48/000000/google-logo.png";
const FACEBOOK_ICON_URL = "https://img.icons8.com/ios-filled/50/000000/facebook-new.png";

export default function LoginScreen({ navigation }) {

  const handleSkip = useCallback(() => {
    navigation.navigate("Homepage");
  }, [navigation]);

  const handleGoogleLogin = async () => {
    try {
      const user = await googleAuthService.signIn();
      if (user) {
        // If it's a new user, you might want to send them to onboarding logic
        // For now, straight to Homepage like email login
        navigation.navigate("Homepage"); 
      }
    } catch (error) {
      if (error.message.includes('Play Services')) {
         Alert.alert('Error', 'Google Play Services are required for this action.');
      } else {
         Alert.alert('Login Failed', 'Could not sign in with Google. Please try again.');
      }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      {/* Upper Gradient Section */}
      <LinearGradient
        colors={['#C4C4C4', '#1A1A1A']} // Gradient from gray to dark
        className="h-[60%] w-full rounded-b-2xl justify-center items-center px-10"
      >
        <SafeAreaView className="absolute top-0 w-full " edges={['top']}>
          <TouchableOpacity 
            className="self-end p-5" 
            onPress={handleSkip}
          >
            <Text className="text-black  text-base font-bold">Skip</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <Text className="text-white text-3xl font-bold text-center leading-10 mt-10">
          Let's get your car back on the road
        </Text>
      </LinearGradient>

      {/* Bottom Action Section */}
      <View className="flex-1 px-8 pt-10 items-center">
        
        {/* Main Action Button */}
        <TouchableOpacity
          className="bg-[#D82424] w-full h-16 rounded-[15px] justify-center items-center mb-6"
          onPress={() => navigation.navigate("SignIn")}
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-bold">Continue with email</Text>
        </TouchableOpacity>

        {/* OR Separator */}
        <View className="flex-row items-center mb-8">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-4 text-black font-bold text-sm">OR</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        {/* Social Login Buttons */}
        <View className="flex-row justify-between w-full mb-10">
          <TouchableOpacity className="w-[30%] h-14 border border-gray-400 rounded-[30px] justify-center items-center">
            <Image source={{ uri: APPLE_ICON_URL }} className="w-7 h-7" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-[30%] h-14 border border-gray-400 rounded-[30px] justify-center items-center"
            onPress={handleGoogleLogin}
          >
            <Image source={{ uri: GOOGLE_ICON_URL }} className="w-7 h-7" />
          </TouchableOpacity>
          
          <TouchableOpacity className="w-[30%] h-14 border border-gray-400 rounded-[30px] justify-center items-center">
            <Image source={{ uri: FACEBOOK_ICON_URL }} className="w-7 h-7" style={{ tintColor: '#1877F2' }} />
          </TouchableOpacity>
        </View>

        {/* Legal Disclaimer */}
        <Text className="text-[13px] text-gray-600 text-center leading-5 px-2">
          By signing or logging in it, you agree to the{" "}
          <Text className="text-[#D82424] font-medium">Terms and Conditions</Text> 
          {" "}of service and{" "}
          <Text className="text-[#D82424] font-medium">Privacy Policy</Text>
        </Text>
      </View>

      {/* Home Indicator Spacer */}
      <View className="h-8 w-full bg-white" />
    </View>
  );
}