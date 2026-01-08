import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuItem = ({ icon, title, onPress, showBorder = true }) => (
  <TouchableOpacity
    className={`flex-row items-center justify-between px-4 py-4 ${showBorder ? 'border-b border-gray-100' : ''}`}
    onPress={onPress}
  >
    <View className="flex-row items-center gap-3">
      <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center">
        <Ionicons name={icon} size={20} color="#374151" />
      </View>
      <Text className="text-base text-gray-900 font-dm">{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

export default function Security({ navigation }) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    checkTwoFactorStatus();
    
    // Listen for navigation focus to refresh 2FA status
    const unsubscribe = navigation.addListener('focus', () => {
      checkTwoFactorStatus();
    });
    
    return unsubscribe;
  }, [navigation]);

  const checkTwoFactorStatus = async () => {
    try {
      const settings = await AsyncStorage.getItem('two_factor_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setTwoFactorEnabled(parsed.enabled || false);
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const handleChangePasswordPress = () => {
    navigation.navigate('ChangePassword');
  };

  const handleTwoFactorAuthPress = () => {
    if (twoFactorEnabled) {
      navigation.navigate('TwoFactorAuthOFF');
    } else {
      navigation.navigate('TwoFactorAuth');
    }
  };

  const handlePrivacyPolicyPress = () => {
    navigation.navigate('PrivacyPolicy'); 
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-5 pt-5 pb-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1 items-center pr-10">
          <Text className="text-2xl font-semibold text-gray-900 font-dm">Security</Text>
        </View>
      </View>

      <View className="mt-2">
        <MenuItem 
          icon="ellipsis-horizontal"
          title="Change Password"
          onPress={handleChangePasswordPress}
        />
        <MenuItem 
          icon="shield-checkmark"
          title={`Two-Factor Authentication ${twoFactorEnabled ? '(Enabled)' : ''}`}
          onPress={handleTwoFactorAuthPress}
        />
        <MenuItem 
          icon="document-lock"
          title="Privacy Policy"
          onPress={handlePrivacyPolicyPress}
        />
      </View>
    </SafeAreaView>
  );
}
