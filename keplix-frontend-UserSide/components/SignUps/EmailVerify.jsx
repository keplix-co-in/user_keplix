import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, 
  Alert, KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authAPI } from '../../services/api';

export default function EmailVerify({ navigation, route }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  const email = route?.params?.email || '';

  const handleInputChange = (text, index) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // If backspace is pressed on an empty input, go to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('').trim();
    if (!isOtpComplete) {
      Alert.alert("Incomplete OTP", "Please fill all the OTP fields.");
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyEmailOTP(email.trim(), enteredOtp);
      Alert.alert('Success', 'Email verified successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('WelcomeScreen') },
      ]);
    } catch (error) {
      const msg = error.response?.data?.error || 'Invalid OTP. Please try again.';
      Alert.alert('Verification Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.sendEmailOTP(email);
      Alert.alert('Success', 'OTP has been sent to your email again.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-5">
          
          {/* Back Button */}
          <View className="mb-8">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="w-10 h-10 items-center justify-center border border-gray-200 rounded-full"
            >
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Titles */}
          <Text className="text-black font-bold text-[32px] mb-2 font-['DM']">Verify Email</Text>
          <Text className="text-gray-500 text-base mb-10 font-['DM']">
            An OTP code has been sent to{'\n'}
            <Text className="text-black font-semibold">{email}</Text>
          </Text>

          {/* OTP Input Container */}
          <View className="flex-row justify-between mb-10">
            {otp.map((digit, index) => (
              <View 
                key={index}
                className={`w-[48px] h-[58px] border-2 rounded-xl items-center justify-center 
                  ${digit ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-gray-50'}`}
              >
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className="w-full h-full text-center text-2xl text-black font-bold font-['DM']"
                  value={digit}
                  onChangeText={(text) => handleInputChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                />
              </View>
            ))}
          </View>

          {/* Flexible Spacer to push content to bottom */}
          <View className="flex-1" />

          {/* Resend Section (Clean Link Style) */}
          <View className="flex-row justify-center items-center mb-6">
            <Text className="text-gray-500 text-sm font-['DM']">
              Didn't receive OTP? 
            </Text>
            <TouchableOpacity onPress={handleResend} disabled={resending} className="ml-2">
              {resending ? (
                <ActivityIndicator size="small" color="#D82424" />
              ) : (
                <Text className="text-red-600 font-bold font-['DM'] underline">Resend</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            className={`rounded-full py-4 items-center shadow-sm ${isOtpComplete && !loading ? 'bg-red-600' : 'bg-gray-200'}`}
            onPress={handleVerifyOtp}
            disabled={loading || !isOtpComplete}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className={`text-lg font-bold font-['DM'] ${isOtpComplete ? 'text-white' : 'text-gray-400'}`}>
                Verify OTP
              </Text>
            )}
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}