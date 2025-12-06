import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function TwoFactorScreen({ navigation }) {
  return (
    <SafeAreaView className="flex-1 px-6 bg-white">
      <View className="mt-5 mb-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-[20px] border-2 border-[#E2E2E2] justify-center items-center">
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-medium text-center mb-[30px] font-['DM'] text-black">Two-Factor Authentication</Text>

      <View className="items-center mb-[30px]">
        <MaterialCommunityIcons name="checkbox-multiple-marked-outline" size={40} color="#DC2626" />
      </View>

      <Text className="text-sm text-center text-[#0000008F] font-['DM'] px-2.5">
        For extra security, turn on two-step verification, which will require a PIN when registering your phone number with Keplix again.
        <Text className="text-[#DC2626]" onPress={() => Linking.openURL('https://example.com')}> Learn more</Text>
      </Text>

      <View className="mt-auto mb-5">
        <TouchableOpacity
          className="bg-[#DC2626] rounded-[70px] py-4 items-center"
          onPress={() => navigation.navigate('EnableTwoFactor')}
        >
          <Text className="text-white text-base font-medium font-['DM']">Turn On</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
