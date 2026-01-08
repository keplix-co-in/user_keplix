import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function BookingTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'rescheduled', label: 'Resched' },
  ];

  return (
    <View className="flex-row justify-between px-8 mb-6">
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)}>
          <Text
            className={`text-sm font-dm ${
              activeTab === tab.id ? 'text-[#DC2626] font-bold' : 'text-gray-400'
            }`}
          >
            {tab.label}
          </Text>
          {activeTab === tab.id && <View className="h-0.5 bg-[#DC2626] w-full mt-1" />}
        </TouchableOpacity>
      ))}
    </View>
  );
}
