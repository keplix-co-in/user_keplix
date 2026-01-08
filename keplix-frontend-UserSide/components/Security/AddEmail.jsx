import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddEmail({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally pre-fill user email here if available in another storage key
  }, []);

  const handleSkip = () => {
    setModalVisible(true);
  };

  const confirmSkip = () => {
    setModalVisible(false);
    navigation.navigate('TwoFactorConfirm');
  };

  const handleSaveEmail = async () => {
      if (!email || !email.includes('@')) {
          Alert.alert("Invalid Email", "Please enter a valid recovery email address.");
          return;
      }
      
      setLoading(true);
      try {
          const existingRaw = await AsyncStorage.getItem('two_factor_settings');
          const existing = existingRaw ? JSON.parse(existingRaw) : {};
          
          const updatedSettings = {
              ...existing,
              email: email,
          };

          await AsyncStorage.setItem('two_factor_settings', JSON.stringify(updatedSettings));
          navigation.navigate('TwoFactorConfirm');
      } catch (e) {
          Alert.alert("Error", "Failed to save email.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <SafeAreaView className="flex-1 px-6 bg-white">
      <View className="mt-5 mb-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full border-2 border-[#E2E2E2] justify-center items-center">
          <Ionicons name="arrow-back-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-medium text-center mb-6 font-['DM'] text-black">Add Recovery Email</Text>

      <View className="items-center mb-6">
        <MaterialCommunityIcons name="email" size={40} color="#fff" style={{backgroundColor: '#DC2626', padding: 12, borderRadius: 12}} />
      </View>

      <Text className="text-base font-medium font-['DM'] text-center text-black mb-2">Add email in case you forget your PIN</Text>

      <Text className="text-sm font-medium font-['DM'] text-center text-[#0000008F] mx-2.5 mb-10">
        Two step verification is on. Add an email address to your account to make sure you have access if you forget your pin.
      </Text>

      {/* Email Input */}
      <View className="mb-10">
         <Text className="text-sm font-bold text-gray-700 mb-2 ml-2 font-['DM']">Email Address</Text>
         <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 font-['DM']"
         />
      </View>

      <View className="mt-auto mb-5">
        <TouchableOpacity
          className="bg-[#DC2626] py-4 rounded-[70px] items-center mb-3"
          onPress={handleSaveEmail}
          disabled={loading}
        >
          <Text className="text-white text-base font-medium font-['DM']">
             {loading ? 'Saving...' : 'Add Email'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white py-4 rounded-[70px] border border-[#DADADA] items-center"
          onPress={handleSkip}
        >
          <Text className="text-[#8C8C8C] text-base font-medium font-['DM']">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[85%] rounded-[20px] p-5 items-center relative" style={{elevation: 5}}>
            {/* Close icon moved outside the modal */}
            <TouchableOpacity onPress={() => setModalVisible(false)} className="absolute top-2.5 left-2.5 z-10">
              <Ionicons name="close" size={22} color="#000" />
            </TouchableOpacity>
            <Text className="text-sm font-medium font-['DM'] text-[#333] text-center my-10 leading-5">
              Are you sure you want to skip adding an email? This prevents you from recovering your account if you forget your PIN.
            </Text>
            <Pressable className="bg-[#DC2626] py-3.5 rounded-[70px] w-full items-center" onPress={confirmSkip}>
              <Text className="text-white font-medium font-['DM'] text-base">Skip & Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
