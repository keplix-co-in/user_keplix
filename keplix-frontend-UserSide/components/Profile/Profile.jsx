import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';
import { tokenManager } from '../../services/tokenManager';

const SettingsItem = ({ icon, title, navigation, targetScreen }) => (
  <TouchableOpacity
    className="flex-row items-center justify-between px-5 py-4 border-b border-[#E8E8E8] w-full active:bg-gray-50"
    onPress={() => navigation.navigate(targetScreen)}
  >
    <View className="flex-row items-center flex-1">
      <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color="#DC2626" />
      </View>
      <Text className="text-base text-gray-900 font-dm">{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);



export default function Profile({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Check if user has tokens first
      const accessToken = await tokenManager.getAccessToken();
      const refreshToken = await tokenManager.getRefreshToken();
      
      // If no tokens, user is not logged in
      if (!accessToken && !refreshToken) {
        setLoading(false);
        Alert.alert(
          'Not Logged In',
          'Please sign in to view your profile',
          [
            {
              text: 'Sign In',
              onPress: () => navigation.navigate('SignIn')
            }
          ]
        );
        return;
      }

      // Try to load from AsyncStorage first
      const storedUser = await AsyncStorage.getItem('user_data');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }

      // Fetch latest profile from backend
      try {
        const response = await authAPI.getProfile();
        if (response.data) {
          setUserData(response.data);
          await AsyncStorage.setItem('user_data', JSON.stringify(response.data));
        }
      } catch (apiError) {
        console.log('Could not fetch profile from API, using cached data');
        // If token is invalid/expired, redirect to login
        if (apiError.message === 'No refresh token available' || apiError.response?.status === 401) {
          await tokenManager.clearTokens();
          await AsyncStorage.removeItem('user_data');
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please sign in again.',
            [
              {
                text: 'Sign In',
                onPress: () => navigation.navigate('SignIn')
              }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // If we have stored data, use it
      const storedUser = await AsyncStorage.getItem('user_data');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              // Call logout API
              await authAPI.logout();
            } catch (error) {
              console.error('Logout API error:', error);
            } finally {
              // Clear local data regardless of API success
              await tokenManager.clearTokens();
              await AsyncStorage.removeItem('user_data');
              navigation.navigate("SignIn");
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="mt-4 text-base text-gray-600 font-dm">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  // If no user data after loading, show login prompt
  if (!userData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-6">
        <View className="w-24 h-24 bg-red-50 rounded-full items-center justify-center mb-6">
          <Ionicons name="person-outline" size={48} color="#DC2626" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-3 font-dm">Not Logged In</Text>
        <Text className="text-base text-gray-600 text-center mb-8 font-dm">
          Please sign in to view your profile and access settings
        </Text>
        <TouchableOpacity
          className="bg-red-600 py-4 px-8 rounded-full"
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text className="text-white text-base font-bold font-dm">Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-red-600" edges={['top']}>
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
        {/* Header with Red Background */}
        <View className="bg-red-600 pt-3 pb-32">
          <View className="px-5">
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              className="w-11 h-11 rounded-full border-2 border-white items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Section - Overlapping with Curved Top */}
        <View className="bg-white rounded-t-3xl -mt-6 px-5 pt-2 pb-24">
        <View className="items-center mb-8">
          {/* Profile Image with Edit Button */}
          <View className="relative mb-4">
            <Image
              source={userData?.profile_picture ? { uri: userData.profile_picture } : require("../../assets/images/3.jpeg")}
              className="w-40 h-40 rounded-full border-4 border-white"
            />
            <TouchableOpacity 
              className="absolute bottom-0 right-0 w-12 h-12 bg-red-600 rounded-full items-center justify-center border-4 border-white"
              onPress={() => navigation.navigate("UserProfile")}
            >
              <Ionicons name="pencil" size={20} color="white" />
            </TouchableOpacity>
          </View>
          
          {/* User Info */}
          <Text className="text-2xl font-bold text-gray-900 font-dm mb-1">
            {userData?.name || userData?.username || 'Nithish Kumar'}
          </Text>
          <Text className="text-base text-gray-600 font-dm">
            {userData?.phone_number || userData?.phone || '+91 7783833838393'}
          </Text>
        </View>

        {/* Menu Items */}
        <View className="bg-white">
          <TouchableOpacity
            className="flex-row items-center justify-between py-5 border-b border-gray-100"
            onPress={() => navigation.navigate("UpdatePayment")}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 items-center justify-center mr-4">
                <Ionicons name="card" size={24} color="#000" />
              </View>
              <Text className="text-lg text-gray-900 font-dm">Payment Methods</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-5 border-b border-gray-100"
            onPress={() => navigation.navigate("ReviewList")}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 items-center justify-center mr-4">
                <Ionicons name="chatbox-ellipses" size={24} color="#000" />
              </View>
              <Text className="text-lg text-gray-900 font-dm">My Reviews</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-5 border-b border-gray-100"
            onPress={() => navigation.navigate("Security")}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 items-center justify-center mr-4">
                <Ionicons name="shield" size={24} color="#000" />
              </View>
              <Text className="text-lg text-gray-900 font-dm">Security Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-5 border-b border-gray-100"
            onPress={() => navigation.navigate("Notification")}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 items-center justify-center mr-4">
                <Ionicons name="notifications" size={24} color="#000" />
              </View>
              <Text className="text-lg text-gray-900 font-dm">Notification Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between py-5 border-b border-gray-100"
            onPress={() => navigation.navigate("Support")}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 items-center justify-center mr-4">
                <Ionicons name="help-circle" size={24} color="#000" />
              </View>
              <Text className="text-lg text-gray-900 font-dm">Support & Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View className="mt-8 mb-6 gap-4">
          <TouchableOpacity
            className="bg-white border-2 border-red-600 rounded-full py-4 items-center"
            onPress={() => Alert.alert('Delete Account', 'Are you sure you want to delete your account?')}
          >
            <Text className="text-red-600 text-lg font-semibold font-dm">Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-600 rounded-full py-4 items-center"
            onPress={handleLogout}
          >
            <Text className="text-white text-lg font-semibold font-dm">Log Out</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
