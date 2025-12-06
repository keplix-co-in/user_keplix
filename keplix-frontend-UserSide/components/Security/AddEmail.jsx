import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AddEmail({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('TwoFactorConfirm');
  };

  return (
    <SafeAreaView className="flex-1 px-6 bg-white">
      <View className="mt-5 mb-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full border-2 border-[#E2E2E2] justify-center items-center">
          <Ionicons name="arrow-back-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-medium text-center mb-6 font-['DM'] text-black">Two-Factor Authentication</Text>

      <View className="items-center mb-6">
        <MaterialCommunityIcons name="email" size={40} color="#fff" style={{backgroundColor: '#DC2626', padding: 12, borderRadius: 12}} />
      </View>

      <Text className="text-base font-medium font-['DM'] text-center text-black mb-2">Add email in case you forget your Pin</Text>

      <Text className="text-sm font-medium font-['DM'] text-center text-[#0000008F] mx-2.5 mb-10">
        Two step verification is on. Add an email address to your account to make sure you have access if you forget your pin.
      </Text>

      <View className="mt-auto mb-5">
        <TouchableOpacity
          className="bg-[#DC2626] py-4 rounded-[70px] items-center mb-3"
          onPress={() => navigation.navigate('UserProfile')}
        >
          <Text className="text-white text-base font-medium font-['DM']">Add Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white py-4 rounded-[70px] border border-[#DADADA] items-center"
          onPress={() => setModalVisible(true)}
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
              Are you sure you want to skip from adding email incase you forget your pin. This
              prevents you from losing access if you forget 2FA.
            </Text>
            <Pressable className="bg-[#DC2626] py-3.5 rounded-[70px] w-full items-center" onPress={handleConfirm}>
              <Text className="text-white font-medium font-['DM'] text-base">Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
