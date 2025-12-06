import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authAPI } from '../../services/api';

// Constants
const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const INDIA_FLAG_URL = "https://flagcdn.com/w40/in.png";
const APPLE_ICON_URL = "https://img.icons8.com/ios-filled/50/000000/mac-os.png";
const GOOGLE_ICON_URL = "https://img.icons8.com/color/48/000000/google-logo.png";
const FACEBOOK_ICON_URL = "https://img.icons8.com/ios-filled/50/000000/facebook-new.png";

export default function LoginScreen({ navigation }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Memoized validation for better performance
  const { isValidPhone, isValidEmail, isFilled } = useMemo(() => {
    const phone = PHONE_REGEX.test(input);
    const email = EMAIL_REGEX.test(input);
    return {
      isValidPhone: phone,
      isValidEmail: email,
      isFilled: phone || email
    };
  }, [input]);

  // Memoized callbacks to prevent re-renders
  const handleInputChange = useCallback((text) => {
    setInput(text.trim());
  }, []);

  const handleSkip = useCallback(() => {
    navigation.navigate("Homepage");
  }, [navigation]);

  const handleContinue = useCallback(async () => {
    if (!isFilled || loading) return;

    setLoading(true);

    try {
      if (isValidPhone) {
        // Send OTP to phone
        const fullPhoneNumber = `+91${input}`;
        await authAPI.sendPhoneOTP(fullPhoneNumber);
        
        Alert.alert(
          'Success',
          'OTP has been sent to your phone number.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate("SendOtp", { phoneNumber: fullPhoneNumber }),
            },
          ]
        );
      } else if (isValidEmail) {
        // Navigate to SignIn for email/password login
        navigation.navigate("SignIn", { email: input });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.error 
        || (error.message === 'Network Error' 
          ? 'Please check your internet connection and ensure the backend server is running.' 
          : 'An error occurred. Please try again.');
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isFilled, loading, isValidPhone, isValidEmail, input, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center font-['DM']" edges={['top']}>
      <TouchableOpacity 
        className="absolute top-5 right-5 p-2.5" 
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text className="text-lg text-black font-medium">
          skip
        </Text>
      </TouchableOpacity>

      <View className="w-[260px] h-[200px] bg-[#ededed] rounded-[20px] mt-[150px] mb-0 items-center justify-center" />

      <View className="w-[90%] mt-2.5 mb-10 self-center pl-5 font-['DM']">
        <Text className="text-xl justify-center items-center font-medium font-['DM'] text-black">
          Let's get your car <Text className="text-black font-['DM']">back </Text>
          <Text style={{ fontSize: 20, color: "red" }}>
            on the road
          </Text>
        </Text>
      </View>

      <View className="w-[360px] h-[60px] border border-black rounded-[15px] flex-row items-center px-4 mt-5 mb-5 bg-white">
        <Image
          source={{ uri: INDIA_FLAG_URL }}
          className="w-6 h-4 rounded-[2px] mr-1.5"
        />

        <TextInput
          className="flex-1 text-black text-base font-['DM']"
          placeholder="Enter 10-digit phone or Gmail"
          placeholderTextColor="#888"
          keyboardType="default"
          value={input}
          onChangeText={handleInputChange}
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      <TouchableOpacity
        className={`w-[370px] h-[60px] rounded-[40px] justify-center items-center mb-5 ${isFilled && !loading ? 'bg-[#D82424]' : 'bg-gray-500'}`}
        onPress={handleContinue}
        disabled={!isFilled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-semibold font-['DM']">Continue</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row items-center my-2.5 w-[90%]">
        <View className="flex-1 h-[1px] bg-[#ddd]" />
        <Text className="mx-2.5 text-[#0000008F] font-semibold font-['DM']">OR</Text>
        <View className="flex-1 h-[1px] bg-[#ddd]" />
      </View>

      <View className="flex-row justify-around w-[90%] my-5">
        <TouchableOpacity 
          className="w-[100px] h-[50px] bg-white border-2 border-[#E2E2E2] rounded-[30px] justify-center items-center"
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: APPLE_ICON_URL }}
            className="w-[30px] h-[30px]"
            style={{ tintColor: "black" }}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-[100px] h-[50px] bg-white border-2 border-[#E2E2E2] rounded-[30px] justify-center items-center" 
          onPress={() => navigation.navigate("SignIn")}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: GOOGLE_ICON_URL }}
            className="w-[30px] h-[30px]"
          />
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-[100px] h-[50px] bg-[#00A2FD] rounded-[30px] justify-center items-center"
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: FACEBOOK_ICON_URL }}
            className="w-[30px] h-[30px]"
            style={{ tintColor: "white" }}
          />
        </TouchableOpacity>
      </View>

      <Text className="text-[15px] text-black text-center mb-[110px] p-2.5 font-['DM']">
        By signing or logging in, you agree to the{" "}
        <Text className="text-red-500 underline">Terms and Conditions</Text> of service and{" "}
        <Text className="text-red-500 underline">Privacy Policy</Text>.
      </Text>
    </SafeAreaView>
  );
}
