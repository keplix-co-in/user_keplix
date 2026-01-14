import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BookingHeader({
  onBack,
  title,
  searchVisible,
  setSearchVisible,
  searchQuery,
  setSearchQuery,
  onFilterPress,
  isFilterActive,
}) {
  return (
    <>
      {/* Top Bar: Back Button + Dynamic Title */}
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <TouchableOpacity
          onPress={onBack}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center mr-4 z-10"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        {/* Centered Title */}
        <Text className="text-lg font-bold text-gray-900 font-dm absolute left-0 right-0 text-center">
          {title}
        </Text>
      </View>

      {/* Control Row: Search/Date & Action Buttons */}
      <View className="flex-row items-center justify-between px-5 py-4 min-h-[70px]">
        {searchVisible ? (
          <View className="flex-1 flex-row items-center bg-gray-50 rounded-full px-4 py-1 mr-3 border border-gray-200">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-2 text-base font-dm text-gray-900"
              placeholder="Search bookings..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setSearchVisible(false);
                setSearchQuery('');
              }}
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center">
            {/* 
                Todo: Make this date dynamic. 
                Currently hardcoded to preserve existing behavior from BookingList.jsx 
            */}
            <Text className="text-2xl font-bold text-gray-900 font-dm mr-2">20 Sept.</Text>
            <Text className="text-base text-gray-500 font-dm">Today</Text>
          </View>
        )}

        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`w-10 h-10 rounded-full border items-center justify-center ${
              searchVisible ? 'bg-red-50 border-red-200' : 'border-gray-200'
            }`}
            onPress={() => setSearchVisible(!searchVisible)}
          >
            <Ionicons
              name="search-outline"
              size={20}
              color={searchVisible ? '#DC2626' : '#374151'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={`w-10 h-10 rounded-full border items-center justify-center ${
              isFilterActive ? 'bg-red-50 border-red-200' : 'border-gray-200'
            }`}
            onPress={onFilterPress}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={isFilterActive ? '#DC2626' : '#374151'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
