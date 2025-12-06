import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TwoFactorAuthentication({ navigation }) {
  const [disabling, setDisabling] = useState(false);

  const handleTurnOff = () => {
    Alert.alert(
      'Disable Two-Factor Authentication',
      'Are you sure you want to turn off two-factor authentication? This will reduce your account security.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Turn Off',
          style: 'destructive',
          onPress: disableTwoFactor,
        },
      ]
    );
  };

  const disableTwoFactor = async () => {
    setDisabling(true);
    try {
      // Remove 2FA settings from AsyncStorage
      await AsyncStorage.removeItem('two_factor_settings');
      
      Alert.alert(
        'Success',
        'Two-factor authentication has been disabled',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Security'),
          },
        ]
      );
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      Alert.alert('Error', 'Failed to disable two-factor authentication');
    } finally {
      setDisabling(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6" edges={['top']}>
      <ScrollView contentContainerStyle={{paddingBottom: 20}}>
        <View className="mt-5 mb-[30px]">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-[20px] border-2 border-[#E2E2E2] justify-center items-center">
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-medium text-center mb-[30px] font-['DM'] text-black">Two-Factor Authentication</Text>

        <View className="items-center mb-[30px]">
          <MaterialCommunityIcons name="checkbox-multiple-marked-outline" size={40} color="#DC2626" />
        </View>

        <Text className="text-sm text-center text-[#0000008F] font-['DM'] px-2.5 mb-[30px]">
          For extra security, turn on two-step verification, which will require a PIN when registering your phone number with Keplix again.
          <Text className="text-[#DC2626]" onPress={() => Linking.openURL('https://example.com')}> Learn more</Text>
        </Text>

        <TouchableOpacity className="flex-row items-center mb-5">
          <Text className="text-base font-medium font-['DM'] text-black">*** Change Pin</Text>
        </TouchableOpacity>

        <View className="h-[1px] bg-[#E2E2E2] my-2.5" />

        <TouchableOpacity className="flex-row items-center mb-5">
          <Ionicons name="bulb-outline" size={20} color="#000" style={{ marginRight: 8 }} />
          <View>
            <Text className="text-base font-medium font-['DM'] text-black">Add Recovery Email</Text>
            <Text className="text-xs text-[#0000008F] font-['DM'] mt-0.5">Add an email address incase you forget your pin.</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View className="px-6 pb-5 bg-white">
        <TouchableOpacity 
          className="bg-[#DC2626] rounded-[70px] py-4 items-center" 
          onPress={handleTurnOff}
          disabled={disabling}
        >
          {disabling ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-medium font-['DM']">Turn Off</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
