import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ServiceCompletionModal from './ServiceCompletionModal';
import { bookingsAPI, paymentsAPI } from '../../services/api';

export default function ServiceProgress({ navigation, route }) {
  const { booking } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [billingDetails, setBillingDetails] = useState(null);
  const [loadingBilling, setLoadingBilling] = useState(true);

  useEffect(() => {
    if (booking?.id) {
      fetchBillingDetails();
    }
  }, [booking]);

  const fetchBillingDetails = async () => {
    try {
      setLoadingBilling(true);
      // Try to fetch payment details for billing information
      const paymentResponse = await paymentsAPI.getPaymentByBooking(booking.id);
      if (paymentResponse.data) {
        const payment = paymentResponse.data;
        setBillingDetails({
          engineCost: payment.engine_cost || 0,
          serviceCost: payment.service_cost || 0,
          additionalCost: payment.additional_cost || 0,
          total: payment.amount || 0
        });
      }
    } catch (error) {
      console.log('No payment details found, using service price');
      // Fallback to service price if payment not found
      const servicePrice = booking?.service?.price || 350;
      setBillingDetails({
        engineCost: Math.round(servicePrice * 0.5),
        serviceCost: Math.round(servicePrice * 0.3),
        additionalCost: Math.round(servicePrice * 0.2),
        total: servicePrice
      });
    } finally {
      setLoadingBilling(false);
    }
  };

  const handleSlideComplete = async () => {
    Alert.alert(
      'Complete Service',
      'Are you sure you want to mark this service as completed?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              setLoading(true);
              
              // Get user ID from AsyncStorage
              const userData = await AsyncStorage.getItem('user_data');
              if (!userData) {
                Alert.alert('Error', 'User data not found. Please login again.');
                return;
              }
              
              const user = JSON.parse(userData);
              const userId = user.user_id || user.id;
              
              // Update booking status to completed
              await bookingsAPI.updateBooking(userId, booking.id, {
                status: 'completed'
              });
              
              setShowCompletion(true);
              
              // Auto-navigate to feedback after 2.5 seconds
              setTimeout(() => {
                setShowCompletion(false);
                navigation.navigate('Feedback', { booking });
              }, 2500);
            } catch (error) {
              console.error('Error completing service:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to complete service. Please try again.'
              );
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleGetHelp = () => {
    navigation.navigate('CustomerSupport');
  };

  const BillingRow = ({ label, amount, isTotal }) => (
    <View className={`flex-row justify-between py-3 ${isTotal ? 'border-t-2 border-[#E8E8E8] mt-2 pt-4' : ''}`}>
      <Text className={`text-sm font-dm ${isTotal ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
        {label}
      </Text>
      <Text className={`text-sm font-dm ${isTotal ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
        ₹{amount}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="flex-row items-center mt-5 mb-6">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
          >
            <Ionicons name="arrow-back-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 ml-4 font-dm">Service Progress</Text>
        </View>

        {/* Service Info Card */}
        <View className="bg-white border border-[#E8E8E8] rounded-2xl p-4 mb-6">
          <View className="flex-row items-start">
            <View className="mr-3">
              <View className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden">
                {/* Service Image Placeholder */}
                <View className="w-full h-full bg-red-600 items-center justify-center">
                  <MaterialCommunityIcons name="car-wrench" size={36} color="white" />
                </View>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 font-dm mb-2">
                {booking?.provider?.name || 'Dwarka Mor Service'}
              </Text>
              <Text className="text-base text-gray-700 font-dm mb-3">
                {booking?.service?.name || 'Engine Repair'}
              </Text>
              
              {/* Estimated Time Badge */}
              <View className="flex-row items-center">
                <View className="bg-green-50 rounded-full px-3 py-1.5 flex-row items-center">
                  <Ionicons name="time-outline" size={16} color="#10B981" />
                  <Text className="text-sm text-green-600 font-semibold ml-1 font-dm">
                    Estimated Time (25 min)
                  </Text>
                </View>
                <View className="bg-red-50 rounded-full px-3 py-1.5 ml-2">
                  <Text className="text-sm text-red-600 font-semibold font-dm">On Time</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Help Button */}
        <TouchableOpacity 
          onPress={handleGetHelp}
          className="bg-white border border-[#E8E8E8] rounded-2xl p-4 mb-6 flex-row items-center"
        >
          <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-3">
            <Ionicons name="help-circle-outline" size={28} color="#DC2626" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 font-dm mb-1">
              Need help with your service?
            </Text>
            <Text className="text-sm text-gray-500 font-dm">Get help & support</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Billing Details */}
        <View className="bg-white border border-[#E8E8E8] rounded-2xl p-5 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4 font-dm">Billing Details</Text>
          
          {loadingBilling ? (
            <View className="py-8">
              <ActivityIndicator size="small" color="#DC2626" />
            </View>
          ) : billingDetails ? (
            <>
              <BillingRow label="Engine Cost" amount={billingDetails.engineCost} />
              <BillingRow label="Service Cost" amount={billingDetails.serviceCost} />
              <BillingRow label="Additional Cost" amount={billingDetails.additionalCost} />
              <BillingRow label="Total Cost" amount={billingDetails.total} isTotal />
            </>
          ) : (
            <Text className="text-sm text-gray-500 text-center py-4 font-dm">
              Billing details not available
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Slide to Complete Button - Fixed at Bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E8E8] px-6 py-5">
        <TouchableOpacity 
          onPress={handleSlideComplete}
          className="bg-red-600 rounded-full py-4 flex-row items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text className="text-white text-lg font-bold font-dm mr-2">Slide to complete</Text>
              <Ionicons name="arrow-forward-circle" size={24} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Service Completion Modal */}
      <ServiceCompletionModal 
        visible={showCompletion}
        serviceName={booking?.service?.name || 'Engine repair'}
      />
    </View>
  );
}
