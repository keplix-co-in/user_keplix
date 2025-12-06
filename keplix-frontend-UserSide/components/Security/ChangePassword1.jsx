import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';

export default function ChangePassword1({ navigation, route }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureEntryNew, setSecureEntryNew] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);
  const [changing, setChanging] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    loadCurrentPassword();
  }, []);

  const loadCurrentPassword = async () => {
    try {
      const stored = await AsyncStorage.getItem('temp_current_password');
      if (stored) {
        setCurrentPassword(stored);
      } else if (route?.params?.currentPassword) {
        setCurrentPassword(route.params.currentPassword);
      }
    } catch (error) {
      console.error('Error loading password:', error);
    }
  };

  const isValid =
    newPassword.length >= 8 && confirmPassword.length >= 8;

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (!currentPassword) {
      Alert.alert('Error', 'Current password not found. Please go back and try again.');
      return;
    }

    setChanging(true);
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      
      // Clear stored temporary password
      await AsyncStorage.removeItem('temp_current_password');
      
      navigation.navigate('PasswordReseted');
    } catch (error) {
      console.error('Error changing password:', error);
      Alert.alert(
        'Password Change Failed',
        error.response?.data?.detail || 
        error.response?.data?.message || 
        'Failed to change password. Please check your current password and try again.'
      );
    } finally {
      setChanging(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center mb-10">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name={"arrow-back-outline"} size={30} color="#000" style={{borderColor: '#E2E2E2', borderWidth: 2, borderRadius: 50}} />
          </TouchableOpacity>
        </View>

        <Text className="font-medium text-[28px] mb-[30px] font-['DM']">Change Password</Text>

        <View>
          <Text className="text-base text-[#0000008F] mb-2.5 font-['DM']">Enter your new password</Text>
          <View className="flex-row items-center border-2 border-[#ddd] rounded-[70px] mb-[30px] px-2.5">
            <TextInput
              className="flex-1 h-[50px] text-base text-black font-['DM']"
              placeholder="Eg: a62gjf7hi"
              placeholderTextColor="#aaa"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={secureEntryNew}
            />
            <TouchableOpacity onPress={() => setSecureEntryNew(prev => !prev)}>
              <Ionicons
                name={secureEntryNew ? "eye-off" : "eye"}
                size={24}
                style={{marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-base text-[#0000008F] mb-2.5 font-['DM']">Confirm new password </Text>
        <View className="flex-row items-center border-2 border-[#ddd] rounded-[70px] mb-[30px] px-2.5">
          <TextInput
            className="flex-1 h-[50px] text-base text-black font-['DM']"
            placeholder="Eg: a62gjf7hi"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureEntryConfirm}
          />
          <TouchableOpacity onPress={() => setSecureEntryConfirm(prev => !prev)}>
            <Ionicons
              name={secureEntryConfirm ? "eye-off" : "eye"}
              size={24}
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
        </View>

        <View className="mt-auto pb-2.5">
          <TouchableOpacity
            className={`rounded-[70px] py-4 items-center ${isValid ? 'bg-[#DC2626]' : 'bg-[#0000008F]'}`}
            disabled={!isValid || changing}
            onPress={handleChangePassword}
          >
            {changing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-medium font-['DM']">Change Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
