import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { paymentsAPI } from '../../services/api';

const PaymentConfirmation = ({ navigation, route }) => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    createPaymentRecord();
  }, []);

  const createPaymentRecord = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user_data');
      if (!userData) {
        Alert.alert('Error', 'User not found. Please login again.');
        navigation.navigate('Login');
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.id || user.user_id;

      // Get payment data from route params
      const { amount, bookingId, paymentMethod, transactionId, service } = route?.params || {};

      if (!amount || !bookingId) {
        Alert.alert('Error', 'Payment information incomplete');
        navigation.goBack();
        return;
      }

      // Create payment record
      const paymentData = {
        booking: bookingId,
        user: userId,
        amount: parseFloat(amount),
        payment_method: paymentMethod || 'card',
        transaction_id: transactionId || `TXN${Date.now()}`,
        status: 'completed',
      };

      const response = await paymentsAPI.createPayment(paymentData);
      setPayment(response.data);
    } catch (error) {
      console.error('Error creating payment record:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleString();
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center" edges={['top']}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-gray-500 mt-2 font-dm">Processing payment...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 mb-5">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="close-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900 font-dm">Payment Details</Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 20}}>
        <View className="mx-5 border border-[#E8E8E8] rounded-2xl mb-5 p-6 bg-white"> 
          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-green-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            </View>
            <Text className="text-lg text-green-600 font-dm font-bold mb-2">Payment Successful!</Text>
            <Text className="text-3xl font-dm font-bold text-gray-900">
              ₹{payment?.amount?.toLocaleString() || '0'}
            </Text>
          </View>
          
          <View className="h-px bg-gray-200 my-4" />
          
          <View className="py-2">
            <TextRow label="Transaction Number" value={payment?.transaction_id || 'N/A'} />
            <TextRow label="Payment Time" value={formatDate(payment?.payment_date)} />
            <TextRow 
              label="Payment Method" 
              value={payment?.payment_method === 'card' ? 'Debit/Credit Card' : 
                     payment?.payment_method === 'upi' ? 'UPI' :
                     payment?.payment_method === 'netbanking' ? 'Net Banking' :
                     payment?.payment_method === 'cash' ? 'Cash on Delivery' : 
                     'Other'} 
            />
            <TextRow 
              label="Status" 
              value={payment?.status === 'completed' ? '✓ Success' : 
                     payment?.status === 'pending' ? 'Pending' : 
                     'Failed'} 
            />
            
            <View className="h-px bg-gray-200 my-4" />
            
            <TextRow label="Amount" value={`₹${payment?.amount?.toLocaleString() || '0'}`} />
            <TextRow label="Processing Fee" value="₹0.00" />
          </View>
        </View>
       
        <TouchableOpacity 
          className="bg-red-600 py-4 mx-5 rounded-full items-center mb-3"  
          onPress={() => {
            // Navigate to bookings or home
            navigation.reset({
              index: 0,
              routes: [{ name: 'Homepage' }],
            });
          }}
        >
          <Text className="text-white text-base font-bold font-dm">Go to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-white border border-[#E8E8E8] py-4 mx-5 rounded-full items-center"
          onPress={() => navigation.navigate('BookingList')}
        >
          <Text className="text-gray-700 text-base font-bold font-dm">View Bookings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const TextRow = ({ label, value }) => (
  <View className="flex-row justify-between my-2.5">
    <Text className="text-sm text-gray-600 font-dm">{label}</Text>
    <Text className="text-sm text-gray-900 text-right font-semibold font-dm">{value}</Text>
  </View>
);

export default PaymentConfirmation;
