import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as tokenManager from '../../services/tokenManager';

const SettingsItem = ({ icon, title, navigation, targetScreen }) => (
  <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100" onPress={() => navigation.navigate(targetScreen)}>
    <View className="flex-row items-center gap-3">
      <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center">
        <Ionicons name={icon} size={20} color="#374151" />
      </View>
      <Text className="text-base text-gray-900 font-dm">{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

const NavItem = ({ icon, text, active, navigation, targetScreen }) => (
  <TouchableOpacity 
    className="items-center" 
    onPress={() => navigation.navigate(targetScreen)}
  >
    <Ionicons 
      name={icon} 
      size={44} 
      color={active ? "#DC2626" : "#666"} 
    />
    <Text className={`text-xs mt-1 ${active ? 'text-red-500' : 'text-gray-600'}`}>{text}</Text>
  </TouchableOpacity>
);


export default function HamburgerMenu({navigation}) {
  const [userName, setUserName] = useState('User');
  const [userPhone, setUserPhone] = useState('');
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.name || user.first_name || 'User');
        setUserPhone(user.phone || user.phone_number || '');
        setUserImage(user.profile_picture || user.image);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await tokenManager.clearTokens();
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center px-5 pt-5 pb-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1 items-center pr-10">
          <Text className="text-2xl font-semibold text-gray-900 font-dm">Menu</Text>
        </View>
      </View>

      {/* Profile Section */}
      <TouchableOpacity 
        className="flex-row items-center justify-between p-5 mx-4 mb-6 bg-gray-50 border border-[#E8E8E8] rounded-2xl" 
        onPress={()=> navigation.navigate("UserProfile")}
      >
        <View className="flex-row items-center gap-4">
          <Image 
            source={userImage ? { uri: userImage } : require('../../assets/images/3.jpeg')}
            className="w-16 h-16 rounded-xl"
          />
          <View>
            <Text className="text-xl font-bold text-gray-900 font-dm">{userName}</Text>
            {userPhone && (
              <Text className="text-sm text-gray-500 mt-1 font-dm">{userPhone}</Text>
            )}
          </View>
        </View>
        <View className="w-8 h-8 rounded-full bg-red-600 items-center justify-center">
          <Ionicons name="chevron-forward" size={18} color="#FFF" />
        </View>
      </TouchableOpacity>

      {/* Settings Items */}
      <Text className="text-lg font-semibold text-gray-900 px-4 mb-3 font-dm">Settings</Text>
            <View className="flex-1">
              <SettingsItem icon="card" title="Payment Methods"  navigation={navigation} targetScreen='UpdatePayment' />
              <SettingsItem icon="time-outline" title="Booking History" navigation={navigation} targetScreen='BookingList'/>
              <SettingsItem icon="star" title="My Reviews"  navigation={navigation} targetScreen='ReviewList' />
              <SettingsItem icon="shield" title="Security Settings" navigation={navigation} targetScreen='Security'/>
              <SettingsItem icon="notifications" title="Notification Settings" navigation={navigation} targetScreen='Notification' />
              <SettingsItem icon="help-circle-outline" title="Support & Help" navigation={navigation} targetScreen='Support'/>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              className="flex-row items-center px-6 py-5 mx-4 mt-auto mb-6 bg-red-50 border border-red-100 rounded-2xl"
              onPress={handleLogout}
            >
              <View className="w-10 h-10 bg-red-600 rounded-xl items-center justify-center">
                <Ionicons name="log-out-outline" size={20} color="#FFF" />
              </View>
              <Text className="flex-1 text-center text-lg font-semibold text-red-600 font-dm">Logout</Text>
            </TouchableOpacity>

    </SafeAreaView>
  );
};


