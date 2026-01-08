import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

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

export default function Support({ navigation }) {
  const handleFAQPress = () => {
    navigation.navigate('FAQScreen');
  };

  const handleCustomerSupportPress = () => {
    navigation.navigate('CustomerSupport'); 
  };

  const handleFeedbackPress = () => {
    navigation.navigate('Feedback'); 
  };

  const handleHelpPress = () => {
    navigation.navigate('Help'); 
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
          <Text className="text-2xl font-semibold text-gray-900 font-dm">Support & Help</Text>
        </View>
      </View>

      <View className="mt-2">
        <MenuItem 
          icon="document-text"
          title="FAQ's"
          onPress={handleFAQPress}
        />
        <MenuItem 
          icon="headset"
          title="Customer Support"
          onPress={handleCustomerSupportPress}
        />
        <MenuItem 
          icon="chatbox"
          title="Feedback & Suggestions"
          onPress={handleFeedbackPress}
        />
        <MenuItem 
          icon="help-circle"
          title="Help"
          onPress={handleHelpPress}
          showBorder={false}  // Last item doesn't need a border
        />
      </View>
    </SafeAreaView>
  );
}
