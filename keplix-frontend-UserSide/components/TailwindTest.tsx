import React from 'react';
import { View, Text } from 'react-native';

export default function TailwindTest() {
  return (
    <View className="flex-1 items-center justify-center bg-pink-500">
      <Text className="text-white text-2xl font-bold p-8 text-center">
        If you see a pink screen, Tailwind is working.
      </Text>
    </View>
  );
}
