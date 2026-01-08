import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicy({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-5 pt-5 pb-4 border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1 items-center pr-10">
          <Text className="text-xl font-semibold text-gray-900 font-dm">Privacy Policy</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-5">
        <Text className="text-base text-gray-600 font-dm leading-6 mb-4">
          Last updated: January 2026
        </Text>

        <Text className="text-lg font-bold text-gray-900 font-dm mb-2">1. Introduction</Text>
        <Text className="text-base text-gray-600 font-dm leading-6 mb-6">
          Welcome to Keplix. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our app and tell you about your privacy rights and how the law protects you.
        </Text>

        <Text className="text-lg font-bold text-gray-900 font-dm mb-2">2. Data We Collect</Text>
        <Text className="text-base text-gray-600 font-dm leading-6 mb-6">
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows: Identity Data, Contact Data, Financial Data, Transaction Data, Technical Data, Profile Data, Usage Data, and Location Data.
        </Text>

        <Text className="text-lg font-bold text-gray-900 font-dm mb-2">3. How We Use Your Data</Text>
        <Text className="text-base text-gray-600 font-dm leading-6 mb-6">
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          {'\n'}• To register you as a new customer.
          {'\n'}• To process and deliver your order.
          {'\n'}• To manage our relationship with you.
          {'\n'}• To enable you to partake in a prize draw, competition or complete a survey.
          {'\n'}• To improve our website, products/services, marketing or customer relationships.
        </Text>

        <Text className="text-lg font-bold text-gray-900 font-dm mb-2">4. Data Security</Text>
        <Text className="text-base text-gray-600 font-dm leading-6 mb-6">
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
        </Text>

        <Text className="text-lg font-bold text-gray-900 font-dm mb-2">5. Contact Us</Text>
        <Text className="text-base text-gray-600 font-dm leading-6 mb-10">
          If you have any questions about this privacy policy or our privacy practices, please contact us at support@keplix.com.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
