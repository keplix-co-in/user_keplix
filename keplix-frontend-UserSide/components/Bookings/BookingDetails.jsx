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
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [savingNotification, setSavingNotification] = useState(false);
  
  // Get booking data from navigation params
  const booking = route?.params?.booking || null;

  // Fetch payment details for this booking
  useEffect(() => {
    if (booking?.id) {
      fetchPaymentDetails();
      loadNotificationPreference();
    }
  }, [booking]);

  const fetchPaymentDetails = async () => {
    try {
      setLoadingPayment(true);
      const response = await paymentsAPI.getPaymentByBooking(booking.id);
      setPayment(response.data);
    } catch (error) {
      console.log('No payment found for this booking');
      // It's okay if there's no payment yet
    } finally {
      setLoadingPayment(false);
    }
  };

  const loadNotificationPreference = async () => {
    try {
      const saved = await AsyncStorage.getItem(`notification_${booking.id}`);
      if (saved !== null) {
        setNotificationsEnabled(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading notification preference:', error);
    }
  };

  const handleToggleNotification = async (value) => {
    try {
      setSavingNotification(true);
      setNotificationsEnabled(value);
      
      // Save preference locally
      await AsyncStorage.setItem(`notification_${booking.id}`, JSON.stringify(value));
      
      // Here you can also schedule/cancel local notifications
      // using expo-notifications if implemented
      
    } catch (error) {
      console.error('Error saving notification preference:', error);
      Alert.alert('Error', 'Failed to update notification preference');
      setNotificationsEnabled(!value); // Revert on error
    } finally {
      setSavingNotification(false);
    }
  };

  const handleCall = () => {
    const phoneNumber = booking.service?.vendor_phone || '+911234567890';
    Linking.openURL(`tel:${phoneNumber}`).catch(err => {
      console.error('Error opening dialer:', err);
      Alert.alert('Error', 'Unable to open phone dialer');
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center" edges={['top']}>
        <Ionicons name="alert-circle-outline" size={64} color="#9CA3AF" />
        <Text className="text-lg text-gray-600 font-dm mt-4">No booking data available</Text>
        <TouchableOpacity 
          className="bg-[#DC2626] py-3 px-6 rounded-full mt-6"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-dm font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center mb-6 px-5 pt-5">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full border border-[#E8E8E8] items-center justify-center"
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="flex-1 text-2xl font-bold text-gray-900 font-dm text-center mr-10">Booking Details</Text>
        </View>
        {/* Reminder Toggle Card */}
        <View className="bg-white mx-5 border border-[#E8E8E8] rounded-2xl p-5 mb-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-3">
                <Ionicons name="notifications-outline" size={24} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900 font-dm">Engine Repair</Text>
                <Text className="text-sm text-gray-500 font-dm mt-0.5">Engine Repair</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#DC2626" }}
              thumbColor="#ffffff"
              ios_backgroundColor="#E5E7EB"
              onValueChange={handleToggleNotification}
              value={notificationsEnabled}
              disabled={savingNotification}
              style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
            />
          </View>
        </View>

        {/* Main Booking Details Card */}
        <View className="bg-white mx-5 border border-[#E8E8E8] rounded-2xl p-5 mb-24">
          {/* Shop Details Header */}
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center mr-3">
              <MaterialCommunityIcons name="store" size={24} color="#4B5563" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900 font-dm">Shop Details:</Text>
              <Text className="text-sm text-gray-600 font-dm mt-0.5">
                {booking.service?.vendor_name || 'Dwarka mor service'}
              </Text>
            </View>
            <TouchableOpacity 
              className="w-10 h-10 bg-red-50 rounded-full items-center justify-center"
              onPress={handleCall}
            >
              <Ionicons name="call" size={20} color="#DC2626" />
            </TouchableOpacity>
          </View>

          <View className="h-px bg-[#E8E8E8] my-4" />

          {/* Location Details */}
          <View className="mb-4">
            <Text className="text-sm text-gray-500 font-dm mb-1">Location Details:</Text>
            <Text className="text-base text-gray-900 font-dm font-semibold">
              B-85, Laxmi Nagar,{'\n'}Dwarka mor – 110059
            </Text>
          </View>

          <View className="h-px bg-[#E8E8E8] my-4" />

          {/* Service Details */}
          <View className="mb-4">
            <Text className="text-sm text-gray-500 font-dm mb-1">Service Details:</Text>
            <Text className="text-base text-gray-900 font-dm font-semibold">
              {booking.service?.name || 'Engine Repair'}
            </Text>
          </View>

          <View className="h-px bg-[#E8E8E8] my-4" />

          {/* Date and Time */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-sm text-gray-500 font-dm mb-1">Date</Text>
              <View className="border border-[#E8E8E8] rounded-xl px-3 py-2.5">
                <Text className="text-sm text-gray-900 font-dm font-semibold">
                  {formatDate(booking.booking_date)}
                </Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-500 font-dm mb-1">Time</Text>
              <View className="border border-[#E8E8E8] rounded-xl px-3 py-2.5">
                <Text className="text-sm text-gray-900 font-dm font-semibold">
                  {formatTime(booking.booking_time)}
                </Text>
              </View>
            </View>
          </View>

          <View className="h-px bg-[#E8E8E8] my-4" />

          {/* Status Badge */}
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500 font-dm">Status:</Text>
            <View className={`px-4 py-2 rounded-full ${getStatusColor(booking.status)}`}>
              <Text className="text-sm font-bold font-dm capitalize">{booking.status}</Text>
            </View>
          </View>

          {/* Reference Number */}
          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-sm text-gray-500 font-dm">Reference Number:</Text>
            <View className="border border-[#E8E8E8] rounded-full px-4 py-2">
              <Text className="text-sm font-semibold font-dm text-gray-900">#{booking.id}</Text>
            </View>
          </View>

          <View className="h-px bg-[#E8E8E8] my-4" />

          {/* Reschedule Booking Button */}
          <TouchableOpacity 
            className="bg-white border border-[#E8E8E8] rounded-2xl py-4 items-center mb-3"
            onPress={() => navigation.navigate("RescheduleBooking", { booking })}
          >
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="#DC2626" />
              <Text className="text-base font-bold text-red-600 ml-2 font-dm">Reschedule Booking</Text>
            </View>
          </TouchableOpacity>

          {/* Cancel Booking Button */}
          <TouchableOpacity 
            className="bg-white border border-[#E8E8E8] rounded-2xl py-4 items-center"
            onPress={() => navigation.navigate("CancelBooking", { booking })}
          >
            <View className="flex-row items-center">
              <Ionicons name="close-circle-outline" size={20} color="#DC2626" />
              <Text className="text-base font-bold text-red-600 ml-2 font-dm">Cancel Booking</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-5 py-5 border-t border-[#E8E8E8]">
        <TouchableOpacity
          className="bg-red-600 py-4 rounded-full items-center"
          onPress={() => navigation.navigate("Homepage")}
        >
          <Text className="text-white text-base font-bold font-dm">Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
