import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentsAPI, notificationsAPI } from '../../services/api';

export default function BookingDetails({ navigation, route }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [payment, setPayment] = useState(null);

  // Get booking data from navigation params
  const booking = route?.params?.booking || null;

  // Fetch payment details for this booking
  useEffect(() => {
    if (booking?.id) {
      fetchPaymentDetails();
    }
  }, [booking]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await paymentsAPI.getPaymentByBooking(booking.id);
      setPayment(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setPayment(null);
      } else {
        console.error('Error fetching payment details:', error);
      }
    }
  };

  const handleCall = () => {
    const phoneNumber = booking?.service?.vendor_phone || '+911234567890';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const formattedDate = booking ? new Date(booking.booking_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  const formattedTime = booking ? new Date(`2000-01-01T${booking.booking_time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

  if (!booking) return null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center absolute left-4 z-10"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-bold text-gray-900 font-dm text-center">Booking Details</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>

        {/* Service List Card */}
        <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-2">
            <MaterialCommunityIcons name="engine" size={20} color="#1F2937" />
            <Text className="ml-3 text-base font-semibold text-gray-900 font-dm">{booking.service?.name}</Text>
          </View>
          {/* Duplicate for demo if needed, or map services */}
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="engine" size={20} color="#1F2937" />
            <Text className="ml-3 text-base font-semibold text-gray-900 font-dm">{booking.service?.name}</Text>
          </View>
        </View>

        {/* Token/Reference Number */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-gray-500 font-dm">Token Number</Text>
          <View className="bg-white border border-gray-200 px-4 py-1 rounded-full">
            <Text className="text-gray-900 font-semibold font-dm">{String(booking.id) || '15'}</Text>
          </View>
        </View>

        {/* Shop Details */}
        <View className="mb-6">
          <Text className="text-gray-500 text-xs mb-2 font-dm">Shop Details:</Text>
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-gray-900 font-bold text-base font-dm">{booking.service?.vendor_name}</Text>
              <Text className="text-gray-500 text-xs font-dm mt-1">{formattedDate} • {formattedTime}</Text>
            </View>
            <TouchableOpacity onPress={handleCall} className="w-8 h-8 rounded-full bg-red-50 items-center justify-center">
              <Ionicons name="call-outline" size={16} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Location Details */}
        <View className="mb-6">
          <Text className="text-gray-500 text-xs mb-2 font-dm">Location Details:</Text>
          <View className="flex-row justify-between items-start">
            <Text className="text-gray-900 font-bold text-base font-dm flex-1 mr-4">
              7 km, Location address...
            </Text>
            <TouchableOpacity className="w-8 h-8 rounded-full bg-red-50 items-center justify-center">
              <MaterialCommunityIcons name="directions" size={18} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Details */}
        <View className="mb-6">
          <Text className="text-gray-500 text-xs mb-2 font-dm">Payment Details:</Text>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 font-bold text-base font-dm">
                {payment ? (payment.method === 'card' ? 'Debit / Credit Card' : payment.method) : 'Payment Pending'}
              </Text>
              <Text className="text-gray-500 text-xs font-dm mt-1">
                {payment ? (payment.transaction_id || 'Transaction ID not available') : 'Pay at venue or complete online'}
              </Text>
            </View>
            <View className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg">
              <Text className="text-gray-900 font-semibold font-dm">
                ₹{payment ? parseFloat(payment.amount).toLocaleString() : (booking.price?.toLocaleString() || '0')}
              </Text>
            </View>
          </View>
        </View>

        {/* Support Link */}
        <TouchableOpacity className="flex-row items-center mb-6">
          <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3">
            <Ionicons name="headset-outline" size={16} color="#DC2626" />
          </View>
          <View>
            <Text className="text-gray-900 font-bold text-sm font-dm">Need help with your service?</Text>
            <Text className="text-gray-400 text-xs font-dm">Call help & support</Text>
          </View>
        </TouchableOpacity>

        {/* Booked Slot */}
        <View className="mb-6">
          <Text className="text-gray-500 text-xs mb-2 font-dm">Booked Slot:</Text>
          <View className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <View className="flex-row mb-4">
              <View className="flex-1 border-r border-gray-100">
                <Text className="text-gray-500 text-xs font-dm">Date:</Text>
                <Text className="text-gray-900 font-bold text-lg font-dm mt-1">{formattedDate}</Text>
              </View>
              <View className="flex-1 pl-4">
                <Text className="text-gray-500 text-xs font-dm">Time Slot:</Text>
                <Text className="text-gray-900 font-bold text-lg font-dm mt-1">{formattedTime}</Text>
              </View>
            </View>

            <TouchableOpacity
              className="bg-[#2D9C8D] rounded-lg py-3 flex-row items-center justify-center"
              onPress={() => navigation.navigate("RescheduleBooking", { booking })}
            >
              <Ionicons name="calendar-outline" size={18} color="white" />
              <Text className="text-white font-bold ml-2 font-dm">Reschedule Booking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cancellation Policy */}
        <View className="mb-24">
          <Text className="text-gray-500 text-xs mb-2 font-dm">Do you want to cancel your booking?</Text>
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-gray-500 text-xs font-dm text-center leading-5">
              You can cancel your booking till 1 hour before appointment and you'll receive a confirmation.
            </Text>
          </View>
          <TouchableOpacity
            className="border border-[#DC2626] rounded-xl py-3 flex-row items-center justify-center"
            onPress={() => navigation.navigate("CancelBooking", { booking })}
          >
            <Ionicons name="document-text-outline" size={18} color="#DC2626" />
            <Text className="text-[#DC2626] font-bold ml-2 font-dm">Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-100">
        <TouchableOpacity
          className="bg-[#DC2626] rounded-full py-4 items-center"
          onPress={() => navigation.navigate("Homepage")}
        >
          <Text className="text-white font-bold text-lg font-dm">Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
