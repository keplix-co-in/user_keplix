import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CustomerSupport({ navigation }) {
  const handleCall = () => {
    const phoneNumber = 'tel:+911800123456'; // Replace with actual support number
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Error', 'Phone call is not supported on this device');
        }
      })
      .catch((err) => {
        console.error('Error opening phone dialer:', err);
        Alert.alert('Error', 'Unable to open phone dialer');
      });
  };

  const handleMessage = () => {
    // Navigate to chat screen
    navigation.navigate('ChatSupport');
  };

  const handleRaiseComplaint = () => {
    // Navigate to feedback with complaint type
    Alert.alert(
      'Raise Complaint',
      'You will be redirected to the feedback form to submit your complaint.',
      [
        {
          text: 'Continue',
          onPress: () => navigation.navigate('Feedback'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleEmail = () => {
    const email = 'mailto:support@keplix.com?subject=Support Request'; // Replace with actual email
    Linking.canOpenURL(email)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(email);
        } else {
          Alert.alert('Error', 'Email is not supported on this device');
        }
      })
      .catch((err) => {
        console.error('Error opening email client:', err);
        Alert.alert('Error', 'Unable to open email client');
      });
  };

  const options = [
    { 
      icon: 'phone', 
      title: 'Call us', 
      subtitle: 'Customer care available 24/7',
      action: handleCall,
    },
    { 
      icon: 'message-text-outline', 
      title: 'Message us', 
      subtitle: 'Chat available from 8 AM – 12 AM IST',
      action: handleMessage,
    },
    { 
      icon: 'email-outline', 
      title: 'Email us', 
      subtitle: 'We typically respond within 24 hours',
      action: handleEmail,
    },
    { 
      icon: 'alert-circle-outline', 
      title: 'Raise complaint', 
      subtitle: 'Will receive a confirmation once registered',
      action: handleRaiseComplaint,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white px-6" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="flex-row items-center px-5 pt-5 pb-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <View className="flex-1 items-center pr-10">
            <Text className="text-2xl font-semibold text-gray-900 font-dm">Customer Support</Text>
          </View>
        </View>

        <Text className="text-sm text-gray-500 mb-6 font-dm px-5">For any query regarding Keplix service. Please contact us</Text>

        {options.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            className="border border-[#E8E8E8] rounded-2xl p-5 mb-4 mx-5 bg-white active:bg-gray-50"
            onPress={item.action}
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-4">
                <MaterialCommunityIcons name={item.icon} size={24} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold font-dm text-gray-900">{item.title}</Text>
                <Text className="text-xs text-gray-500 mt-1 font-dm">{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        ))}

        <View className="mt-6 mx-5 p-5 bg-gray-50 border border-[#E8E8E8] rounded-2xl">
          <Text className="text-sm font-semibold text-gray-900 mb-3 font-dm">Support Hours</Text>
          <Text className="text-xs text-gray-600 font-dm mb-1">Phone Support: 24/7</Text>
          <Text className="text-xs text-gray-600 font-dm mb-1">Chat Support: 8 AM - 12 AM IST</Text>
          <Text className="text-xs text-gray-600 font-dm">Email Support: Response within 24 hours</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
