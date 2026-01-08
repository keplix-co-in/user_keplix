import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { paymentsAPI } from '../../services/api';

export default function EditBooking({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [payment, setPayment] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Get booking data from navigation params
  const booking = route?.params?.booking || null;

  // Fetch payment details
  useEffect(() => {
    if (booking?.id) {
      fetchPaymentDetails();
    }
  }, [booking]);

  const fetchPaymentDetails = async () => {
    try {
      setLoadingPayment(true);
      const response = await paymentsAPI.getPaymentByBooking(booking.id);
      setPayment(response.data);
    } catch (error) {
      console.log('No payment found for this booking');
    } finally {
      setLoadingPayment(false);
    }
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

  const CancelConfirmationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-6 items-center w-full">
          <View className="flex-row w-full justify-between items-start mb-2">
            <View className="w-6" />
            <Text className="text-lg font-bold text-gray-900 font-dm text-center mt-2">Cancel Booking</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1">
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Text className="text-lg font-medium text-gray-600 text-center mb-6 font-dm px-4 mt-4 leading-6">
            Are you sure you want to cancel your booking?
          </Text>
          <TouchableOpacity
            className="bg-[#DC2626] py-3.5 rounded-full w-full mb-2.5 shadow-sm"
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('CancelBooking', { booking });
            }}
          >
            <Text className="text-white text-base font-bold font-dm text-center">Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 font-dm">Booking Details</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Service Info Card */}
        <View className="flex-row items-start mb-6">
          <Image
            source={
              booking.service?.image
                ? { uri: booking.service.image }
                : require('../../assets/images/p1.png')
            }
            className="w-24 h-24 rounded-2xl bg-gray-100"
          />
          <View className="flex-1 ml-4 py-1">
            <Text className="text-xl font-bold font-dm text-gray-900 mb-1" numberOfLines={2}>
              {booking.service?.name || 'Service Name'}
            </Text>
            <Text className="text-sm font-medium text-gray-500 font-dm mb-3">
              {booking.service?.vendor_name || 'Vendor Name'}
            </Text>

            <View className="flex-row items-center">
              <View className={`px-3 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100' :
                  booking.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                <Text className={`text-xs font-bold font-dm capitalize ${booking.status === 'confirmed' ? 'text-green-700' :
                    booking.status === 'pending' ? 'text-yellow-700' : 'text-gray-600'
                  }`}>
                  {booking.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Booked Slot */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-900 font-dm mb-3">Booked Slot</Text>
          <View className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-gray-500 font-dm mb-1">Date & Time</Text>
              <Text className="text-base font-bold text-gray-900 font-dm">
                {formatDate(booking.booking_date)}
              </Text>
              <Text className="text-sm font-medium text-gray-600 font-dm mt-0.5">
                {formatTime(booking.booking_time)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("RescheduleBooking", { booking })}
              className="bg-white border border-gray-200 px-4 py-2 rounded-lg"
            >
              <Text className="text-[#DC2626] text-xs font-bold font-dm">Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Info */}
        <View className="mb-6">
          <Text className="text-base font-bold text-gray-900 font-dm mb-3">Payment Details</Text>
          <View className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-500 font-dm">Method</Text>
              <Text className="text-gray-900 font-bold font-dm capitalize">
                {loadingPayment ? 'Loading...' : (payment?.method || 'Pay on Delivery')}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500 font-dm">Total Amount</Text>
              <Text className="text-gray-900 font-bold font-dm text-lg">
                {booking.service?.price ? `₹${booking.service.price.toLocaleString('en-IN')}` : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Location */}
        <View className="mb-8">
          <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center mr-3">
                <Ionicons name="location" size={20} color="#DC2626" />
              </View>
              <View>
                <Text className="text-sm font-bold text-gray-900 font-dm">Service Location</Text>
                <Text className="text-xs text-gray-500 font-dm">View on map</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View className="p-5 border-t border-gray-100 bg-white">
        <TouchableOpacity
          className="bg-[#DC2626] w-full py-4 rounded-full items-center shadow-lg shadow-red-200"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-base font-bold font-dm">Cancel Booking</Text>
        </TouchableOpacity>
      </View>

      <CancelConfirmationModal />
    </SafeAreaView>
  );
};
