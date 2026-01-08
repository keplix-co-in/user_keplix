import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";

export default function Payment3({ navigation, route }) {
  const [otp, setOtp] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(true);
  const [resendModalVisible, setResendModalVisible] = useState(false);
  const [invalidOtpModalVisible, setInvalidOtpModalVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [bookingId, setBookingId] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const correctOtp = "123456";

  useEffect(() => {
    // Get payment info from route params
    const { amount: paymentAmount, bookingId: booking, service } = route?.params || {};
    setAmount(paymentAmount || 0);
    setBookingId(booking);
    setServiceData(service);
  }, [route?.params]);

  const CheckboxComponent = () => (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={() => setIsSaved(!isSaved)}
    >
      <View className={`w-5 h-5 rounded border-2 items-center justify-center ${isSaved ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
        {isSaved && <Ionicons name="checkmark" size={14} color="white" />}
      </View>
      <Text className="ml-3 text-sm text-gray-700 font-dm">Save details for future payments</Text>
    </TouchableOpacity>
  );

  const handleResendOtp = () => {
    setResendModalVisible(true);
    // Simulate OTP resend
    setTimeout(() => {
      setResendModalVisible(false);
    }, 2000);
  };

  const handlePayment = () => {
    if (otp === correctOtp) {
      navigation.navigate("PaymentSuccess", {
        amount,
        bookingId,
        service: serviceData,
        paymentMethod: 'card',
        transactionId: `TXN${Date.now()}`,
      });
    } else {
      setInvalidOtpModalVisible(true);
      setShowCheckbox(false); // Remove checkbox when invalid OTP is entered
    }
  };

  const closeInvalidOtpModal = () => {
    setInvalidOtpModalVisible(false);
    setOtp(""); // Clear the OTP field
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 mb-5">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full border-2 border-[#E8E8E8] items-center justify-center"
        >
          <Ionicons name="arrow-back-outline" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-900 font-dm">Payment</Text>
        <View className="w-10" />
      </View>

      <Text className="text-sm text-gray-500 mb-6 font-dm px-5">Enter OTP to complete payment</Text>

      <View className="mx-5 border border-[#E8E8E8] rounded-2xl mb-5 p-5 bg-white">
        <View className="flex-row items-center mb-5">
          <View className="w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-3">
            <Fontisto name="credit-card" size={24} color="#DC2626" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 font-dm">Debit / Credit Card</Text>
          </View>
        </View>

        <Text className="text-sm text-gray-600 mb-2 font-dm">OTP sent to xxxxxx3245</Text>
        <TextInput
          className="h-12 border border-[#E8E8E8] rounded-xl px-4 text-base mb-4 font-dm bg-gray-50"
          placeholder="Enter 6-digit OTP"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />
        <TouchableOpacity 
          onPress={handleResendOtp}
          className="py-3 rounded-full border border-[#E8E8E8] bg-white items-center mb-5"
        >
          <Text className="text-red-600 text-sm font-semibold font-dm">Resend OTP</Text>
        </TouchableOpacity>

        {showCheckbox && CheckboxComponent()}
      </View>

      <TouchableOpacity
        className={`py-4 rounded-full items-center mx-5 mb-5 ${otp.length === 6 ? 'bg-red-600' : 'bg-gray-300'}`}
        disabled={otp.length !== 6}
        onPress={handlePayment}
      >
        <Text className="text-white text-base font-bold font-dm">
          Pay ₹{amount.toLocaleString()}
        </Text>
      </TouchableOpacity>

      {/* Resend OTP Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={resendModalVisible}
        onRequestClose={() => setResendModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 w-[85%] items-center">
            <View className="w-16 h-16 bg-green-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark-circle" size={40} color="#10B981" />
            </View>
            <Text className="text-lg font-bold mb-2 text-gray-900 font-dm">OTP Sent</Text>
            <Text className="text-sm text-gray-600 text-center font-dm">
              A new OTP has been sent to xxxxxx3245
            </Text>
          </View>
        </View>
      </Modal>

      {/* Invalid OTP Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={invalidOtpModalVisible}
        onRequestClose={closeInvalidOtpModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 w-[85%] items-center">
            <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
              <Ionicons name="close-circle" size={40} color="#DC2626" />
            </View>
            <Text className="text-lg font-bold mb-2 text-gray-900 font-dm">Invalid OTP</Text>
            <Text className="text-sm text-gray-600 text-center mb-6 font-dm">
              The OTP you entered is incorrect. Please try again.
            </Text>
            <TouchableOpacity
              className="bg-red-600 py-3 px-8 rounded-full w-full"
              onPress={closeInvalidOtpModal}
            >
              <Text className="text-white text-base font-bold text-center font-dm">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
