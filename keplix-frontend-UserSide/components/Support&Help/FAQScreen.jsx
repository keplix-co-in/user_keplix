import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function FAQScreen({ navigation }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I book a service?',
      answer: 'You can book a service by browsing our service catalog, selecting your preferred service, choosing a date and time slot, and proceeding with the booking. Payment can be made securely through our app.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including credit/debit cards, UPI, net banking, and digital wallets. All transactions are secure and encrypted.',
    },
    {
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Yes, you can cancel or reschedule your booking from the Bookings section. Please note that cancellation policies may apply depending on the timing.',
    },
    {
      question: 'How do I track my service request?',
      answer: 'You can track your service request in real-time from the Bookings section. You will receive notifications for each stage of the service.',
    },
    {
      question: 'What if I\'m not satisfied with the service?',
      answer: 'Your satisfaction is our priority. If you\'re not satisfied, please contact our customer support immediately or submit feedback through the app. We will work to resolve your concerns.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to Profile > Edit Profile to update your personal information, contact details, and preferences.',
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, all payment information is encrypted and processed through secure payment gateways. We do not store your complete card details.',
    },
  ];

  const toggleFAQ = (index) => {
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

        <Text className="text-2xl font-medium mb-5 font-['DM'] text-[#0000008F]">FAQ's</Text>
        <Text className="text-sm text-[#666] mb-5 font-['DM']">Find answers to commonly asked questions</Text>

        {faqs.map((item, index) => (
          <View key={index} className="mb-2">
            <TouchableOpacity 
              className="flex-row justify-between items-center py-4 px-4 bg-[#F8F8F8] rounded-xl"
              onPress={() => toggleFAQ(index)}
            >
              <Text className="text-base font-medium font-['DM'] text-black flex-1 pr-2">
                {item.question}
              </Text>
              <Ionicons 
                name={expandedIndex === index ? "chevron-up" : "chevron-down"} 
                size={24} 
                color="#DC2626" 
              />
            </TouchableOpacity>
            
            {expandedIndex === index && (
              <View className="px-4 py-3 bg-white border-l-2 border-[#DC2626] mt-1">
                <Text className="text-sm text-[#666] font-['DM']">{item.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
