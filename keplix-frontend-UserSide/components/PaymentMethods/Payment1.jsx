import React, { useState, useEffect } from "react"; 
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Payment1({ navigation, route }) {
  const [amount, setAmount] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    // Get amount and booking info from route params
    const bookingData = route?.params?.booking;
    const service = route?.params?.service;
    const paymentAmount = route?.params?.amount || bookingData?.total_price || service?.price || 0;
    
    setAmount(paymentAmount);
    setBookingId(bookingData?.id);
    setServiceData(service || bookingData?.service);
  }, [route?.params]);
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center px-5 pt-5 pb-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1 items-center pr-10">
          <Text className="text-2xl font-semibold text-gray-900 font-dm">Payment</Text>
        </View>
      </View>

      <Text className="text-base text-gray-500 mb-6 font-dm px-5">Select payment method</Text>

      <View className="flex-1 px-4">
        <TouchableOpacity 
          className="flex-row items-center justify-between p-5 border border-[#E8E8E8] rounded-2xl mb-4 bg-white"
          onPress={() => navigation.navigate("Payment2", { amount, bookingId, service: serviceData })}
        >
          <View className="flex-row items-center flex-1 gap-4">
            <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
              <Fontisto name="credit-card" size={20} color="#374151" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 font-dm">Debit / Credit Card</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center justify-between p-5 border border-[#E8E8E8] rounded-2xl mb-4 bg-white"
          onPress={() => navigation.navigate("Payment5", { amount, bookingId, service: serviceData })}
        >
          <View className="flex-row items-center flex-1 gap-4">
            <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
              <FontAwesome name="bank" size={20} color="#374151" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 font-dm">Net Banking</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center justify-between p-5 border border-[#E8E8E8] rounded-2xl mb-4 bg-white"
          onPress={() => navigation.navigate("Payment4", { amount, bookingId, service: serviceData })}
        >
          <View className="flex-row items-center flex-1 gap-4">
            <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
              <FontAwesome5 name="rupee-sign" size={22} color="#374151" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 font-dm">UPI</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center justify-between p-5 border border-[#E8E8E8] rounded-2xl mb-4 bg-white"
          onPress={() => navigation.navigate("PaymentSuccess", { 
            amount, 
            bookingId, 
            service: serviceData,
            paymentMethod: 'cash'
          })}
        >
          <View className="flex-row items-center flex-1 gap-4">
            <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center">
              <MaterialCommunityIcons name="cash" size={28} color="#374151" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 font-dm">Cash on Delivery</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View className="bg-white px-5 py-4 border-t border-gray-100">
        <View className="mb-3">
          <Text className="text-gray-500 text-sm font-dm text-center">Total Amount</Text>
          <Text className="text-2xl font-bold text-gray-900 font-dm text-center mt-1">₹{amount.toLocaleString()}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
