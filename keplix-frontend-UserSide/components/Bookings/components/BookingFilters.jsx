import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

export default function BookingFilters({
  visible,
  onClose,
  filters,
  setFilters,
  onApply,
  onClear
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-gray-900 font-dm">Filters</Text>

          <TouchableOpacity onPress={onClear}>
            <Text className="text-sm font-medium text-gray-500 font-dm">Clear all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>

          {/* Date */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Date (YYYY-MM-DD)</Text>
            <View className="flex-row items-center border border-gray-200 rounded-full px-4 py-2">
              <TextInput
                className="flex-1 text-gray-900 font-semibold font-dm text-base"
                value={filters.date}
                onChangeText={(t) => setFilters({ ...filters, date: t })}
                placeholder="e.g. 2024-06-26"
              />
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            </View>
          </View>

          {/* Service Name */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Service Name</Text>
            <View className="flex-row items-center border border-gray-200 rounded-5xl px-4 py-2">
              <TextInput
                className="flex-1 text-gray-900 font-bold font-dm text-base"
                value={filters.serviceName}
                onChangeText={(t) => setFilters({ ...filters, serviceName: t })}
                placeholder="e.g. Engine"
              />
            </View>
          </View>

          {/* Service Type */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Service Type</Text>
            <View className="flex-row items-center justify-between border border-gray-200 rounded-full px-4 py-2">
              <TextInput
                className="flex-1 text-gray-900 font-bold font-dm text-base"
                value={filters.serviceType}
                onChangeText={(t) => setFilters({ ...filters, serviceType: t })}
                placeholder="e.g. Repairs"
              />
            </View>
          </View>

          {/* Payment Type */}
          <View className="mb-5">
            <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Payment Type</Text>
            <View className="flex-row items-center justify-between border border-gray-200 rounded-full px-4 py-2">
              <TextInput
                className="flex-1 text-gray-900 font-bold font-dm text-base"
                value={filters.paymentType}
                onChangeText={(t) => setFilters({ ...filters, paymentType: t })}
                placeholder="e.g. Cash"
              />
            </View>
          </View>

          {/* Token Range */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-500 font-dm mb-2">Price Range</Text>
            <View className="flex-row items-center justify-between">
              <View className="border border-gray-200 rounded-full px-6 py-2 w-[45%]">
                <TextInput
                  className="text-gray-900 font-bold font-dm text-base text-center"
                  value={filters.tokenFrom}
                  keyboardType="numeric"
                  onChangeText={(t) => setFilters({ ...filters, tokenFrom: t })}
                  placeholder="Min"
                />
              </View>
              <Text className="text-gray-500 font-medium">to</Text>
              <View className="border border-gray-200 rounded-full px-6 py-2 w-[45%]">
                <TextInput
                  className="text-gray-900 font-bold font-dm text-base text-center"
                  value={filters.tokenTo}
                  keyboardType="numeric"
                  onChangeText={(t) => setFilters({ ...filters, tokenTo: t })}
                  placeholder="Max"
                />
              </View>
            </View>
          </View>

        </ScrollView>

        {/* Apply Button */}
        <View className="p-5 border-t border-gray-100">
          <TouchableOpacity
            className="bg-[#DC2626] rounded-full py-4 items-center shadow-md"
            onPress={onApply}
          >
            <Text className="text-white text-base font-bold font-dm">Apply Filters</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </Modal>
  );
}
