import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { authAPI } from '../../services/api';

export default function SignUpPhone({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPhoneValid = /^\d{10}$/.test(phoneNumber);
  const isFormValid = phoneNumber.trim() && isPhoneValid;

  const handleSendOtp = async () => {
    setSubmitted(true);
    if (!isFormValid) return;

    setLoading(true);

    try {
      // Send phone OTP
      const fullPhoneNumber = `+91${phoneNumber}`;
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
    } catch (error) {
      console.error('Send OTP error:', error);
      
      if (error.response?.data?.error) {
        Alert.alert('Error', error.response.data.error);
      } else if (error.message === 'Network Error') {
        Alert.alert('Network Error', 'Please check your internet connection and ensure the backend server is running.');
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-white">
      <View className="flex-row items-center mb-10">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="font-medium text-[32px] mb-1 font-['DM'] text-black">Sign Up</Text>
      <Text className="text-sm text-[#999] mb-8 font-['DM']">
        You will receive an OTP for verification once{'\n'}you enter your phone number
      </Text>

      <View className="mt-4">
        <Text className="text-sm text-[#666] mb-2 font-['DM']">Enter your phone number</Text>
        <TextInput
          className={`h-[56px] border-2 rounded-2xl px-4 text-base text-black font-['DM'] ${submitted && !isFormValid ? 'border-red-600' : 'border-[#E8E8E8]'}`}
          placeholder="+91 9763303254"
          placeholderTextColor="#999"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <View className="flex-1" />

      <TouchableOpacity
        className={`rounded-full py-4 items-center mb-4 ${isFormValid && !loading ? 'bg-red-600' : 'bg-[#CCCCCC]'}`}
        onPress={handleSendOtp}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-medium font-['DM']">
            Send OTP
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text className="text-center text-[#666] text-sm border-2 border-[#E8E8E8] py-4 px-6 rounded-full font-['DM']">
          Sign up using{' '}
          <Text className="text-red-600 font-medium font-['DM']">E-mail</Text>
        </Text>
      </TouchableOpacity>

      <Text className="text-xs text-[#999] text-center px-8 mt-5 mb-5 font-['DM']">
        By signing or logging in, you agree to the{" "}
        <Text className="text-red-600 font-['DM']">Terms and Conditions</Text> of service and{" "}
        <Text className="text-red-600 font-['DM']">Privacy Policy</Text>
      </Text>
    </SafeAreaView>
  );
}


