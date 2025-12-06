import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons"
import { authAPI } from '../../services/api';


export default function ForgotPassword({navigation}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const isFormFilled = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());

  const handleContinue = async () => {
    if (!isFormFilled) return;

    setLoading(true);

    try {
      await authAPI.forgotPassword(email.trim());
      
      Alert.alert(
        'Success',
        'Password reset OTP has been sent to your email.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate("ResetPassword", { email: email.trim() }),
          },
        ]
      );
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error.response?.data?.error) {
        Alert.alert('Error', error.response.data.error);
      } else if (error.message === 'Network Error') {
        Alert.alert('Network Error', 'Please check your internet connection and ensure the backend server is running.');
      } else {
        Alert.alert('Error', 'Failed to send reset email. Please try again.');
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

      <Text className="font-medium text-black text-[32px] mb-2 font-['DM']">Forgot Password</Text>

      <View className="mt-8">
        <Text className="text-sm text-[#666] mb-2 font-['DM']">Enter your email address</Text>
        <TextInput
          className="text-black h-[56px] border-2 border-[#E8E8E8] rounded-2xl px-4 text-base font-['DM']"
          placeholder="Eg: xyz@gmail.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="flex-1" />

      <TouchableOpacity 
        className={`rounded-full py-4 items-center mb-5 ${isFormFilled && !loading ? 'bg-red-600' : 'bg-[#CCCCCC]'}`} 
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-medium font-['DM']">Continue</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity>
        <Text className="text-center text-[#666] text-sm border-2 border-[#E8E8E8] py-4 px-6 rounded-full font-['DM']">
          Reset the password via{' '}
          <Text className="text-red-600 font-medium font-['DM']">phone number</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
