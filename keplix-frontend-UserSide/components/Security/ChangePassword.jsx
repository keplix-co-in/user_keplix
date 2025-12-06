import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../../services/api';

export default function ChangePassword({navigation}) {
  const [password, setPassword] = useState('');
  const [secureEntryNew, setSecureEntryNew] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Check if password is at least 8 characters
  useEffect(() => {
    setIsValidPassword(password.length >= 8);
  }, [password]);

  const handleContinue = async () => {
    if (!isValidPassword) return;

    setVerifying(true);
    try {
      // For now, we'll store the current password and pass it to the next screen
      // In a real app, you'd verify the current password with the backend
      await AsyncStorage.setItem('temp_current_password', password);
      navigation.navigate("ChangePassword1", { currentPassword: password });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-white">

      <View className="flex-row items-center mb-10">
        <TouchableOpacity onPress={()=> navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} size={30} color="#000" style={{borderColor: '#E2E2E2', borderWidth: 2, borderRadius: 50, padding: 5}} />
        </TouchableOpacity>
      </View>

      <Text className="font-medium text-[28px] mb-10 font-['DM']">Change Password</Text>

      <View>
        <Text className="text-base text-[#0000008F] mb-2.5 font-['DM']">Enter your current password</Text>
        <View className="flex-row items-center border-2 border-[#ddd] rounded-[70px] mb-[350px]">
          <TextInput
            className="flex-1 h-[50px] px-2.5 text-base font-['DM']"
            placeholder="Eg: a62gjf7hi"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureEntryNew}
          />
          <TouchableOpacity onPress={() => setSecureEntryNew((prev) => !prev)}>
            <Ionicons
              name={secureEntryNew ? "eye-off" : "eye"}
              size={24}
              color="#0000008F"
              style={{marginRight: 10}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        className={`rounded-[70px] py-4 items-center mb-5 ${isValidPassword ? 'bg-[#DC2626]' : 'bg-[#0000008F]'}`}
        onPress={handleContinue}
        disabled={!isValidPassword || verifying}
      >
        {verifying ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-base font-medium font-['DM']">Continue</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text className="rounded-[70px] text-center text-[#666] text-base border-2 border-[#E2E2E2] p-4 font-['DM']">
            Forgot Password
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
