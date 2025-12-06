import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Help({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const helpTopics = [
    {
      title: 'Getting Started',
      description: 'Learn how to create an account, complete your profile, and book your first service. Browse through available services and select the one that fits your needs.',
    },
    {
      title: 'Managing Bookings',
      description: 'View all your bookings in one place. You can track service status, reschedule appointments, or cancel bookings if needed. Receive real-time updates on your service progress.',
    },
    {
      title: 'Payment Methods',
      description: 'Add, update, or remove payment methods. We support credit/debit cards, UPI, net banking, and digital wallets. All transactions are secure and encrypted.',
    },
    {
      title: 'Service Quality',
      description: 'We ensure all our service providers are verified and trained. If you have any concerns about service quality, please contact our support team immediately.',
    },
    {
      title: 'Account Security',
      description: 'Protect your account with strong passwords and enable two-factor authentication. Never share your login credentials with anyone.',
    },
    {
      title: 'Notifications',
      description: 'Manage your notification preferences to stay updated about your bookings, special offers, and service updates. You can customize notifications in Settings.',
    },
    {
      title: 'Refunds & Cancellations',
      description: 'Understand our refund and cancellation policies. Refunds are processed within 5-7 business days. Cancellation charges may apply based on timing.',
    },
  ];

  const toggleTopic = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mt-5 mb-5">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mt-2.5 w-10 h-10 rounded-[20px] border-2 border-[#E2E2E2] justify-center items-center">
            <Ionicons name="arrow-back-outline" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <Text className="text-2xl font-medium mb-5 font-['DM'] text-[#0000008F]">Help</Text>
        <Text className="text-sm text-[#666] mb-5 font-['DM']">Browse help topics to find quick answers</Text>

        {helpTopics.map((item, index) => (
          <View key={index} className="mb-2">
            <TouchableOpacity 
              className="flex-row justify-between items-center py-4 px-4 bg-[#F8F8F8] rounded-xl"
              onPress={() => toggleTopic(index)}
            >
              <View className="flex-1 pr-2">
                <Text className="text-base font-medium font-['DM'] text-black">{item.title}</Text>
              </View>
              <Ionicons 
                name={expandedIndex === index ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="#DC2626" 
              />
            </TouchableOpacity>
            
            {expandedIndex === index && (
              <View className="px-4 py-3 bg-white border-l-2 border-[#DC2626] mt-1">
                <Text className="text-sm text-[#666] font-['DM'] leading-5">{item.description}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
