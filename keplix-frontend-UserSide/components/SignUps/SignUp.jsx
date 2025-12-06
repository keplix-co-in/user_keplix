import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { authAPI } from '../../services/api';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureEntryNew, setSecureEntryNew] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordMatch = newPassword === confirmPassword;
  const isPasswordLengthValid = newPassword.length >= 6;

  const isFormValid =
    email.trim() &&
    newPassword.trim() &&
    confirmPassword.trim() &&
    isEmailValid &&
    isPasswordMatch &&
    isPasswordLengthValid;

  const handleVerify = async () => {
    setSubmitted(true);
    if (!isFormValid) return;

    setLoading(true);

    try {
      // Sign up user
      const response = await authAPI.signup({
        email: email.trim(),
        password: newPassword,
        role: 'user', // User-side signup
      });

      // Send email verification OTP
      await authAPI.sendEmailOTP(email.trim());

      Alert.alert(
        'Success',
        'Account created! Please check your email for verification code.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate("EmailVerify", { email: email.trim() }),
          },
        ]
      );
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response?.data?.error) {
        Alert.alert('Signup Failed', error.response.data.error);
      } else if (error.response?.data?.email) {
        Alert.alert('Signup Failed', error.response.data.email[0]);
      } else if (error.message === 'Network Error') {
        Alert.alert('Network Error', 'Please check your internet connection and ensure the backend server is running.');
      } else {
        Alert.alert('Signup Failed', 'Unable to create account. Please try again.');
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

      <Text className="font-medium text-black text-[32px] mb-8 font-['DM']">Sign Up</Text>

      <View>
        <Text className="text-sm text-[#666] mb-2 font-['DM']">Enter your email address</Text>
        <TextInput
          className={`h-[56px] border-2 rounded-2xl px-4 text-base text-black font-['DM'] ${submitted && (!email.trim() || !isEmailValid) ? 'border-red-600' : 'border-[#E8E8E8]'}`}
          placeholder="Eg: xyz@gmail.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mt-5">
        <Text className="text-sm text-[#666] mb-2 font-['DM']">Enter your new password</Text>
        <View className={`flex-row items-center border-2 rounded-2xl px-4 h-[56px] ${submitted && (!newPassword.trim() || !isPasswordLengthValid) ? 'border-red-600' : 'border-[#E8E8E8]'}`}>
          <TextInput
            className="flex-1 text-base text-black font-['DM']"
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secureEntryNew}
          />
          <TouchableOpacity onPress={() => setSecureEntryNew(prev => !prev)}>
            <Ionicons
              name={secureEntryNew ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-5">
        <Text className="text-sm text-[#666] mb-2 font-['DM']">Confirm new password</Text>
        <View className={`flex-row items-center border-2 rounded-2xl px-4 h-[56px] ${submitted && (!confirmPassword.trim() || !isPasswordMatch) ? 'border-red-600' : 'border-[#E8E8E8]'}`}>
          <TextInput
            className="flex-1 text-base text-black font-['DM']"
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureEntryConfirm}
          />
          <TouchableOpacity onPress={() => setSecureEntryConfirm(prev => !prev)}>
            <Ionicons
              name={secureEntryConfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1" />

      <TouchableOpacity
        className={`rounded-full py-4 items-center mb-4 ${isFormValid && !loading ? 'bg-red-600' : 'bg-[#CCCCCC]'}`}
        onPress={handleVerify}
        activeOpacity={0.7}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-medium font-['DM']">Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("SignUpPhone")}
      >
        <Text className="text-center text-[#666] text-sm border-2 border-[#E8E8E8] py-4 px-6 rounded-full font-['DM']">
          Sign up using{' '}
          <Text className="text-red-600 font-medium font-['DM']">Phone number</Text>
        </Text>
      </TouchableOpacity>

      <Text className="text-xs text-[#999] text-center px-8 mt-5 mb-5 font-['DM']">
        By signing or logging in, you agree to the{' '}
        <Text className="text-red-600 font-['DM']">Terms and Conditions</Text> of service and{' '}
        <Text className="text-red-600 font-['DM']">Privacy Policy</Text>
      </Text>
    </SafeAreaView>
  );
}


