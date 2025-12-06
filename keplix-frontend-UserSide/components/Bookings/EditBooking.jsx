import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
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
      <View className="flex-1 bg-[rgba(49,49,49,0.5)] justify-center items-center">
        <TouchableOpacity onPress={() => setModalVisible(false)}>   
          <Ionicons name="close-outline" size={24} color="#000" className="p-1 bg-white rounded-full" />
        </TouchableOpacity>
        <View className="bg-white rounded-xl p-5 w-4/5 items-center">
          <Text className="text-xl text-center mb-5">
            Are you sure you want to cancel your booking?
          </Text>
          <TouchableOpacity
            className="bg-[#DC2626] py-3 px-6 rounded-full w-full mb-2.5"
            onPress={() => {
              setModalVisible(false);
              navigation.navigate('CancelBooking', { booking });
            }}
          >
            <Text className="text-white text-base font-medium font-dm text-center">Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center mb-5 p-5">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"arrow-back-outline"} size={30} color="#000" className="border-2 border-[#E2E2E2] rounded-full p-1" />
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-medium font-dm px-5 mb-5">Edit Booking</Text>

      <View className="flex-row justify-between px-5 mb-5">
        <View className="flex-1 mr-1">
          <Text className="text-xl font-medium font-dm mb-1">
            {booking.service?.vendor_name || 'Vendor Name'}
          </Text>
          <View className="flex-row items-center mb-4">
            <Text className="text-base font-medium font-dm text-gray-500">Service: </Text>
            <Text className="text-base font-medium font-dm">
              {booking.service?.name || 'Service Name'}
            </Text>
          </View>
          <View className="flex-row items-center mb-4">
            <Text className="text-base font-medium font-dm text-gray-500">Status: </Text>
            <Text className={`text-base font-medium font-dm capitalize ${
              booking.status === 'confirmed' ? 'text-green-600' : 
              booking.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {booking.status}
            </Text>
          </View>
          <TouchableOpacity className="bg-[#40A69F] flex-row items-center py-2.5 px-7 rounded-full self-start">
            <Ionicons name="location" size={20} color="white" />
            <Text className="text-base font-medium font-dm text-white ml-1">See location</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={
            booking.service?.image 
              ? { uri: booking.service.image } 
              : require('../../assets/images/p1.png')
          }
          className="w-[140px] h-[120px] rounded-2xl"
        />
      </View>

      <Text className="text-base font-medium font-dm text-[#0000008F] mx-5 my-2.5">Booked Slot:</Text>
      <View className="border-2 border-[#E2E2E2] rounded-3xl p-5 mx-5 mb-5">
        <View className="flex-row justify-between mb-5">
          <View className="flex-1">
            <View className="mb-4">
              <Text className="text-xs font-medium font-dm text-[#0000008F] mb-1">Date:</Text>
              <Text className="text-xl font-semibold font-dm">{formatDate(booking.booking_date)}</Text>
            </View>
            <View className="mb-4">
              <Text className="text-xs font-medium font-dm text-[#0000008F] mb-1">Time Slot:</Text>
              <Text className="text-xl font-semibold font-dm">{formatTime(booking.booking_time)}</Text>
            </View>
          </View>
          
          <View className="flex-1">
            <View className="mb-4">
              <Text className="text-xs font-medium font-dm text-[#0000008F] mb-1">Payment:</Text>
              {loadingPayment ? (
                <ActivityIndicator size="small" color="#DC2626" />
              ) : (
                <Text className="text-xl font-semibold font-dm capitalize">
                  {payment?.method || 'Not paid'}
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="text-xs font-medium font-dm text-[#0000008F] mb-1">Price:</Text>
              <Text className="text-xl font-semibold font-dm">
                {booking.service?.price ? `₹${booking.service.price}` : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          className="bg-[#40A69F] flex-row items-center justify-center p-4 rounded-lg" 
          onPress={() => navigation.navigate("RescheduleBooking", { booking })}
        >
          <Ionicons name="calendar" size={20} color="white" />
          <Text className="text-white ml-2 text-base font-medium font-dm">Reschedule Booking</Text>
        </TouchableOpacity>
      </View>

      {/* Note Section */}
      <View className="px-5 mb-5">
        <Text className="text-base font-medium font-dm mb-1">Note:</Text>
        <Text className="text-[#0000008F] text-base font-medium font-dm">
          You can cancel your booking till 1 hour before appointment and you'll receive a confirmation.
        </Text>
        {booking.notes && (
          <>
            <Text className="text-base font-medium font-dm mb-1 mt-3">Booking Notes:</Text>
            <Text className="text-[#0000008F] text-base font-medium font-dm">
              {booking.notes}
            </Text>
          </>
        )}
      </View>

      {/* Cancel Button */}
      <TouchableOpacity 
        className="bg-[#DC2626] mx-5 p-4 rounded-full items-center"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-base font-medium font-dm">Cancel Booking</Text>
      </TouchableOpacity>

      <CancelConfirmationModal />
    </SafeAreaView>
  );
};

