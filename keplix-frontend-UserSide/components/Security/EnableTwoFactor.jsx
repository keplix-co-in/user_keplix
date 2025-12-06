import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EnableTwoFactor({ navigation }) {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [saving, setSaving] = useState(false);

  const handleChange = (value, index) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move to next input if not last and input is filled
    if (value && index < 5) {
      const nextInput = `pin${index + 1}`;
      refs[nextInput].focus();
    }
  };

  const refs = {};

  const isComplete = pin.every((val) => val !== '');

  const handleSave = async () => {
    if (!isComplete) return;

    setSaving(true);
    try {
      const pinCode = pin.join('');
      
      // Save 2FA settings to AsyncStorage
      const twoFactorSettings = {
        enabled: true,
        pin: pinCode,
        enabledAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('two_factor_settings', JSON.stringify(twoFactorSettings));
      
      navigation.navigate('AddEmail');
    } catch (error) {
      console.error('Error saving 2FA settings:', error);
      Alert.alert('Error', 'Failed to enable two-factor authentication');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 px-6 bg-white">
      <View className="mt-5 mb-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-[20px] border-2 border-[#E2E2E2] justify-center items-center">
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-medium text-center mb-[30px] font-['DM'] text-black">Two-Factor Authentication</Text>

      <View className="items-center mb-5">
        <MaterialCommunityIcons name="checkbox-multiple-marked-outline" size={40} color="#DC2626" />
      </View>

      <Text className="text-sm text-center text-[#0000008F] font-['DM'] mb-5">Enter your new 6 digit pin.</Text>

      <View className="flex-row justify-between mx-5 mb-10">
        {pin.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (refs[`pin${index}`] = ref)}
            className={`w-12 h-12 text-center text-xl border-2 rounded-lg font-['DM'] ${digit ? 'border-[#DC2626] text-black' : 'border-[#E2E2E2] text-black'}`}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
          />
        ))}
      </View>

      <View className="mt-auto mb-5">
        <TouchableOpacity
          className={`rounded-[70px] py-4 items-center ${isComplete ? 'bg-[#DC2626]' : 'bg-gray-500'}`}
          disabled={!isComplete || saving}
          onPress={handleSave}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-medium font-['DM']">Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
