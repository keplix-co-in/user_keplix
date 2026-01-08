import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authAPI } from '../../services/api';

export default function SendOtp({ navigation, route }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = [];

  const phoneNumber = route?.params?.phoneNumber || '';

  const handleInputChange = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      nextInputRef(index + 1);
    }
  };

  const nextInputRef = (index) => {
    if (inputRefs[index]) {
      inputRefs[index].focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  const handleVerifyOtp = async () => {
    setSubmitted(true);
    const enteredOtp = otp.join('');
    
    if (!isOtpComplete) {
      Alert.alert("Incomplete OTP", "Please fill all the OTP fields.");
      return;
    }

    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not found. Please try again.");
      return;
    }

    setLoading(true);

    try {
      await authAPI.verifyPhoneOTP(phoneNumber, enteredOtp);
      
      Alert.alert(
        'Success',
        'Phone number verified successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OtpVerified'),
          },
        ]
      );
    } catch (error) {
      console.error('Phone verification error:', error);
      
      if (error.response?.data?.error) {
        Alert.alert('Verification Failed', error.response.data.error);
      } else {
        Alert.alert('Verification Failed', 'Invalid OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not found. Please try again.");
      return;
    }

    setResending(true);

    try {
      await authAPI.sendPhoneOTP(phoneNumber);
      Alert.alert('Success', 'OTP has been sent again to your phone.');
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
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

      <Text className="text-black font-bold text-[32px] mb-1 font-['DM']">Sign Up</Text>
      <Text className="text-sm text-[#999] mb-8 font-['DM']">
        An OTP code has been sent via{'\n'}phone number +91**********
      </Text>

      <View className="flex-row justify-between mb-8 mt-6 px-2">
        {otp.map((digit, index) => (
          <View
            key={index}
            className="w-[48px] h-[48px] bg-[#F5F5F5] rounded-2xl items-center justify-center border border-[#E8E8E8]"
          >
            <TextInput
              ref={(ref) => (inputRefs[index] = ref)}
              className="w-full h-full text-center text-2xl text-black font-['DM'] font-semibold"
              value={digit}
              onChangeText={(text) => handleInputChange(text, index)}
              keyboardType="numeric"
              maxLength={1}
            />
          </View>
        ))}
      </View>

      <View className="flex-1" />

      <TouchableOpacity
        className={`rounded-full py-4 items-center mb-4 ${isOtpComplete && !loading ? 'bg-red-600' : 'bg-[#CCCCCC]'}`}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-medium font-['DM']">Verify OTP</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center items-center mt-4 mb-8">
  <Text className="text-[#666] text-sm font-['DM']">
    Didn't receive OTP?
  </Text>
  
  <TouchableOpacity 
    onPress={handleResend} 
    disabled={resending}
    className="ml-2 active:opacity-60"
  >
    {resending ? (
      <ActivityIndicator size="small" color="#D82424" />
    ) : (
      <Text className="text-red-600 text-sm font-bold font-['DM']">
        Resend
      </Text>
    )}
  </TouchableOpacity>
</View>
      
      

      <Text className="text-xs text-[#999] text-center px-8 mb-5 font-['DM']">
        By signing or logging in, you agree to the{' '}
        <Text className="text-red-600 font-['DM']">Terms and Conditions</Text> of service and{' '}
        <Text className="text-red-600 font-['DM']">Privacy Policy</Text>
      </Text>
    </SafeAreaView>
  );
}


