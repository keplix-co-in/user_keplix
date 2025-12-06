import React from 'react';
import { View, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceCompletionModal({ visible, serviceName = 'service' }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-6">
        <View className="bg-white rounded-3xl p-8 items-center w-full max-w-sm">
          {/* Success Icon */}
          <View className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={72} color="#10B981" />
          </View>

          {/* Success Message */}
          <Text className="text-xl font-bold text-gray-900 text-center font-dm mb-2">
            Service Completed!
          </Text>
          <Text className="text-base text-gray-600 text-center font-dm leading-6">
            Your <Text className="font-semibold">{serviceName}</Text> service has been completed successfully
          </Text>
        </View>
      </View>
    </Modal>
  );
}
