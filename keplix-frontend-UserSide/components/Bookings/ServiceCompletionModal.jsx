import React, { useEffect, useState } from 'react';
import { View, Text, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ServiceCompletionModal({ visible, serviceName = 'service' }) {
  const [scale] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      scale.setValue(0);
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View className="flex-1 bg-black/60 items-center justify-center px-6">
        <View className="bg-white rounded-3xl p-8 items-center w-full max-w-sm shadow-xl">
          {/* Success Icon */}
          <Animated.View
            className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-6"
            style={{ transform: [{ scale }] }}
          >
            <Ionicons name="checkmark-circle" size={72} color="#10B981" />
          </Animated.View>

          {/* Success Message */}
          <Text className="text-xl font-bold text-gray-900 text-center font-dm mb-2">
            Service Completed!
          </Text>
          <Text className="text-base text-gray-600 text-center font-dm leading-6">
            Your <Text className="font-bold text-gray-900">{serviceName}</Text> service has been completed successfully
          </Text>
        </View>
      </View>
    </Modal>
  );
}
