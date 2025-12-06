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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';
import { tokenManager } from '../../services/tokenManager';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureEntry, setSecureEntry] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);

  const isFormFilled = email.trim() !== "" && password.trim() !== "";

  const handleVerify = async () => {
    if (!isFormFilled) return;

    setLoading(true);
    setIsValid(true);

    try {
      const response = await authAPI.login({
        email: email.trim(),
        password: password,
      });

      // Store tokens
      await tokenManager.setTokens(response.data.access, response.data.refresh);

      // Store user data
      const userData = {
        id: response.data.user.id,
        email: response.data.user.email,
        role: response.data.user.role,
        name: response.data.user.name || '',
        phone: response.data.user.phone || '',
        address: response.data.user.address || '',
        is_active: response.data.user.is_active,
      };
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));

      // Navigate to homepage
      navigation.navigate("Homepage");
    } catch (error) {
      console.error('Login error:', error);
      setIsValid(false);
      
      if (error.response?.data?.error) {
        Alert.alert('Login Failed', error.response.data.error);
      } else if (error.message === 'Network Error') {
        Alert.alert('Network Error', 'Please check your internet connection and ensure the backend server is running.');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
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

      <Text className="font-medium text-[32px] mb-2.5 text-black font-['DM']">Sign In</Text>

      <View className="mt-8">
        <Text className="text-sm text-[#666] mb-2 font-['DM']">
          Enter your email address
        </Text>
        <TextInput
          className={`h-[56px] border-2 rounded-2xl px-4 text-base text-black font-['DM'] ${!isValid ? 'border-red-600' : 'border-[#E8E8E8]'}`}
          placeholder="Eg: xyz@gmail.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mt-5">
        <Text className="text-sm text-[#666] mb-2 font-['DM']">Enter password</Text>
        <View className={`flex-row items-center border-2 rounded-2xl px-4 h-[56px] ${!isValid ? 'border-red-600' : 'border-[#E8E8E8]'}`}>
          <TextInput
            className="flex-1 text-base text-black font-['DM']"
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureEntry}
          />
          <TouchableOpacity onPress={() => setSecureEntry((prev) => !prev)}>
            <Ionicons
              name={secureEntry ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#999"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        className="self-end mt-3"
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text className="text-red-600 text-sm font-['DM']">
          Forgot password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`rounded-full py-4 items-center mt-auto mb-5 ${isFormFilled && !loading ? 'bg-red-600' : 'bg-[#CCCCCC]'}`}
        onPress={() => {
          if (isFormFilled && !loading) {
            handleVerify();
          }
        }}
        activeOpacity={isFormFilled ? 0.7 : 1}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-medium font-['DM']">Verify</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row items-center justify-center mb-5">
        <Text className="text-[#666] text-sm font-['DM']">
          Don't have account? 
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text className="text-red-600 text-sm font-medium font-['DM'] ml-1">
            Create one
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


