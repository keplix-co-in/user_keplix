import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authAPI } from '../../services/api';

export default function EmailVerify({ navigation, route }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = [];

  const email = route?.params?.email || '';

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
    const enteredOtp = otp.join('').trim();
    
    if (!isOtpComplete) {
      Alert.alert("Incomplete OTP", "Please fill all the OTP fields.");
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email not found. Please try signing up again.");
      return;
    }

    // Validate OTP is exactly 6 digits
    if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      await authAPI.verifyEmailOTP(email.trim(), enteredOtp);
      
      Alert.alert(
        'Success',
        'Email verified successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('WelcomeScreen'),
          },
        ]
      );
    } catch (error) {
      console.error('Email verification error:', error);
      
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
    if (!email) {
      Alert.alert("Error", "Email not found. Please try signing up again.");
      return;
    }

    setResending(true);

    try {
      await authAPI.sendEmailOTP(email);
      Alert.alert('Success', 'OTP has been sent to your email again.');
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} size={30} color="black" className="border-2 border-[#E2E2E2] rounded-full" />
        </TouchableOpacity>
      </View>

      <Text className="text-black font-medium text-[32px] mb-[15px] font-['DM']">Verify Email</Text>
      <Text className="text-[#666] text-base mb-5 font-['DM']">
        An OTP code has been sent to {email}
      </Text>

      <View className="flex-row justify-between mb-[280px]">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs[index] = ref)}
            className={`w-[50px] h-[50px] border-2 rounded-[10px] text-center text-lg text-black font-['DM'] ${submitted && otp[index] === '' ? 'border-red-600' : 'border-[#ddd]'}`}
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
          />
        ))}
      </View>

      <TouchableOpacity
        className={`rounded-[70px] py-[15px] items-center mb-5 ${isOtpComplete && !loading ? 'bg-red-600' : 'bg-[#888]'}`}
        onPress={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-medium font-['DM']">Verify OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend} disabled={resending}>
        <Text className="text-center text-[#666] text-sm border-2 border-[#E2E2E2] p-[15px] rounded-[70px] font-['DM']">
          Didn't receive OTP? {resending ? (
            <ActivityIndicator size="small" color="#D82424" />
          ) : (
            <Text className="text-red-600 underline font-['DM']">Resend</Text>
          )}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
